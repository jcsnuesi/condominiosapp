"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const crypto = require("crypto");
const controller = require("../controllers/bankReconciliation");
const Invoice = require("../models/invoice");
const PaymentTransaction = require("../models/paymentTransaction");
const models = require("../models/bankReconciliation");
const { BankAccount, TransferReceipt, BankStatement, BankMovement, OwnerCredit } = models;
const worker = require("../service/receiptOcrWorker");

test("bank reconciliation uses atomic evidence and isolates owners", { skip: !process.env.BANK_TEST_MONGODB_URI }, async (t) => {
  // Always use a newly named database, never the database named in the URI.
  const dbName = `ocr_test_${crypto.randomBytes(8).toString("hex")}`;
  await mongoose.connect(process.env.BANK_TEST_MONGODB_URI, { dbName, serverSelectionTimeoutMS: 10000 });
  t.after(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });
  await Promise.all([...Object.values(models), Invoice, PaymentTransaction].map((model) => model.init()));
  const oid = () => new mongoose.Types.ObjectId();
  const organizationId = oid(), condominiumId = oid(), ownerId = oid(), adminId = oid();
  const account = await BankAccount.create({ organizationId, condominiumId, bank: "Banco sintético sin plantilla", accountLabel: "Pruebas", currency: "DOP", createdBy: adminId });
  const request = (params = {}, body = {}, overrides = {}) => ({ user: { role: "ADMIN", sub: adminId }, auth: { organizationId, isOwnerAdmin: true, scope: { mode: "ALL" }, permissions: ["finance.read", "finance.create", "finance.update"] }, query: {}, params, body, ...overrides });
  async function invoke(method, req) {
    const res = { statusCode: 200, headersSent: false, status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; this.headersSent = true; return this; } };
    await controller[method](req, res);
    return res;
  }
  let serial = 0;
  async function invoice() {
    const doc = { _id: oid(), organizationId, condominiumId, ownerId, createdBy: adminId, invoice_number: `test-${++serial}`, unitNumber: `U${serial}`, amount: 5000, paidAmount: 0, currency: "DOP", issueDate: new Date(), paymentStatus: "pending", status: "active" };
    await Invoice.collection.insertOne(doc);
    return doc;
  }
  async function evidence(inv, amount, suffix = crypto.randomUUID()) {
    const fields = { amount, date: "2026-10-01", currency: "DOP", reference: suffix, bank: "Banco sintético" };
    const source = { organizationId, condominiumId, bankAccountId: account._id, fileData: Buffer.from("synthetic only"), sha256: suffix, mimeType: "application/pdf", uploadedBy: adminId };
    const statement = await BankStatement.create({ ...source, status: "ready" });
    const imported = await invoke("commitStatement", request({ id: statement._id }, { reviewed: true, rows: [{ ...fields, direction: "credit", description: "Abono sintético", sourceRow: 1 }] }));
    assert.equal(imported.statusCode, 200, JSON.stringify(imported.body));
    const movement = await BankMovement.findOne({ statementId: statement._id });
    const receipt = await TransferReceipt.create({ ...source, sha256: `receipt-${suffix}`, invoiceId: inv._id, ownerId, ocrStatus: "ready", fields });
    return { receipt, movement, statement };
  }
  await t.test("partial then excess applies only debt and records credit once", async () => {
    const inv = await invoice();
    const first = await evidence(inv, "3000.00");
    const result = await invoke("confirm", request({ id: first.receipt._id }, { movementId: first.movement._id }));
    assert.equal(result.statusCode, 200, JSON.stringify(result.body));
    let saved = await Invoice.findById(inv._id);
    assert.equal(saved.paidAmount, 3000); assert.equal(saved.balancePending, 2000); assert.equal(saved.paymentStatus, "pending");
    const second = await evidence(inv, "3000.00");
    const responses = await Promise.all([1, 2].map(() => invoke("confirm", request({ id: second.receipt._id }, { movementId: second.movement._id }))));
    for (const response of responses) assert.equal(response.statusCode, 200, JSON.stringify(response.body));
    saved = await Invoice.findById(inv._id);
    assert.equal(saved.paidAmount, 5000); assert.equal(saved.balancePending, 0); assert.equal(saved.paymentStatus, "completed");
    assert.equal(await OwnerCredit.countDocuments({ receiptId: second.receipt._id }), 1);
    assert.equal((await OwnerCredit.findOne({ receiptId: second.receipt._id })).amount, 1000);
    assert.equal(await PaymentTransaction.countDocuments({ invoiceId: inv._id }), 2);
  });
  await t.test("two receipts racing for one bank movement cannot double spend", async () => {
    const inv = await invoice();
    const first = await evidence(inv, "5000.00");
    const second = await TransferReceipt.create({ ...first.receipt.toObject(), _id: oid(), sha256: crypto.randomUUID(), fileData: Buffer.from("other synthetic") });
    const responses = await Promise.all([first.receipt, second].map((receipt) => invoke("confirm", request({ id: receipt._id }, { movementId: first.movement._id }))));
    assert.deepEqual(responses.map((r) => r.statusCode).sort(), [200, 409]);
    assert.equal(await PaymentTransaction.countDocuments({ invoiceId: inv._id }), 1);
    assert.equal(await OwnerCredit.countDocuments({ movementId: first.movement._id }), 0);
  });
  await t.test("OCR ready is not payment confirmation and foreign owners cannot read evidence", async () => {
    const inv = await invoice(); const { receipt } = await evidence(inv, "1000.00");
    assert.equal((await Invoice.findById(inv._id)).paymentStatus, "pending");
    const denied = await invoke("receipt", request({ id: receipt._id }, {}, { user: { role: "OWNER", sub: oid() } }));
    assert.equal(denied.statusCode, 404);
    const confirmDenied = await invoke("confirm", request({ id: receipt._id }, {}, { user: { role: "OWNER", sub: ownerId } }));
    assert.equal(confirmDenied.statusCode, 403);
    const foreign = request({ id: receipt._id }); foreign.auth.organizationId = oid();
    assert.equal((await invoke("receipt", foreign)).statusCode, 404);
    const visible = await invoke("receipt", request({ id: receipt._id }));
    assert.equal(visible.body.data.fileData, undefined);
  });
  await t.test("unreviewed statements and duplicate overlap cannot create bank evidence", async () => {
    const inv = await invoice(); const existing = await evidence(inv, "123.45", "stable-bank-reference");
    const statement = await BankStatement.create({ organizationId, condominiumId, bankAccountId: account._id, fileData: Buffer.from("new statement"), sha256: crypto.randomUUID(), uploadedBy: adminId, status: "ready" });
    const rows = [{ ...existing.receipt.fields, direction: "credit", description: "Description changed between exports" }];
    assert.equal((await invoke("commitStatement", request({ id: statement._id }, { rows }))).statusCode, 400);
    assert.equal((await invoke("commitStatement", request({ id: statement._id }, { rows, reviewed: true }))).statusCode, 409);
    assert.equal(await BankMovement.countDocuments({ statementId: statement._id }), 0);
  });
  await t.test("durable OCR processing stores fields but discards attempted payment approval", async () => {
    const inv = await invoice();
    const receipt = await TransferReceipt.create({ organizationId, condominiumId, bankAccountId: account._id, invoiceId: inv._id, ownerId, uploadedBy: ownerId, fileData: Buffer.from("synthetic receipt"), sha256: crypto.randomUUID(), mimeType: "image/png" });
    const previousToken = process.env.OCR_SERVICE_TOKEN;
    process.env.OCR_SERVICE_TOKEN = "synthetic-test-service-token-123456789";
    try {
      assert.equal(await worker.processOne(TransferReceipt, "ocrStatus", "/extract", async () => ({ ok: true, json: async () => ({ fields: { amount: "5000.00", date: "2026-10-01", currency: "DOP", reference: "00001234", bank: "Libre" }, status: "succeeded", reconciliationStatus: "confirmed", requiresReview: false }) })), true);
    } finally {
      if (previousToken === undefined) delete process.env.OCR_SERVICE_TOKEN; else process.env.OCR_SERVICE_TOKEN = previousToken;
    }
    const saved = await TransferReceipt.findById(receipt._id);
    assert.equal(saved.ocrStatus, "ready"); assert.equal(saved.reconciliationStatus, "pending");
    assert.equal(saved.fields.reference, "00001234"); assert.equal(saved.ocr.requiresReview, true);
    assert.equal((await Invoice.findById(inv._id)).paidAmount, 0);
    assert.equal(await PaymentTransaction.countDocuments({ invoiceId: inv._id }), 0);
  });
  await t.test("bank uploads claim their invoice workflow and reject a gateway reservation", async () => {
    const inv = await invoice();
    const upload = request({}, { invoiceId: inv._id, bankAccountId: account._id }, { user: { role: "OWNER", sub: ownerId }, file: { originalname: "synthetic.png", buffer: Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), Buffer.from(crypto.randomUUID())]) } });
    const result = await invoke("uploadReceipt", upload);
    assert.equal(result.statusCode, 200, JSON.stringify(result.body));
    assert.equal(result.body.data.fileData, undefined);
    assert.equal((await Invoice.findById(inv._id)).paymentWorkflow, "bank_transfer");
    assert.equal((await Invoice.findById(inv._id)).paymentStatus, "pending");
    const reserved = await invoice();
    await Invoice.updateOne({ _id: reserved._id }, { $set: { paymentWorkflow: "gateway" } });
    upload.body.invoiceId = reserved._id;
    assert.equal((await invoke("uploadReceipt", upload)).statusCode, 409);
    assert.equal(await TransferReceipt.countDocuments({ invoiceId: reserved._id }), 0);
  });
});
