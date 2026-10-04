"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const id = (ref) => ({ type: Schema.Types.ObjectId, ref, required: true });
const scope = { organizationId: id("Organization"), condominiumId: id("Condominium") };
const schema = (fields) => new Schema(fields, { timestamps: true });
const accountSchema = schema({ ...scope, bank: { type: String, required: true, maxlength: 120 }, accountLabel: { type: String, required: true, maxlength: 120 }, currency: { type: String, required: true, match: /^[A-Z]{3}$/ }, createdBy: id("Admin") });
accountSchema.index({ organizationId: 1, condominiumId: 1, bank: 1, accountLabel: 1, currency: 1 }, { unique: true });
accountSchema.add({ openingBalanceMinor: Number, openingDate: String, openingDefinedBy: { type: Schema.Types.ObjectId, ref: "Admin" }, openingDefinedAt: Date });
// Originals live in Mongo, never in the public uploads tree. A hard 8 MiB upload limit
// leaves room below Mongo's 16 MiB document limit for extracted text and metadata.
const source = { ...scope, bankAccountId: id("BankAccount"), originalName: String, mimeType: String, sha256: { type: String, required: true }, fileData: { type: Buffer, required: true, select: false }, uploadedBy: id("Admin"), attempts: { type: Number, default: 0 }, leaseUntil: Date, leaseToken: String, nextAttemptAt: Date, error: String, warnings: [String], ocr: Schema.Types.Mixed };
const receiptSchema = schema({ ...source, invoiceId: id("Invoice"), ownerId: id("Owner"), ocrStatus: { type: String, enum: ["queued", "processing", "ready", "failed"], default: "queued" }, reconciliationStatus: { type: String, enum: ["pending", "confirmed"], default: "pending" }, fields: { type: Schema.Types.Mixed, default: {} }, fieldHistory: [Schema.Types.Mixed], confirmedAt: Date, confirmedBy: Schema.Types.ObjectId, movementId: { type: Schema.Types.ObjectId, ref: "BankMovement" }, allocation: Schema.Types.Mixed });
receiptSchema.index({ organizationId: 1, sha256: 1 }, { unique: true });
receiptSchema.index({ organizationId: 1, invoiceId: 1, createdAt: 1 });
receiptSchema.index({ organizationId: 1, condominiumId: 1, ownerId: 1, createdAt: -1 });
receiptSchema.index({ ocrStatus: 1, nextAttemptAt: 1, leaseUntil: 1 });
receiptSchema.index({ organizationId: 1, reconciliationStatus: 1, createdAt: -1, _id: -1 });
receiptSchema.index({ organizationId: 1, condominiumId: 1, reconciliationStatus: 1, createdAt: -1, _id: -1 });
const statementSchema = schema({ ...source, status: { type: String, enum: ["queued", "processing", "ready", "failed", "committed"], default: "queued" }, rows: [Schema.Types.Mixed], committedAt: Date, committedBy: Schema.Types.ObjectId, reviewedRows: [Schema.Types.Mixed] });
statementSchema.add({ headers: [String], rawRows: [[String]] });
statementSchema.index({ organizationId: 1, bankAccountId: 1, sha256: 1 }, { unique: true });
statementSchema.index({ status: 1, nextAttemptAt: 1, leaseUntil: 1 });
const movementSchema = schema({ ...scope, bankAccountId: id("BankAccount"), statementId: id("BankStatement"), sourceRow: Number, fingerprint: { type: String, required: true }, date: { type: String, required: true }, amountMinor: { type: Number, required: true }, amount: { type: String, required: true }, currency: { type: String, required: true }, reference: String, description: String, direction: { type: String, enum: ["credit", "debit"], required: true }, allocatedReceiptId: { type: Schema.Types.ObjectId, ref: "TransferReceipt", default: null }, allocatedAt: Date });
movementSchema.index({ organizationId: 1, bankAccountId: 1, fingerprint: 1 }, { unique: true });
movementSchema.index({ organizationId: 1, bankAccountId: 1, direction: 1, allocatedReceiptId: 1, date: 1 });
movementSchema.add({ financeEntryId: { type: Schema.Types.ObjectId, ref: "FinanceEntry", default: null } });
const creditSchema = schema({ ...scope, ownerId: id("Owner"), receiptId: id("TransferReceipt"), movementId: id("BankMovement"), currency: String, amountMinor: Number, amount: Number, kind: { type: String, enum: ["overpayment"], default: "overpayment" }, createdBy: id("Admin") });
creditSchema.index({ receiptId: 1 }, { unique: true });
creditSchema.index({ organizationId: 1, condominiumId: 1, ownerId: 1, currency: 1 });
creditSchema.add({ invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" }, unitNumber: String, unitId: Schema.Types.ObjectId, consumedMinor: { type: Number, min: 0, default: 0 } });
module.exports = {
  BankAccount: mongoose.model("BankAccount", accountSchema),
  TransferReceipt: mongoose.model("TransferReceipt", receiptSchema),
  BankStatement: mongoose.model("BankStatement", statementSchema),
  BankMovement: mongoose.model("BankMovement", movementSchema),
  OwnerCredit: mongoose.model("OwnerCredit", creditSchema),
};
