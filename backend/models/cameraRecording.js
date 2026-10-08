"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  cameraId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  occurredAt: { type: Date, required: true, immutable: true },
  objectKey: { type: String, required: true, immutable: true, select: false },
  checksum: { type: String, required: true, match: /^[a-f0-9]{64}$/, immutable: true },
  sizeBytes: { type: Number, required: true, min: 1, validate: Number.isSafeInteger, immutable: true },
  durationSeconds: { type: Number, required: true, min: 0, max: 300, immutable: true },
  kind: { type: String, required: true, enum: ["CLIP", "SNAPSHOT"], immutable: true },
  status: { type: String, enum: ["PENDING", "AVAILABLE", "FAILED", "EXPIRED"], default: "PENDING" },
  expiresAt: { type: Date, required: true, immutable: true },
  availableAt: { type: Date, default: null },
}, { timestamps: true, strict: "throw" });
attachContextValidation(schema);
schema.index({ eventId: 1, kind: 1 }, { unique: true });
schema.index({ cameraId: 1, occurredAt: -1, _id: -1 });
// Retention never silently removes the business index or its audit history.
module.exports = mongoose.model("CameraRecording", schema);
