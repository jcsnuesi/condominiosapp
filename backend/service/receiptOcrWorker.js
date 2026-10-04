"use strict";

const { randomUUID } = require("crypto");
const { TransferReceipt, BankStatement } = require("../models/bankReconciliation");
const LEASE_MS = 5 * 60 * 1000;
let running = false;
let timer;

// Only these bounded keys enter Mongo. Never accept payment/confirmation status
// from the extraction service: it is an untrusted information source.
function safeResult(raw) {
  if (!raw || typeof raw !== "object" || JSON.stringify(raw).length > 2 * 1024 * 1024) throw new Error("OCR_RESULT_INVALID");
  const text = typeof raw.text === "string" ? raw.text.slice(0, 300000) : "";
  const lines = Array.isArray(raw.lines) ? raw.lines.slice(0, 15000) : [];
  const warnings = Array.isArray(raw.warnings) ? raw.warnings.map(String).map((v) => v.slice(0, 500)).slice(0, 50) : [];
  const fields = {};
  for (const key of ["amount", "date", "reference", "bank", "currency"]) {
    const value = raw.fields?.[key];
    fields[key] = ["string", "number"].includes(typeof value) ? String(value).slice(0, 120) : null;
  }
  const headers = Array.isArray(raw.headers) ? raw.headers.slice(0, 50).map((v) => String(v).slice(0, 200)) : [];
  const rawRows = Array.isArray(raw.rawRows) ? raw.rawRows.slice(0, 1000).filter(Array.isArray).map((row) => row.slice(0, 50).map((v) => String(v).slice(0, 500))) : [];
  if (raw.rows?.length > 1000 || raw.rawRows?.length > 1000) throw new Error("OCR_TOO_MANY_ROWS_SPLIT_STATEMENT");
  return { fields, headers, rawRows, rows: Array.isArray(raw.rows) ? raw.rows : [], warnings, ocr: { text, lines, engine: String(raw.engine || "PaddleOCR").slice(0, 80), version: String(raw.version || "").slice(0, 80), requiresReview: true, originalFields: fields } };
}

async function processOne(Model, statusKey, endpoint, fetchImpl = fetch) {
  const now = new Date();
  // A process crash on the final attempt must leave a terminal and visible error.
  await Model.updateMany({ [statusKey]: "processing", leaseUntil: { $lt: now }, attempts: { $gte: 3 } }, { $set: { [statusKey]: "failed", error: "OCR_RETRIES_EXHAUSTED" }, $unset: { leaseToken: 1, leaseUntil: 1 } });
  const leaseToken = randomUUID();
  const job = await Model.findOneAndUpdate({ attempts: { $lt: 3 }, $or: [{ [statusKey]: "queued", $or: [{ nextAttemptAt: null }, { nextAttemptAt: { $lte: now } }] }, { [statusKey]: "processing", leaseUntil: { $lt: now } }] }, { $set: { [statusKey]: "processing", leaseUntil: new Date(Date.now() + LEASE_MS), leaseToken }, $inc: { attempts: 1 } }, { returnDocument: "after", sort: { createdAt: 1 } }).select("+fileData");
  if (!job) return false;
  try {
    const url = new URL(endpoint, process.env.OCR_SERVICE_URL || "http://ocr-service:2020");
    const token = process.env.OCR_SERVICE_TOKEN;
    if (!token) throw new Error("OCR_SERVICE_NOT_CONFIGURED");
    const response = await fetchImpl(url, { method: "POST", headers: { "Content-Type": job.mimeType, "X-OCR-Token": token }, body: job.fileData, signal: AbortSignal.timeout(180000) });
    if (!response.ok) throw new Error(`OCR_HTTP_${response.status}`);
    const result = safeResult(await response.json());
    await Model.updateOne({ _id: job._id, leaseToken, [statusKey]: "processing" }, { $set: { [statusKey]: "ready", ocr: result.ocr, warnings: result.warnings, ...(endpoint === "/extract" ? { fields: result.fields } : { rows: result.rows, headers: result.headers, rawRows: result.rawRows }) }, $unset: { leaseToken: 1, leaseUntil: 1, error: 1 } });
  } catch (error) {
    // Do not persist service response bodies, URLs, credentials, or stack traces.
    const connectionCode = error.cause?.code;
    const reason = /^OCR_[A-Z0-9_]+$/.test(error.message) ? error.message
      : ["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ENETUNREACH", "EHOSTUNREACH"].includes(connectionCode) ? "OCR_SERVICE_UNREACHABLE"
      : ["TimeoutError", "AbortError"].includes(error.name) ? "OCR_SERVICE_TIMEOUT"
      : "OCR_PROCESSING_FAILED";
    await Model.updateOne({ _id: job._id, leaseToken }, { $set: { [statusKey]: job.attempts >= 3 ? "failed" : "queued", error: reason, nextAttemptAt: new Date(Date.now() + job.attempts * 30000) }, $unset: { leaseToken: 1, leaseUntil: 1 } });
  }
  return true;
}
async function tick() {
  if (running) return;
  running = true;
  try {
    await processOne(TransferReceipt, "ocrStatus", "/extract");
    await processOne(BankStatement, "status", "/statement");
  } catch (error) { console.error("Receipt OCR queue unavailable"); }
  finally { running = false; }
}
function start() { if (!timer) { timer = setInterval(tick, 5000); timer.unref(); } }
function stop() { clearInterval(timer); timer = undefined; }
module.exports = { start, stop, tick, processOne, safeResult };
