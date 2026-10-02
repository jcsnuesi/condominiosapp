"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const rules = require("../service/bankReconciliationRules");
const worker = require("../service/receiptOcrWorker");
const { _helpers } = require("../controllers/bankReconciliation");

test("money rejects ambiguous locale, negative, fractional cents and missing values", () => {
  for (const value of ["1,000", "1.000,00", "-1", "0", "1.234", "", null, "Infinity", {}, "1e3"]) assert.throws(() => rules.moneyMinor(value));
  assert.equal(rules.moneyMinor("0.01"), 1);
  assert.equal(rules.moneyMinor("0100.10"), 10010);
});
test("dates must be exact valid calendar dates and references retain leading zeros", () => {
  for (const value of ["01/02/2026", "2026-02-29", "2026-13-01", "2026-1-01", "invalid"]) assert.throws(() => rules.dateOnly(value));
  assert.equal(rules.dateOnly("2024-02-29"), "2024-02-29");
  assert.equal(rules.normalizeFields({ amount: "2", date: "2026-10-01", currency: "DOP", reference: "00012" }).reference, "00012");
});
test("partial payments preserve debt, excess creates credit and legacy completed invoices create only credit", () => {
  assert.deepEqual(rules.allocatePayment({ amount: 1000, paidAmount: 0, paymentStatus: "pending" }, 40000), { appliedAmount: 400, creditAmount: 0, remainingBalance: 600, paidAmount: 400 });
  assert.deepEqual(rules.allocatePayment({ amount: 1000, paidAmount: 400, paymentStatus: "pending" }, 80000), { appliedAmount: 600, creditAmount: 200, remainingBalance: 0, paidAmount: 1000 });
  assert.deepEqual(rules.allocatePayment({ amount: 1000, paymentStatus: "completed" }, 80000), { appliedAmount: 0, creditAmount: 800, remainingBalance: 0, paidAmount: 1000 });
  assert.throws(() => rules.allocatePayment({ amount: 1000, paidAmount: 1001 }, 100));
});
const fields = { amount: "100.00", currency: "DOP", date: "2026-10-01", reference: "000123" };
const movement = { amountMinor: 10000, currency: "DOP", date: "2026-10-03", direction: "credit", reference: "000123", allocatedReceiptId: null };
test("candidate matching requires credit, amount, currency, bounded date and unused movement", () => {
  assert.equal(rules.compareReceipt(fields, movement).eligible, true);
  for (const change of [{ amountMinor: 9999 }, { currency: "USD" }, { direction: "debit" }, { date: "2026-10-07" }, { allocatedReceiptId: "used" }]) assert.equal(rules.compareReceipt(fields, { ...movement, ...change }).eligible, false);
  assert.equal(rules.compareReceipt({}, movement).eligible, false);
  assert.equal(rules.compareReceipt({ ...fields, reference: "" }, movement).referenceMatches, false);
});
test("same amount distinct bank references remain distinct; altered descriptions cannot bypass known-reference duplicates", () => {
  const row = { ...fields, direction: "credit", description: "Ingreso", sourceRow: 2 };
  const [first, second] = rules.normalizeStatementRows([row, { ...row, reference: "000124", sourceRow: 3 }], "DOP");
  assert.notEqual(first.fingerprint, second.fingerprint);
  assert.throws(() => rules.normalizeStatementRows([row, { ...row, description: "Otra descripción" }], "DOP"), { code: "AMBIGUOUS_DUPLICATE" });
  assert.throws(() => rules.normalizeStatementRows([{ ...row, direction: "unknown" }], "DOP"));
  assert.throws(() => rules.normalizeStatementRows([row], "USD"));
});
test("OCR output cannot assert payment status or confirmation", () => {
  const sanitized = worker.safeResult({ fields, status: "paid", paymentStatus: "completed", reconciliationStatus: "confirmed", requiresReview: false, rows: [], text: "Text" });
  assert.equal(sanitized.ocr.requiresReview, true);
  assert.equal(sanitized.paymentStatus, undefined);
  assert.equal(sanitized.reconciliationStatus, undefined);
  assert.deepEqual(sanitized.fields, { ...fields, bank: null });
  assert.throws(() => worker.safeResult({ text: "a".repeat(3 * 1024 * 1024) }));
  assert.throws(() => worker.safeResult({ rawRows: Array.from({ length: 1001 }, () => ["row"]) }), /OCR_TOO_MANY_ROWS/);
});
test("original file detection supports UTF16 CSV and rejects executable/mislabeled receipt", () => {
  const utf16 = Buffer.concat([Buffer.from([255, 254]), Buffer.from("Fecha\tMonto\n2026-10-01\t10", "utf16le")]);
  assert.equal(_helpers.original({ file: { buffer: utf16, originalname: "estado.csv" } }, "statement").mimeType, "text/csv");
  const withoutBom = Buffer.from("Titular,Cuenta\r\nEjemplo,123\r\nFecha,Monto\r\n01/10/2026,10.00", "utf16le");
  assert.equal(_helpers.original({ file: { buffer: withoutBom, originalname: "movimientos.csv" } }, "statement").mimeType, "text/csv");
  assert.throws(() => _helpers.original({ file: { buffer: Buffer.from([77, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), originalname: "binary.csv" } }, "statement"));
  assert.throws(() => _helpers.original({ file: { buffer: Buffer.from("MZfake"), originalname: "receipt.pdf" } }, "receipt"));
  assert.throws(() => _helpers.original({ file: { buffer: Buffer.alloc(8 * 1024 * 1024 + 1), originalname: "big.csv" } }, "statement"));
});
test("financial permissions and owner scope fail closed", () => {
  assert.throws(() => _helpers.access({ user: { role: "OWNER" }, auth: { organizationId: "org" } }, true), { status: 403 });
  assert.throws(() => _helpers.access({ user: { role: "STAFF_ADMIN" }, auth: { organizationId: "org", permissions: ["finance.read"] } }, true, "finance.update"), { status: 403 });
  assert.doesNotThrow(() => _helpers.access({ user: { role: "OWNER" }, auth: { organizationId: "org" } }));
});

test("delegated confirmation/import permissions use finance.update and credits use finance.read", () => {
  const { enforceAdministrativePermission } = require("../middleware/organizationAuth");
  for (const [path, method, permission] of [["/payments/receipts/123/confirm", "POST", "finance.update"], ["/payments/statements/123/commit", "POST", "finance.update"], ["/payments/owner-credits", "GET", "finance.read"]]) {
    let passed = false;
    const req = { path, method, auth: { role: "STAFF_ADMIN", permissions: [permission], scope: { mode: "ALL" } } };
    const res = { status() { return this; }, send(body) { assert.fail(JSON.stringify(body)); } };
    enforceAdministrativePermission(req, res, () => { passed = true; });
    assert.equal(passed, true);
  }
});

test("durable worker updates only its leased job and never financial state", async () => {
  const calls = [];
  const Model = {
    updateMany: async () => {},
    findOneAndUpdate: () => ({ select: async () => ({ _id: "job", mimeType: "image/png", fileData: Buffer.from("image"), attempts: 1 }) }),
    updateOne: async (filter, update) => { calls.push({ filter, update }); },
  };
  const previousToken = process.env.OCR_SERVICE_TOKEN;
  process.env.OCR_SERVICE_TOKEN = "local-test-only";
  try {
    assert.equal(await worker.processOne(Model, "ocrStatus", "/extract", async () => ({ ok: true, json: async () => ({ fields, status: "paid", reconciliationStatus: "confirmed" }) })), true);
    assert.equal(calls[0].update.$set.ocrStatus, "ready");
    assert.equal(calls[0].update.$set.reconciliationStatus, undefined);
    assert.equal(calls[0].filter._id, "job");
    assert.match(calls[0].filter.leaseToken, /^[0-9a-f-]{36}$/);
    assert.equal(calls[0].filter.ocrStatus, "processing");
  } finally { if (previousToken === undefined) delete process.env.OCR_SERVICE_TOKEN; else process.env.OCR_SERVICE_TOKEN = previousToken; }
});

test("durable worker exhausts attempts visibly without storing service error content", async () => {
  let failure;
  const Model = {
    updateMany: async () => {},
    findOneAndUpdate: () => ({ select: async () => ({ _id: "job", mimeType: "image/png", fileData: Buffer.from("image"), attempts: 3 }) }),
    updateOne: async (_filter, update) => { failure = update; },
  };
  const previousToken = process.env.OCR_SERVICE_TOKEN;
  process.env.OCR_SERVICE_TOKEN = "local-test-only";
  try {
    await worker.processOne(Model, "ocrStatus", "/extract", async () => { throw new Error("secret service details"); });
    assert.equal(failure.$set.ocrStatus, "failed");
    assert.equal(failure.$set.error, "OCR_PROCESSING_FAILED");
  } finally { if (previousToken === undefined) delete process.env.OCR_SERVICE_TOKEN; else process.env.OCR_SERVICE_TOKEN = previousToken; }
});

test("legacy manual reconciliation and webhooks cannot approve bank transfers", async () => {
  const PaymentTransaction = require("../models/paymentTransaction");
  const payment = require("../controllers/payment");
  const gateway = require("../service/paymentGateway");
  const originalFind = PaymentTransaction.findById, originalVerify = gateway.verifyWebhookSignature;
  const org = "507f1f77bcf86cd799439011", condo = "507f1f77bcf86cd799439012";
  const response = () => ({ statusCode: 0, body: null, status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; return this; } });
  try {
    PaymentTransaction.findById = async () => ({ organizationId: org, condominiumId: condo, provider: "TRANSFERENCIA", reconciliationStatus: "manual_review", save() { assert.fail("Transfer must never save here"); } });
    const manual = response();
    await payment.reconcilePaymentTransaction({ user: { role: "ADMIN", sub: org }, auth: { organizationId: org, scope: { mode: "ALL" } }, params: { id: org }, body: { reconciliationStatus: "matched" } }, manual);
    assert.equal(manual.statusCode, 409); assert.equal(manual.body.code, "BANK_EVIDENCE_REQUIRED");
    gateway.verifyWebhookSignature = () => true;
    const webhook = response();
    await payment.handlePaymentWebhook({ headers: {}, body: { provider: "TRANSFERENCIA", providerTransactionId: "transfer-123", status: "paid" } }, webhook);
    assert.equal(webhook.statusCode, 400); assert.equal(webhook.body.code, "BANK_EVIDENCE_REQUIRED");
  } finally { PaymentTransaction.findById = originalFind; gateway.verifyWebhookSignature = originalVerify; }
});
