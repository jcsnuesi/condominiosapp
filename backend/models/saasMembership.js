"use strict";
const { Schema, model } = require("mongoose");
const quota = { type: Number, min: 0, default: null, validate: { validator: v => v === null || Number.isSafeInteger(v), message: "Quota must be a non-negative integer" } };
const schema = new Schema({
  subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true },
  subjectId: { type: Schema.Types.ObjectId, required: true },
  plan: { type: String, required: true, trim: true, maxlength: 80 },
  planId: { type: Schema.Types.ObjectId, ref: "SaasPlan", default: null },
  kind: { type: String, enum: ["LEGACY", "FREE", "PAID"], default: "LEGACY" },
  priceMinor: { type: Number, default: 0, min: 0 },
  currency: { type: String, enum: ["USD"], default: "USD" },
  interval: { type: String, enum: ["MONTH"], default: "MONTH" },
  modules: { type: [String], default: null },
  graceUntil: { type: Date, default: null },
  status: { type: String, enum: ["ACTIVE", "SUSPENDED", "CANCELLED"], default: "ACTIVE" },
  billingStatus: { type: String, enum: ["MANUAL", "CURRENT", "PAST_DUE"], default: "MANUAL" },
  endsAt: { type: Date, default: null },
  limits: { condominiums: quota, units: quota, unitsPerCondominium: quota, residences: quota },
  revision: { type: Number, default: 0 },
  extraPriceMinor: { type: Number, default: null },
  basePriceMinor: { type: Number, default: 0 },
  additionalQuantity: { type: Number, default: 0, min: 0 },
  includedLimits: { type: Schema.Types.Mixed, default: null },
  allocationMode: { type: String, enum: ["UNIFORM", "DISTRIBUTED"], default: "UNIFORM" },
  distributionEnabled: { type: Boolean, default: false },
  allocations: { type: [{ _id: false, condominiumId: { type: Schema.Types.ObjectId, required: true }, capacity: { ...quota, required: true } }], default: [] },
  scheduledCapacity: { type: Schema.Types.Mixed, default: null },
  reason: { type: String, required: true, maxlength: 500 },
  updatedBy: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });
schema.index({ subjectType: 1, subjectId: 1 }, { unique: true });
module.exports = model("SaasMembership", schema);
