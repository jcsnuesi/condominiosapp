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
  async function invoke(method, req, target = controller) {
    const res = { statusCode: 200, headersSent: false, status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; this.headersSent = true; return this; } };
    await target[method](req, res);
    return res;
  }
  let serial = 0;
  await t.test("1000 pending receipts remain accessible across pages and confirmed evidence has a separate history", async () => {
    const condo = oid(), inv = oid(), anotherOwner = oid();
    await Invoice.collection.insertOne({ _id: inv, organizationId, condominiumId: condo, ownerId, unitNumber: "A.1" });
    const received = new Date("2026-10-01T15:00:00Z");
    const docs = Array.from({ length: 1000 }, (_, index) => ({
      _id: oid(), organizationId, condominiumId: condo, ownerId, invoiceId: inv,
      bankAccountId: account._id, uploadedBy: adminId, sha256: `pagination-${index}`,
      fileData: Buffer.from("synthetic"), ocr: { text: "large OCR payload" }, fieldHistory: [{ note: "internal history" }],
      reconciliationStatus: "pending", ocrStatus: "ready", createdAt: received,
    }));
    await TransferReceipt.collection.insertMany([...docs,
      { ...docs[0], _id: oid(), sha256: "pagination-confirmed", reconciliationStatus: "confirmed" },
      { ...docs[0], _id: oid(), sha256: "pagination-other-owner", ownerId: anotherOwner },
      { ...docs[0], _id: oid(), sha256: "pagination-other-org", organizationId: oid() },
    ]);
    const ownerRequest = query => request({}, {}, { user: { role: "OWNER", sub: ownerId }, query: { condominiumId: String(condo), reconciliationStatus: "pending", ...query } });
    const first = await invoke("receipts", ownerRequest({}));
    assert.equal(first.statusCode, 200);
    assert.equal(first.body.data.total, 1000);
    assert.equal(first.body.data.docs.length, 20);
    assert.equal(first.body.data.pages, 50);
    assert.equal(first.body.data.docs[0].ocr, undefined);
    assert.equal(first.body.data.docs[0].fieldHistory, undefined);
    assert.equal(first.body.data.docs[0].fileData, undefined);
    const seen = new Set();
    for (let page = 1; page <= 20; page++) {
      const result = await invoke("receipts", ownerRequest({ page: String(page), limit: "50" }));
      assert.equal(result.statusCode, 200);
      assert.equal(result.body.data.total, 1000);
      for (const receipt of result.body.data.docs) seen.add(String(receipt._id));
    }
    assert.equal(seen.size, 1000);
    const history = await invoke("receipts", ownerRequest({ reconciliationStatus: "confirmed" }));
    assert.equal(history.body.data.total, 1);
    const filtered = await invoke("receipts", ownerRequest({ unitNumber: "A.1", from: "2026-10-01", to: "2026-10-01", ocrStatus: "ready", invoiceId: String(inv) }));
    assert.equal(filtered.body.data.total, 1000);
    const noMatch = await invoke("receipts", ownerRequest({ unitNumber: "Ax1" }));
    assert.equal(noMatch.body.data.total, 0);
    await TransferReceipt.updateOne({ _id: docs[0]._id }, { $set: { reconciliationStatus: "confirmed" } });
    const last = await invoke("receipts", ownerRequest({ page: "999", limit: "50" }));
    assert.equal(last.body.data.total, 999);
    assert.equal(last.body.data.page, 20);
    assert.equal(last.body.data.docs.length, 49);
    assert.equal((await invoke("receipts", ownerRequest({ reconciliationStatus: "confirmed" }))).body.data.total, 2);
    for (const query of [{ page: "-1" }, { limit: "1000" }, { ocrStatus: "invalid" }, { reconciliationStatus: "invalid" }, { from: "2026-02-30" }, { from: "2026-10-02", to: "2026-10-01" }]) {
      assert.equal((await invoke("receipts", ownerRequest(query))).statusCode, 400);
    }
  });
  const ownerUpload = (inv, bytes = crypto.randomUUID(), accountId = account._id, uploader = ownerId) => request({},
    { invoiceId: inv._id, bankAccountId: accountId },
    { user: { role: "OWNER", sub: uploader }, file: { originalname: "voucher.png", buffer: Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), Buffer.from(bytes)]) } });
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
  await t.test("reupload reopens the same statement and partial imports can be completed exactly once", async () => {
    const upload = request({}, { bankAccountId: account._id }, { file: { originalname: "statement.csv", buffer: Buffer.from("date,amount,reference\n2026-10-01,250,partial-import") } });
    const first = await invoke("uploadStatement", upload);
    assert.equal(first.statusCode, 200);
    const statementId = first.body.data._id;
    const rows = [1, 2, 3].map(sourceRow => ({ sourceRow, date: "2026-10-01", amount: "250.00", currency: "DOP", reference: `partial-import-${sourceRow}`, direction: "credit" }));
    await BankStatement.updateOne({ _id: statementId }, { $set: { status: "ready", rows } });
    const partial = await invoke("commitStatement", request({ id: statementId }, { reviewed: true, rows: [rows[0]] }));
    assert.equal(partial.statusCode, 200);
    const movement = await BankMovement.findOne({ statementId });
    const allocatedReceiptId = oid();
    await BankMovement.updateOne({ _id: movement._id }, { $set: { allocatedReceiptId } });
    const reopen = await invoke("uploadStatement", upload);
    assert.equal(reopen.statusCode, 200);
    assert.equal(String(reopen.body.data._id), String(statementId));
    assert.equal(reopen.body.data.rows.length, 3);
    assert.equal(reopen.body.data.reviewedRows.length, 1);
    assert.equal(reopen.body.data.fileData, undefined);
    const changed = await invoke("commitStatement", request({ id: statementId }, { reviewed: true, rows: [{ ...rows[0], amount: "251.00" }] }));
    assert.equal(changed.statusCode, 409);
    assert.equal(changed.body.code, "IMPORTED_ROW_LOCKED");
    const responses = await Promise.all([1, 2].map(() => invoke("commitStatement", request({ id: statementId }, { reviewed: true, rows }))));
    for (const response of responses) assert.equal(response.statusCode, 200, JSON.stringify(response.body));
    assert.equal(await BankMovement.countDocuments({ statementId }), 3);
    assert.equal((await BankStatement.findById(statementId)).reviewedRows.length, 3);
    assert.equal(String((await BankMovement.findById(movement._id)).allocatedReceiptId), String(allocatedReceiptId));
    assert.equal(await PaymentTransaction.countDocuments({ "metadata.statementId": statementId }), 0);
    const foreign = request({}, upload.body, { file: upload.file }); foreign.auth.organizationId = oid();
    assert.equal((await invoke("uploadStatement", foreign)).statusCode, 404);
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
  await t.test("existing receipts and simultaneous owner uploads never exceed three", async () => {
    const inv = await invoice();
    await evidence(inv, "1000.00"); // Preexisting receipt has no upload revision.
    const responses = await Promise.all(Array.from({ length: 5 }, () => invoke("uploadReceipt", ownerUpload(inv))));
    assert.deepEqual(responses.map(r => r.statusCode).sort(), [200, 200, 409, 409, 409]);
    for (const response of responses.filter(r => r.statusCode === 409)) assert.equal(response.body.code, "RECEIPT_LIMIT_REACHED");
    assert.equal(await TransferReceipt.countDocuments({ invoiceId: inv._id }), 3);
    const saved = await Invoice.findById(inv._id);
    assert.equal(saved.receiptUploadRevision, 2);
    assert.equal(saved.paymentStatus, "pending");
    assert.equal(saved.paidAmount, 0);
    assert.equal(await PaymentTransaction.countDocuments({ invoiceId: inv._id }), 0);
  });
  await t.test("owners can delete pending vouchers and replace them without changing payment", async () => {
    const inv = await invoice();
    const uploads = await Promise.all(["wrong", "second", "third"].map(bytes => invoke("uploadReceipt", ownerUpload(inv, bytes))));
    for (const response of uploads) assert.equal(response.statusCode, 200);
    const receipt = uploads[0].body.data;
    const ownerRequest = sub => request({ id: receipt._id }, {}, { user: { role: "OWNER", sub } });
    assert.equal((await invoke("deleteReceipt", ownerRequest(oid()))).statusCode, 404);
    const foreign = ownerRequest(ownerId); foreign.auth.organizationId = oid();
    assert.equal((await invoke("deleteReceipt", foreign)).statusCode, 404);
    const outside = ownerRequest(ownerId); outside.auth.scope = { mode: "SELECTED", condominiumIds: [] };
    assert.equal((await invoke("deleteReceipt", outside)).statusCode, 404);
    const unprivileged = request({ id: receipt._id }); unprivileged.auth.isOwnerAdmin = false;
    assert.equal((await invoke("deleteReceipt", unprivileged)).statusCode, 403);
    assert.equal(await TransferReceipt.countDocuments({ invoiceId: inv._id }), 3);
    const deleted = await invoke("deleteReceipt", ownerRequest(ownerId));
    assert.equal(deleted.statusCode, 200);
    assert.equal(deleted.body.data.deletedId, String(receipt._id));
    assert.equal(await TransferReceipt.findById(receipt._id).select("+fileData"), null);
    assert.equal((await invoke("receiptFile", ownerRequest(ownerId))).statusCode, 404);
    assert.equal((await invoke("deleteReceipt", ownerRequest(ownerId))).statusCode, 404);
    assert.equal((await invoke("uploadReceipt", ownerUpload(inv, "wrong"))).statusCode, 200);
    assert.equal(await TransferReceipt.countDocuments({ invoiceId: inv._id }), 3);
    const saved = await Invoice.findById(inv._id);
    assert.equal(saved.paymentStatus, "pending"); assert.equal(saved.paidAmount, 0);
    assert.equal(await PaymentTransaction.countDocuments({ invoiceId: inv._id }), 0);
  });
  await t.test("confirmed vouchers survive deletion and a confirmation racing deletion stays consistent", async () => {
    const inv = await invoice();
    const { receipt, movement } = await evidence(inv, "5000.00");
    const results = await Promise.all([
      invoke("deleteReceipt", request({ id: receipt._id }, {}, { user: { role: "OWNER", sub: ownerId } })),
      invoke("confirm", request({ id: receipt._id }, { movementId: movement._id })),
    ]);
    const saved = await TransferReceipt.findById(receipt._id);
    if (saved) {
      assert.equal(results[0].statusCode, 409);
      assert.equal(results[1].statusCode, 200);
      assert.equal(saved.reconciliationStatus, "confirmed");
      assert.equal((await invoke("deleteReceipt", request({ id: receipt._id }))).statusCode, 409);
      assert.equal(await PaymentTransaction.countDocuments({ invoiceId: inv._id }), 1);
      assert.equal((await Invoice.findById(inv._id)).paidAmount, 5000);
    } else {
      assert.equal(results[0].statusCode, 200);
      assert.equal(results[1].statusCode, 404);
      assert.equal(await PaymentTransaction.countDocuments({ invoiceId: inv._id }), 0);
      assert.equal((await Invoice.findById(inv._id)).paidAmount, 0);
      assert.equal((await BankMovement.findById(movement._id)).allocatedReceiptId, null);
    }
  });
  await t.test("duplicate and invalid evidence, absent bank accounts and foreign invoices fail without consuming slots", async () => {
    const inv = await invoice();
    const req = ownerUpload(inv, "same-evidence");
    assert.equal((await invoke("uploadReceipt", req)).statusCode, 200);
    const duplicate = await invoke("uploadReceipt", req);
    assert.equal(duplicate.statusCode, 409);
    assert.equal(duplicate.body.code, "DUPLICATE_EVIDENCE");
    const invalid = ownerUpload(inv); invalid.file.buffer = Buffer.from("not an image");
    assert.equal((await invoke("uploadReceipt", invalid)).statusCode, 400);
    const tooLarge = ownerUpload(inv); tooLarge.file.buffer = Buffer.alloc(8 * 1024 * 1024 + 1);
    assert.equal((await invoke("uploadReceipt", tooLarge)).statusCode, 400);
    assert.equal((await invoke("uploadReceipt", ownerUpload(inv, "no-bank", oid()))).statusCode, 404);
    assert.equal((await invoke("uploadReceipt", ownerUpload(inv, "other-owner", account._id, oid()))).statusCode, 404);
    assert.equal(await TransferReceipt.countDocuments({ invoiceId: inv._id }), 1);
    assert.equal((await Invoice.findById(inv._id)).receiptUploadRevision, 1);
    const receipt = await TransferReceipt.findOne({ invoiceId: inv._id });
    const fileRequest = request({ id: receipt._id }, {}, { user: { role: "OWNER", sub: ownerId } });
    const res = { headersSent: false, set(headers) { this.headers = headers; }, send(body) { this.body = body; this.headersSent = true; } };
    await controller.receiptFile(fileRequest, res);
    assert.deepEqual(Buffer.from(res.body), req.file.buffer);
    assert.equal(res.headers["Content-Type"], "image/png");
    assert.equal((await invoke("receiptFile", request({ id: receipt._id }, {}, { user: { role: "OWNER", sub: oid() } }))).statusCode, 404);
    const history = require("../controllers/invoice");
    const historyRequest = request({ id: String(ownerId) }, {}, { user: { role: "OWNER", sub: ownerId } });
    const reloaded = await invoke("getInvoiceByIdentifier", historyRequest, history);
    assert.equal(reloaded.statusCode, 200);
    const returnedInvoice = reloaded.body.invoices.find(row => String(row._id) === String(inv._id));
    assert.equal(returnedInvoice.attachments.length, 1);
    assert.equal(String(returnedInvoice.attachments[0]._id), String(receipt._id));
    assert.equal(returnedInvoice.attachments[0].originalName, "voucher.png");
    assert.equal(returnedInvoice.attachments[0].fileData, undefined);
    const otherOwner = oid();
    const invisible = await invoke("getInvoiceByIdentifier", request({ id: String(ownerId) }, {}, { user: { role: "OWNER", sub: otherOwner } }), history);
    assert.equal(invisible.statusCode, 200);
    assert.deepEqual(invisible.body.invoices, []);
  });
});
