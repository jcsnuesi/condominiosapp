"use strict";
const mongoose = require("mongoose");
const crypto = require("crypto");
const multer = require("multer");
const api = require("../service/apiResponse");
const Invoice = require("../models/invoice");
const Condominium = require("../models/condominio");
const PaymentTransaction = require("../models/paymentTransaction");
const { BankAccount, TransferReceipt, BankStatement, BankMovement, OwnerCredit } = require("../models/bankReconciliation");
const { canAccessCondominium, hasPermission } = require("../service/authorization");
const { problem, bounded, currencyCode, normalizeFields, normalizeStatementRows, compareReceipt, allocatePayment, moneyMinor } = require("../service/bankReconciliationRules");

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 1, fields: 5, parts: 6, fieldSize: 1024 } }).single("file");
function uploadMiddleware(req, res, next) { upload(req, res, (error) => error ? api.failure(res, 400, { message: "Adjunte un archivo de hasta 8 MiB" }, "UPLOAD_INVALID") : next()); }
function id(value) { if (!mongoose.isObjectIdOrHexString(value)) throw problem("Identificador inválido"); return value; }
function isAdmin(req) { return ["ADMIN", "STAFF_ADMIN"].includes(req.user?.role); }
function access(req, admin = false, permission = "finance.read") {
  if (!req.auth?.organizationId || !["ADMIN", "STAFF_ADMIN", "OWNER"].includes(req.user?.role) || (admin && !isAdmin(req))) throw problem("No autorizado", 403, "FORBIDDEN");
  if (isAdmin(req) && !req.auth.isOwnerAdmin && !hasPermission(req.auth, permission)) throw problem("No tiene permiso financiero", 403, "FORBIDDEN");
}
function filter(req) {
  const result = { organizationId: req.auth.organizationId };
  if (req.auth.scope?.mode !== "ALL") result.condominiumId = { $in: req.auth.scope?.condominiumIds || [] };
  if (req.query?.condominiumId) {
    id(req.query.condominiumId);
    if (!canAccessCondominium(req.auth, req.query.condominiumId)) throw problem("Propiedad fuera de alcance", 403, "FORBIDDEN");
    result.condominiumId = req.query.condominiumId;
  }
  return result;
}
async function scoped(Model, req, value, session) {
  let query = Model.findOne({ ...filter(req), _id: id(value) });
  if (session) query = query.session(session);
  const doc = await query;
  if (!doc || (req.user.role === "OWNER" && doc.ownerId && String(doc.ownerId) !== String(req.user.sub))) throw problem("Registro no encontrado", 404, "NOT_FOUND");
  return doc;
}
function publicDoc(doc) {
  const result = doc.toObject ? doc.toObject() : { ...doc };
  delete result.fileData; delete result.leaseToken; delete result.leaseUntil;
  return result;
}
function endpoint(action, admin = false, permission = "finance.read") {
  return async (req, res) => {
    try { access(req, admin, permission); const result = await action(req, res); if (!res.headersSent) return api.success(res, 200, result, "BANK_RECONCILIATION_OK"); }
    catch (error) {
      const duplicate = error.code === 11000;
      const transactionUnavailable = /Transaction numbers are only allowed|replica set|does not support retryable writes/.test(error.message || "");
      return api.failure(res, duplicate ? 409 : transactionUnavailable ? 503 : error.status || 500, { message: duplicate ? "Archivo o movimiento duplicado; revise los registros existentes" : transactionUnavailable ? "La conciliación requiere MongoDB con replica set; no se aplicó el pago" : error.status ? error.message : "No se pudo completar la operación bancaria" }, duplicate ? "DUPLICATE_EVIDENCE" : transactionUnavailable ? "TRANSACTIONS_REQUIRED" : error.code || "BANK_RECONCILIATION_FAILED");
    }
  };
}
function original(req, kind) {
  const file = req.file;
  if (!file?.buffer?.length) throw problem("Adjunte el archivo original");
  const bytes = file.buffer;
  if (bytes.length > 8 * 1024 * 1024) throw problem("El archivo supera 8 MiB");
  const pdf = bytes.subarray(0, 5).toString() === "%PDF-";
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  let mimeType = pdf ? "application/pdf" : png ? "image/png" : jpeg ? "image/jpeg" : "";
  // UTF-16 bank exports may omit the BOM. Check the alternating NUL pattern
  // and decoded text before accepting one as CSV; keep binary files rejected.
  const utf16Bom = (bytes[0] === 255 && bytes[1] === 254) || (bytes[0] === 254 && bytes[1] === 255);
  const sampleLength = Math.min(bytes.length - (bytes.length % 2), 1024);
  let oddNuls = 0;
  for (let i = 1; i < sampleLength; i += 2) if (bytes[i] === 0) oddNuls += 1;
  const utf16LeWithoutBom = sampleLength >= 32 && oddNuls / (sampleLength / 2) >= 0.7 &&
    /^[^\x00-\x08\x0B\x0C\x0E-\x1F]*$/.test(bytes.subarray(0, sampleLength).toString("utf16le")) &&
    /[,;\t]/.test(bytes.subarray(0, sampleLength).toString("utf16le"));
  if (kind === "statement" && !mimeType && /\.csv$/i.test(file.originalname) && (!bytes.includes(0) || utf16Bom || utf16LeWithoutBom)) mimeType = "text/csv";
  if (!mimeType || (kind === "statement" && !["text/csv", "application/pdf"].includes(mimeType))) throw problem(kind === "statement" ? "Use un estado CSV o PDF" : "Use un comprobante PDF, PNG o JPEG");
  return { fileData: bytes, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), mimeType, originalName: String(file.originalname || "documento").replace(/[\x00-\x1F\/\\]/g, "_").slice(0, 150) };
}
async function download(Model, req, res) {
  const doc = await scoped(Model, req, req.params.id);
  const binary = await Model.findOne({ _id: doc._id, organizationId: req.auth.organizationId }).select("+fileData");
  const extension = { "application/pdf": "pdf", "image/png": "png", "image/jpeg": "jpg", "text/csv": "csv" }[doc.mimeType];
  res.set({ "Content-Type": doc.mimeType, "Content-Disposition": `attachment; filename="documento-${doc._id}.${extension}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" });
  res.send(binary.fileData);
}

const controller = {
  uploadMiddleware,
  accounts: endpoint(async (req) => ({ docs: await BankAccount.find(filter(req)).sort({ bank: 1 }).limit(200).lean() })),
  createAccount: endpoint(async (req) => {
    const condominiumId = id(req.body.condominiumId);
    if (!canAccessCondominium(req.auth, condominiumId) || !await Condominium.exists({ _id: condominiumId, organizationId: req.auth.organizationId })) throw problem("Propiedad no autorizada", 403);
    const bank = bounded(req.body.bank), accountLabel = bounded(req.body.accountLabel), currency = currencyCode(req.body.currency);
    if (!bank || !accountLabel) throw problem("Indique banco y etiqueta de cuenta");
    return BankAccount.create({ organizationId: req.auth.organizationId, condominiumId, bank, accountLabel, currency, createdBy: req.user.sub });
  }, true, "finance.create"),
  receipts: endpoint(async (req) => {
    const query = filter(req);
    if (req.user.role === "OWNER") query.ownerId = req.user.sub;
    if (req.query.invoiceId) query.invoiceId = id(req.query.invoiceId);
    return { docs: (await TransferReceipt.find(query).sort({ createdAt: -1 }).limit(200).lean()).map(publicDoc) };
  }),
  receipt: endpoint(async (req) => publicDoc(await scoped(TransferReceipt, req, req.params.id))),
  receiptFile: endpoint((req, res) => download(TransferReceipt, req, res)),
  uploadReceipt: endpoint(async (req) => {
    const invoice = await scoped(Invoice, req, req.body.invoiceId);
    const account = await scoped(BankAccount, req, req.body.bankAccountId);
    if (String(account.condominiumId) !== String(invoice.condominiumId) || account.currency !== (invoice.currency || "DOP")) throw problem("La cuenta debe corresponder al condominio y moneda de la factura");
    if (await TransferReceipt.countDocuments({ organizationId: req.auth.organizationId, uploadedBy: req.user.sub, ocrStatus: { $in: ["queued", "processing"] } }) >= 20) throw problem("Espere a que terminen los comprobantes pendientes", 429);
    const file = original(req, "receipt");
    let receipt;
    await mongoose.connection.transaction(async (session) => {
      const activeGateway = await PaymentTransaction.exists({ invoiceId: invoice._id, provider: { $nin: ["TRANSFERENCIA", "TRANSFER", "BANK_TRANSFER", "BANK TRANSFER"] }, status: { $in: ["pending", "processing", "succeeded"] } }).session(session);
      if (activeGateway) throw problem("La factura tiene un cobro por pasarela. Revíselo antes de usar transferencias", 409, "PAYMENT_WORKFLOW_CONFLICT");
      const claimed = await Invoice.updateOne({ _id: invoice._id, organizationId: req.auth.organizationId, paymentWorkflow: { $ne: "gateway" } }, { $set: { paymentWorkflow: "bank_transfer" } }, { session });
      if (claimed.matchedCount !== 1) throw problem("La factura utiliza una pasarela de pago; no se pueden mezclar ambos procesos", 409, "PAYMENT_WORKFLOW_CONFLICT");
      [receipt] = await TransferReceipt.create([{ ...file, organizationId: req.auth.organizationId, condominiumId: invoice.condominiumId, bankAccountId: account._id, invoiceId: invoice._id, ownerId: invoice.ownerId, uploadedBy: req.user.sub }], { session });
    });
    return publicDoc(receipt);
  }, false, "finance.create"),
  updateFields: endpoint(async (req) => {
    const receipt = await scoped(TransferReceipt, req, req.params.id);
    if (receipt.reconciliationStatus !== "pending" || receipt.ocrStatus !== "ready") throw problem("Solo puede corregir comprobantes extraídos pendientes", 409);
    const fields = normalizeFields(req.body);
    const note = bounded(req.body.note, 500);
    if (note.length < 10) throw problem("Explique la corrección en al menos 10 caracteres");
    const updated = await TransferReceipt.findOneAndUpdate({ _id: receipt._id, organizationId: req.auth.organizationId, reconciliationStatus: "pending", ocrStatus: "ready", updatedAt: receipt.updatedAt }, { $set: { fields }, $push: { fieldHistory: { $each: [{ previous: receipt.fields, fields, note, by: req.user.sub, at: new Date() }], $slice: -100 } } }, { returnDocument: "after" });
    if (!updated) throw problem("El comprobante cambió; vuelva a cargar", 409);
    return publicDoc(updated);
  }, true, "finance.update"),
  retryReceipt: endpoint(async (req) => {
    const receipt = await scoped(TransferReceipt, req, req.params.id);
    if (receipt.reconciliationStatus !== "pending" || receipt.ocrStatus !== "failed") throw problem("El comprobante no admite reintento", 409);
    return TransferReceipt.findOneAndUpdate({ _id: receipt._id, ocrStatus: "failed", reconciliationStatus: "pending" }, { $set: { ocrStatus: "queued", attempts: 0, nextAttemptAt: new Date() }, $unset: { error: 1 } }, { returnDocument: "after" });
  }, false, "finance.update"),
  statements: endpoint(async (req) => ({ docs: await BankStatement.find({ ...filter(req), ...(req.query.bankAccountId ? { bankAccountId: id(req.query.bankAccountId) } : {}) }).select("-ocr -rows -reviewedRows").sort({ createdAt: -1 }).limit(100).lean() }), true),
  statement: endpoint(async (req) => publicDoc(await scoped(BankStatement, req, req.params.id)), true),
  statementFile: endpoint((req, res) => download(BankStatement, req, res), true),
  uploadStatement: endpoint(async (req) => {
    const account = await scoped(BankAccount, req, req.body.bankAccountId);
    if (await BankStatement.countDocuments({ organizationId: req.auth.organizationId, status: { $in: ["queued", "processing"] } }) >= 10) throw problem("Espere a que terminen los estados pendientes", 429);
    return publicDoc(await BankStatement.create({ ...original(req, "statement"), organizationId: req.auth.organizationId, condominiumId: account.condominiumId, bankAccountId: account._id, uploadedBy: req.user.sub }));
  }, true, "finance.create"),
  retryStatement: endpoint(async (req) => {
    const statement = await scoped(BankStatement, req, req.params.id);
    if (statement.status !== "failed") throw problem("El estado no admite reintento", 409);
    return BankStatement.findOneAndUpdate({ _id: statement._id, status: "failed" }, { $set: { status: "queued", attempts: 0, nextAttemptAt: new Date() }, $unset: { error: 1 } }, { returnDocument: "after" });
  }, true, "finance.update"),
  commitStatement: endpoint(async (req) => {
    if (req.body.reviewed !== true) throw problem("Confirme la revisión contra el estado de cuenta original");
    let result;
    await mongoose.connection.transaction(async (session) => {
      const statement = await scoped(BankStatement, req, req.params.id, session);
      if (statement.status === "committed") { result = publicDoc(statement); return; }
      if (statement.status !== "ready") throw problem("El estado aún no está listo para revisión", 409);
      const account = await scoped(BankAccount, req, statement.bankAccountId, session);
      const rows = normalizeStatementRows(req.body.rows, account.currency);
      const duplicate = await BankMovement.exists({ organizationId: req.auth.organizationId, bankAccountId: account._id, fingerprint: { $in: rows.map((row) => row.fingerprint) } }).session(session);
      if (duplicate) throw problem("Hay movimientos ya importados en otro estado. Revise el período superpuesto y quite únicamente las filas verificadas como duplicadas", 409, "OVERLAPPING_STATEMENT");
      await BankMovement.insertMany(rows.map((row) => ({ ...row, organizationId: req.auth.organizationId, condominiumId: account.condominiumId, bankAccountId: account._id, statementId: statement._id })), { session });
      statement.status = "committed"; statement.committedAt = new Date(); statement.committedBy = req.user.sub; statement.reviewedRows = rows;
      await statement.save({ session });
      result = publicDoc(statement);
    });
    return result;
  }, true, "finance.update"),
  movements: endpoint(async (req) => ({ docs: await BankMovement.find({ ...filter(req), ...(req.query.bankAccountId ? { bankAccountId: id(req.query.bankAccountId) } : {}) }).sort({ date: -1 }).limit(500).lean() }), true),
  candidates: endpoint(async (req) => {
    const receipt = await scoped(TransferReceipt, req, req.params.id);
    const fields = normalizeFields(receipt.fields);
    const docs = await BankMovement.find({ ...filter(req), bankAccountId: receipt.bankAccountId, direction: "credit", allocatedReceiptId: null, amountMinor: moneyMinor(fields.amount), currency: fields.currency }).sort({ date: -1 }).limit(200).lean();
    return { docs: docs.map((movement) => ({ movement, ...compareReceipt(fields, movement) })).filter((candidate) => candidate.eligible).sort((a, b) => Number(b.referenceMatches) - Number(a.referenceMatches) || a.dayDifference - b.dayDifference), requiresReview: true };
  }, true),
  confirm: endpoint(async (req) => {
    const movementId = id(req.body.movementId);
    const note = bounded(req.body.note, 500);
    let result;
    await mongoose.connection.transaction(async (session) => {
      const receipt = await scoped(TransferReceipt, req, req.params.id, session);
      if (receipt.reconciliationStatus === "confirmed") {
        if (String(receipt.movementId) !== String(movementId)) throw problem("El comprobante ya tiene otro movimiento", 409);
        result = publicDoc(receipt); return;
      }
      if (receipt.ocrStatus !== "ready") throw problem("Revise la extracción antes de conciliar", 409);
      const movement = await scoped(BankMovement, req, movementId, session);
      if (String(movement.bankAccountId) !== String(receipt.bankAccountId) || String(movement.condominiumId) !== String(receipt.condominiumId)) throw problem("El movimiento pertenece a otra cuenta", 409);
      const statement = await scoped(BankStatement, req, movement.statementId, session);
      if (statement.status !== "committed") throw problem("El estado bancario no está confirmado", 409);
      const comparison = compareReceipt(receipt.fields, movement);
      if (!comparison.eligible) throw problem("El movimiento no coincide o ya está aplicado: " + comparison.reasons.join(", "), 409);
      if (!comparison.referenceMatches && note.length < 10) throw problem("Justifique la verificación bancaria cuando la referencia falte o sea distinta (mínimo 10 caracteres)");
      const invoice = await scoped(Invoice, req, receipt.invoiceId, session);
      if (invoice.paymentWorkflow === "gateway") throw problem("Factura reservada para una pasarela de pago", 409, "PAYMENT_WORKFLOW_CONFLICT");
      const gatewayPayment = await PaymentTransaction.exists({ invoiceId: invoice._id, provider: { $nin: ["TRANSFERENCIA", "TRANSFER", "BANK_TRANSFER", "BANK TRANSFER"] }, status: { $in: ["pending", "processing", "succeeded"] } }).session(session);
      if (gatewayPayment) throw problem("La factura tiene un pago por pasarela que requiere revisión", 409, "PAYMENT_WORKFLOW_CONFLICT");
      if (String(invoice.ownerId) !== String(receipt.ownerId) || String(invoice.condominiumId) !== String(receipt.condominiumId) || (invoice.currency || "DOP") !== movement.currency) throw problem("Factura incompatible con la evidencia bancaria", 409);
      const allocation = allocatePayment(invoice, movement.amountMinor);
      const now = new Date();
      const claimed = await BankMovement.updateOne({ _id: movement._id, allocatedReceiptId: null }, { $set: { allocatedReceiptId: receipt._id, allocatedAt: now } }, { session });
      if (claimed.modifiedCount !== 1) throw problem("El movimiento ya fue aplicado", 409);
      invoice.paidAmount = allocation.paidAmount;
      invoice.paymentWorkflow = "bank_transfer";
      invoice.balancePending = allocation.remainingBalance;
      invoice.paymentStatus = allocation.remainingBalance === 0 ? "completed" : "pending";
      invoice.status = allocation.remainingBalance === 0 ? "completed" : invoice.dueDate && invoice.dueDate < now ? "overdue" : "active";
      invoice.paymentMethod = "TRANSFERENCIA";
      invoice.invoice_paid_date = allocation.remainingBalance === 0 ? now : null;
      await invoice.save({ session });
      if (allocation.creditAmount > 0) await OwnerCredit.create([{ organizationId: req.auth.organizationId, condominiumId: receipt.condominiumId, ownerId: receipt.ownerId, receiptId: receipt._id, movementId: movement._id, currency: movement.currency, amountMinor: Math.round(allocation.creditAmount * 100), amount: allocation.creditAmount, createdBy: req.user.sub }], { session });
      await PaymentTransaction.create([{ organizationId: req.auth.organizationId, condominiumId: receipt.condominiumId, invoiceId: receipt.invoiceId, ownerId: receipt.ownerId, provider: "TRANSFERENCIA", bankName: receipt.fields.bank || "", amount: movement.amountMinor / 100, currency: movement.currency, idempotencyKey: `receipt:${receipt._id}`, providerTransactionId: String(movement._id), providerReference: movement.reference, status: "succeeded", reconciliationStatus: "matched", confirmedAt: now, metadata: { source: "bank_statement", receiptId: receipt._id, movementId: movement._id, statementId: movement.statementId, reviewedBy: req.user.sub, note, comparison, allocation } }], { session });
      receipt.reconciliationStatus = "confirmed"; receipt.confirmedAt = now; receipt.confirmedBy = req.user.sub; receipt.movementId = movement._id; receipt.allocation = { ...allocation, note, comparison };
      await receipt.save({ session });
      result = publicDoc(receipt);
    });
    return result;
  }, true, "finance.update"),
  credits: endpoint(async (req) => {
    const query = filter(req);
    if (req.user.role === "OWNER") query.ownerId = req.user.sub;
    else if (req.query.ownerId) query.ownerId = id(req.query.ownerId);
    const castQuery = OwnerCredit.find(query).cast(OwnerCredit);
    const [docs, totals] = await Promise.all([
      OwnerCredit.find(query).sort({ createdAt: -1 }).limit(200).lean(),
      OwnerCredit.aggregate([
        { $match: castQuery },
        { $group: { _id: { ownerId: "$ownerId", condominiumId: "$condominiumId", currency: "$currency" }, amountMinor: { $sum: "$amountMinor" } } },
        { $project: { _id: 0, ownerId: "$_id.ownerId", condominiumId: "$_id.condominiumId", currency: "$_id.currency", amountMinor: 1, amount: { $divide: ["$amountMinor", 100] } } },
      ]),
    ]);
    return { docs, totals };
  }),
};
controller._helpers = { access, filter, scoped, original, publicDoc };
module.exports = controller;
