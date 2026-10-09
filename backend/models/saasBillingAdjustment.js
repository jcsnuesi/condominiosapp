"use strict";
const { Schema, model } = require("mongoose");
const schema = new Schema({
  subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true },
  subjectId: { type: Schema.Types.ObjectId, required: true },
  subscriptionId: { type: Schema.Types.ObjectId, required: true },
  chargeId: { type: Schema.Types.ObjectId, required: true, unique: true },
  saleId: { type: String, required: true },
  providerKind: { type: String, enum: ["SALE", "CAPTURE"], default: "SALE" },
  environment: { type: String, required: true },
  differenceMinor: { type: Number, required: true },
  terms: { type: Schema.Types.Mixed, required: true },
  state: { type: String, enum: ["PENDING", "COMPLETED"], default: "PENDING" },
  orderId: String, paymentUrl: String, providerId: String,
  leaseUntil: { type: Date, default: null },
}, { timestamps: true });
schema.index({ subscriptionId: 1, state: 1 });
module.exports = model("SaasBillingAdjustment", schema);
