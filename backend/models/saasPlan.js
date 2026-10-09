"use strict";
const { Schema, model } = require("mongoose");
const limits = require("./saasMembership").schema.path("limits.condominiums").options;
const schema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80, unique: true },
  subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true },
  kind: { type: String, enum: ["LEGACY", "FREE", "PAID"], default: "LEGACY" },
  priceMinor: { type: Number, min: 0, default: 0 },
  currency: { type: String, enum: ["USD"], default: "USD" },
  interval: { type: String, enum: ["MONTH"], default: "MONTH" },
  modules: { type: [String], default: null },
  isDefaultFree: { type: Boolean, default: false },
  paypalPlanId: { type: String, default: null },
  publishing: { type: Boolean, default: false },
  revision: { type: Number, default: 0 },
  extraPriceMinor: { type: Number, min: 1, default: null, validate: v => v === null || Number.isSafeInteger(v) },
  allocationMode: { type: String, enum: ["UNIFORM", "DISTRIBUTED"], default: "UNIFORM" },
  paypalEnvironment: { type: String, enum: ["sandbox", "live"], default: null },
  limits: { condominiums: { ...limits }, units: { ...limits }, unitsPerCondominium: { ...limits }, residences: { ...limits } },
  status: { type: String, enum: ["active", "archived"], default: "active" },
}, { timestamps: true });
schema.index({ subjectType: 1 }, { unique: true, partialFilterExpression: { isDefaultFree: true, status: "active" } });
module.exports = model("SaasPlan", schema);
