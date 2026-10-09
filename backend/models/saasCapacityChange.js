"use strict";
const { Schema, model } = require("mongoose");
const schema = new Schema({
  subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true },
  subjectId: { type: Schema.Types.ObjectId, required: true },
  actorId: { type: Schema.Types.ObjectId, required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: "SaasSubscription", required: true },
  requestKey: { type: String, required: true, unique: true },
  environment: { type: String, enum: ["sandbox", "live"], required: true },
  before: { type: Schema.Types.Mixed, required: true },
  after: { type: Schema.Types.Mixed, required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  effectiveAt: { type: Date, required: true },
  quotedAt: { type: Date, required: true },
  prorationMinor: { type: Number, required: true, min: 0 },
  revision: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  state: { type: String, enum: ["QUOTED", "CREATED", "APPROVAL", "PAYMENT", "SCHEDULED", "APPLIED", "RESTORING", "CANCELLED"], default: "QUOTED" },
  open: { type: Boolean, default: true },
  approvalUrl: { type: String, default: null },
  orderId: { type: String, default: null },
  paymentUrl: { type: String, default: null },
  captureId: { type: String, default: null },
  appliedAt: Date,
  recurringConfirmedAt: Date,
  failureReason: { type: String, maxlength: 500, default: null },
  leaseUntil: { type: Date, default: null },
}, { timestamps: true });
schema.index({ subscriptionId: 1 }, { unique: true, partialFilterExpression: { open: true } });
schema.index({ subscriptionId: 1, effectiveAt: -1 });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { state: "QUOTED" } });
module.exports = model("SaasCapacityChange", schema);
