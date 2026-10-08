"use strict";
const { Schema, model } = require("mongoose");
const quota = { type: Number, min: 0, default: null, validate: { validator: v => v === null || Number.isSafeInteger(v), message: "Quota must be a non-negative integer" } };
const schema = new Schema({
  subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true },
  subjectId: { type: Schema.Types.ObjectId, required: true },
  plan: { type: String, required: true, trim: true, maxlength: 80 },
  status: { type: String, enum: ["ACTIVE", "SUSPENDED", "CANCELLED"], default: "ACTIVE" },
  billingStatus: { type: String, enum: ["MANUAL", "CURRENT", "PAST_DUE"], default: "MANUAL" },
  endsAt: { type: Date, default: null },
  limits: { condominiums: quota, units: quota, unitsPerCondominium: quota, residences: quota },
  revision: { type: Number, default: 0 },
  reason: { type: String, required: true, maxlength: 500 },
  updatedBy: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });
schema.index({ subjectType: 1, subjectId: 1 }, { unique: true });
module.exports = model("SaasMembership", schema);
