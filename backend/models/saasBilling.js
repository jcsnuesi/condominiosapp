"use strict";
const { Schema, model } = require("mongoose");
const charge = new Schema({
  subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true },
  subjectId: { type: Schema.Types.ObjectId, required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: "SaasSubscription", required: true },
  providerId: { type: String, required: true },
  environment: { type: String, enum: ["sandbox", "live"], required: true },
  kind: { type: String, enum: ["PAYMENT", "REFUND", "REVERSAL"], required: true },
  amountMinor: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ["USD"], required: true },
  occurredAt: { type: Date, required: true },
  component: { type: String, enum: ["RENEWAL", "PRORATION", "ADJUSTMENT"], default: "RENEWAL" },
  breakdown: { type: Schema.Types.Mixed, default: null },
}, { timestamps: true });
charge.index({ providerId: 1, environment: 1, kind: 1 }, { unique: true });
charge.index({ subjectType: 1, subjectId: 1, occurredAt: -1 });
const event = new Schema({ providerId: { type: String, required: true }, environment: { type: String, required: true }, type: String,
  processedAt: Date, receivedAt: { type: Date, default: Date.now } });
event.index({ providerId: 1, environment: 1 }, { unique: true });
module.exports = { Charge: model("SaasCharge", charge), Event: model("SaasPaypalEvent", event) };
