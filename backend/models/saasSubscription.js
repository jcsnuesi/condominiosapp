"use strict";
const { Schema, model } = require("mongoose");
const schema = new Schema({
  subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true },
  subjectId: { type: Schema.Types.ObjectId, required: true },
  actorId: { type: Schema.Types.ObjectId, required: true },
  planId: { type: Schema.Types.ObjectId, ref: "SaasPlan", required: true },
  terms: { type: Schema.Types.Mixed, required: true },
  providerId: { type: String, default: null },
  environment: { type: String, enum: ["sandbox", "live"], required: true },
  requestKey: { type: String, required: true, unique: true },
  state: { type: String, enum: ["PENDING", "ACTIVE", "GRACE", "CANCELLED", "FREE", "ERROR"], default: "PENDING" },
  open: { type: Boolean, default: true },
  paidThrough: { type: Date, default: null },
  periodStart: { type: Date, default: null },
  graceUntil: { type: Date, default: null },
  cancelRequested: { type: Boolean, default: false },
  approvalUrl: { type: String, default: null },
  lastReconciledAt: Date,
}, { timestamps: true });
schema.index({ subjectType: 1, subjectId: 1 }, { unique: true, partialFilterExpression: { open: true } });
schema.index({ providerId: 1, environment: 1 }, { unique: true, partialFilterExpression: { providerId: { $type: "string" } } });
module.exports = model("SaasSubscription", schema);
