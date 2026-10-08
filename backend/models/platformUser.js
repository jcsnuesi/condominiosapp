"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;
const scopeSchema = new Schema({
  mode: { type: String, enum: ["ALL", "SELECTED"], default: "SELECTED" },
  organizationIds: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
  ownerIds: [{ type: Schema.Types.ObjectId, ref: "Owner" }],
}, { _id: false });
const schema = new Schema({
  avatar: { type: String, default: "default-avatar1.png" },
  first_password_changed: { type: Boolean, default: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  lastname: { type: String, trim: true, default: "", maxlength: 100 },
  phone: { type: String, default: "" },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  password: { type: String, required: true, select: false },
  sessionVersion: { type: Number, default: 0 },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String, select: false },
  mfaPendingSecret: { type: String, select: false },
  mfaPendingUntil: Date,
  mfaRecoveryHashes: { type: [String], select: false },
  mfaCounter: { type: Number, default: -1 },
  mfaAttempts: { type: Number, default: 0 },
  mfaLockedUntil: Date,
  role: { type: String, enum: ["PLATFORM_ADMIN", "PLATFORM_SUPERVISOR"], default: "PLATFORM_SUPERVISOR" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  policyIds: [{ type: Schema.Types.ObjectId, ref: "PlatformPolicy" }],
  scope: { type: scopeSchema, default: () => ({ mode: "SELECTED" }) },
  createdBy: { type: Schema.Types.ObjectId, ref: "PlatformUser", default: null },
}, { timestamps: true, toJSON: { transform(_doc, result) { delete result.password; return result; } } });
schema.index({ role: 1 }, { unique: true, partialFilterExpression: { role: "PLATFORM_ADMIN" } });
module.exports = mongoose.model("PlatformUser", schema);
