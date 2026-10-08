"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  cameraId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  gatewayId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  sourceEventId: { type: String, required: true, maxlength: 128, immutable: true },
  source: { type: String, required: true, enum: ["CAMERA", "FRIGATE"], immutable: true },
  eventType: { type: String, required: true, enum: ["camera.motion", "camera.person", "camera.vehicle"], immutable: true },
  occurredAt: { type: Date, required: true, immutable: true },
  receivedAt: { type: Date, required: true, immutable: true },
  contentHash: { type: String, required: true, match: /^[a-f0-9]{64}$/, immutable: true },
}, { timestamps: { createdAt: true, updatedAt: false }, strict: "throw" });
attachContextValidation(schema);
schema.index({ gatewayId: 1, sourceEventId: 1 }, { unique: true });
schema.index({ cameraId: 1, occurredAt: -1, _id: -1 });
module.exports = mongoose.model("CameraEvent", schema);
