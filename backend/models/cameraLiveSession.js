"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(), cameraId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  gatewayId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  actorRole: { type: String, required: true, enum: ["ADMIN", "STAFF_ADMIN", "STAFF", "OWNER"], immutable: true },
  tokenHash: { type: String, required: true, match: /^[a-f0-9]{64}$/, immutable: true, select: false },
  slot: { type: Number, required: true, min: 0, max: 3, immutable: true, validate: Number.isInteger },
  status: { type: String, enum: ["ACTIVE", "CLOSING", "CLOSED"], default: "ACTIVE" },
  expiresAt: { type: Date, required: true }, mediaSessionId: { type: String, default: null },
}, { timestamps: true, strict: "throw" });
attachContextValidation(schema);
schema.index({ tokenHash: 1 }, { unique: true });
schema.index({ actorId: 1, slot: 1 }, { unique: true, partialFilterExpression: { status: { $in: ["ACTIVE", "CLOSING"] } } });
schema.index({ status: 1, expiresAt: 1 });
module.exports = mongoose.model("CameraLiveSession", schema);
