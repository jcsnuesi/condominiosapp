"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  commandId: { type: String, required: true, match: /^[A-Za-z0-9_-]{1,128}$/, immutable: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  gatewayId: { type: mongoose.Schema.Types.ObjectId, default: null, immutable: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  actorType: { type: String, required: true, enum: ["HUMAN", "SERVICE"], immutable: true },
  actorRole: { type: String, enum: ["OWNER", "ADMIN", "STAFF_ADMIN", "STAFF"], immutable: true },
  requestKey: { type: String, maxlength: 128, default: null, immutable: true },
  ttlSeconds: { type: Number, min: 5, max: 60, default: 30, immutable: true, validate: Number.isInteger },
  profileVersion: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  payload: { type: mongoose.Schema.Types.Mixed, required: true, immutable: true, validate: (value) => {
    if (!value || Object.getPrototypeOf(value) !== Object.prototype) return false;
    const entries = Object.entries(value);
    return entries.length > 0 && entries.length <= 32 && entries.every(([key, item]) =>
      /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(key) && !["constructor", "prototype", "__proto__"].includes(key) &&
      ((typeof item === "number" && Number.isFinite(item)) || typeof item === "boolean" || (typeof item === "string" && item.length <= 128)));
  } },
  expiresAt: { type: Date, required: true, immutable: true },
  status: { type: String, enum: ["REQUESTED", "DISPATCHED", "ACKNOWLEDGED", "EXECUTED", "FAILED", "EXPIRED"], default: "REQUESTED" },
  dispatchedAt: { type: Date, default: null },
  acknowledgedAt: { type: Date, default: null },
  executedAt: { type: Date, default: null },
  evidenceRef: { type: String, maxlength: 256, default: null },
  failureCode: { type: String, maxlength: 80, match: /^[A-Z0-9_]*$/, default: "" },
  feedbackSequence: { type: Number, min: 0, default: null, validate: (value) => value === null || Number.isSafeInteger(value) },
}, { timestamps: true, strict: "throw" });
attachContextValidation(schema);
schema.pre("validate", function () {
  if (this.status === "EXECUTED" && (!this.executedAt || !this.evidenceRef)) {
    this.invalidate("evidenceRef", "Execution requires physical feedback evidence");
  }
  if (this.isNew && (!this.expiresAt || this.expiresAt <= new Date())) {
    this.invalidate("expiresAt", "New commands must expire in the future");
  }
});
schema.index({ commandId: 1 }, { unique: true });
schema.index({ actorId: 1, requestKey: 1 }, { unique: true, partialFilterExpression: { requestKey: { $type: "string" } } });
schema.index({ status: 1, expiresAt: 1 });
schema.index({ deviceId: 1, createdAt: -1 });
// No TTL index: expiry ends execution eligibility, not audit retention.
module.exports = mongoose.model("IoTCommand", schema);
