"use strict";

// Exercise the real worker HTTP path without creating receipts or changing MongoDB.
require("dotenv").config({ quiet: true });
const fs = require("node:fs");
const path = require("node:path");
const { processOne } = require("../service/receiptOcrWorker");

async function main() {
  const filename = process.argv[2];
  const mimeType = { ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".png": "image/png", ".pdf": "application/pdf" }[path.extname(filename || "").toLowerCase()];
  if (!mimeType) throw new Error("Supply a JPEG, PNG or PDF receipt path");
  const fileData = fs.readFileSync(filename);
  if (fileData.length > 8 * 1024 * 1024) throw new Error("Receipt exceeds 8 MiB");
  const health = await fetch(new URL("/health", process.env.OCR_SERVICE_URL || "http://ocr-service:2020"), { signal: AbortSignal.timeout(5000) });
  console.log(JSON.stringify({ healthStatus: health.status }));
  if (!health.ok) throw new Error("OCR health check failed");
  let result;
  const Model = {
    updateMany: async () => {},
    findOneAndUpdate: () => ({ select: async () => ({ _id: "diagnostic-only", attempts: 1, mimeType, fileData }) }),
    updateOne: async (_filter, update) => { result = update.$set; },
  };
  await processOne(Model, "ocrStatus", "/extract");
  console.log(JSON.stringify({ ocrStatus: result.ocrStatus, error: result.error, fields: result.fields, engine: result.ocr?.engine, recognizedLines: result.ocr?.lines.length, requiresReview: result.ocr?.requiresReview }));
  if (result.ocrStatus !== "ready") process.exitCode = 1;
}

main().catch(() => { console.error("OCR diagnostic failed; check service configuration and availability"); process.exitCode = 1; });
