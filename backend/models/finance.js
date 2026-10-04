"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;
const scope = {
  organizationId: { type: Schema.Types.ObjectId, required: true, ref: "Organization" },
  condominiumId: { type: Schema.Types.ObjectId, required: true, ref: "Condominium" },
};
const minor = { type: Number, required: true, validate: Number.isSafeInteger };
const settingsSchema = new Schema({
  ...scope,
  enabled: { type: Boolean, default: false },
  cashbookEnabled: { type: Boolean, default: false },
  reportsEnabled: { type: Boolean, default: false },
  lateFee: {
    enabled: { type: Boolean, default: false },
    mode: { type: String, enum: ["fixed", "percent"], default: "fixed" },
    value: { type: Number, default: 0, min: 0 },
    graceDays: { type: Number, default: 0, min: 0, max: 365 },
    effectiveFrom: String,
  },
  updatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });
settingsSchema.index({ organizationId: 1, condominiumId: 1 }, { unique: true });
const applicationSchema = new Schema({
  ...scope,
  invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
  unitNumber: { type: String, required: true },
  kind: { type: String, enum: ["discount", "waiver", "credit", "reversal"], required: true },
  amountMinor: minor,
  currency: { type: String, required: true },
  reason: { type: String, required: true, maxlength: 500 },
  creditId: { type: Schema.Types.ObjectId, ref: "OwnerCredit" },
  reversesId: { type: Schema.Types.ObjectId, ref: "FinanceApplication" },
  reversedById: { type: Schema.Types.ObjectId, ref: "FinanceApplication" },
  idempotencyKey: { type: String, required: true, maxlength: 128 },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });
applicationSchema.index({ organizationId: 1, condominiumId: 1, idempotencyKey: 1 }, { unique: true });
applicationSchema.index({ invoiceId: 1, createdAt: 1 });
const entrySchema = new Schema({
  ...scope,
  kind: { type: String, enum: ["income", "expense", "transfer"], required: true },
  category: { type: String, required: true, maxlength: 120 },
  date: { type: String, required: true },
  amountMinor: minor,
  currency: { type: String, required: true },
  bankAccountId: { type: Schema.Types.ObjectId, ref: "BankAccount" },
  destinationAccountId: { type: Schema.Types.ObjectId, ref: "BankAccount" },
  movementId: { type: Schema.Types.ObjectId, ref: "BankMovement" },
  destinationMovementId: { type: Schema.Types.ObjectId, ref: "BankMovement" },
  reference: { type: String, maxlength: 120 },
  reason: { type: String, required: true, maxlength: 500 },
  supportReference: { type: String, maxlength: 500 },
  reversalOf: { type: Schema.Types.ObjectId, ref: "FinanceEntry" },
  reversedById: { type: Schema.Types.ObjectId, ref: "FinanceEntry" },
  idempotencyKey: { type: String, required: true, maxlength: 128 },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });
entrySchema.index({ organizationId: 1, condominiumId: 1, idempotencyKey: 1 }, { unique: true });
entrySchema.index({ organizationId: 1, condominiumId: 1, date: 1 });
const budgetSchema = new Schema({
  ...scope, year: { type: Number, required: true, min: 2000, max: 2200 },
  currency: { type: String, required: true },
  lines: [{ _id: false, month: { type: Number, min: 1, max: 12, required: true }, kind: { type: String, enum: ["income", "expense"], required: true }, category: { type: String, required: true, maxlength: 120 }, amountMinor: minor }],
  updatedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });
budgetSchema.index({ organizationId: 1, condominiumId: 1, year: 1, currency: 1 }, { unique: true });
budgetSchema.add({ revision: { type: Number, default: 0 } });
const batchSchema = new Schema({ ...scope, idempotencyKey: { type: String, required: true, maxlength: 128 }, digest: { type: String, required: true }, invoiceIds: [{ type: Schema.Types.ObjectId, ref: "Invoice" }], createdBy: { type: Schema.Types.ObjectId, required: true } }, { timestamps: true });
batchSchema.index({ organizationId: 1, condominiumId: 1, idempotencyKey: 1 }, { unique: true });
module.exports = {
  FinanceSettings: mongoose.model("FinanceSettings", settingsSchema),
  FinanceApplication: mongoose.model("FinanceApplication", applicationSchema),
  FinanceEntry: mongoose.model("FinanceEntry", entrySchema),
  FinanceBudget: mongoose.model("FinanceBudget", budgetSchema),
  FinanceChargeBatch: mongoose.model("FinanceChargeBatch", batchSchema),
};
