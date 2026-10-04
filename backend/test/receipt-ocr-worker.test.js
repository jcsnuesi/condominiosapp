"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("node:http");
const { processOne } = require("../service/receiptOcrWorker");

test("receipt worker sends original binary and authentication over HTTP and saves extraction", async () => {
  const original = Buffer.from("synthetic receipt bytes");
  const token = "synthetic-ocr-test-token-1234567890";
  const server = createServer(async (req, res) => {
    assert.equal(req.method, "POST");
    assert.equal(req.url, "/extract");
    assert.equal(req.headers["content-type"], "image/png");
    assert.equal(req.headers["x-ocr-token"], token);
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    assert.deepEqual(Buffer.concat(chunks), original);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ fields: { amount: "1500.00", currency: "DOP", reference: "0000123" }, reconciliationStatus: "confirmed" }));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const previousUrl = process.env.OCR_SERVICE_URL;
  const previousToken = process.env.OCR_SERVICE_TOKEN;
  const updates = [];
  const Model = {
    updateMany: async () => {},
    findOneAndUpdate: () => ({ select: async () => ({ _id: "receipt", mimeType: "image/png", fileData: original, attempts: 1 }) }),
    updateOne: async (filter, update) => updates.push({ filter, update }),
  };
  process.env.OCR_SERVICE_URL = `http://127.0.0.1:${server.address().port}`;
  process.env.OCR_SERVICE_TOKEN = token;
  try {
    await processOne(Model, "ocrStatus", "/extract");
    assert.equal(updates[0].update.$set.ocrStatus, "ready");
    assert.equal(updates[0].update.$set.fields.reference, "0000123");
    assert.equal(updates[0].update.$set.reconciliationStatus, undefined);
    delete process.env.OCR_SERVICE_URL;
    await processOne(Model, "ocrStatus", "/extract", async url => {
      assert.equal(url.href, "http://ocr-service:2020/extract");
      throw new TypeError("fetch failed", { cause: { code: "ENOTFOUND" } });
    });
    assert.equal(updates[1].update.$set.ocrStatus, "queued");
    assert.equal(updates[1].update.$set.error, "OCR_SERVICE_UNREACHABLE");
  } finally {
    if (previousUrl === undefined) delete process.env.OCR_SERVICE_URL; else process.env.OCR_SERVICE_URL = previousUrl;
    if (previousToken === undefined) delete process.env.OCR_SERVICE_TOKEN; else process.env.OCR_SERVICE_TOKEN = previousToken;
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
