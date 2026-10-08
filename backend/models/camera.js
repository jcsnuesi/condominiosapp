"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  displayName: { type: String, required: true, trim: true, maxlength: 120 },
  gatewayId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  streamId: { type: String, required: true, match: /^[A-Za-z0-9_-]{1,128}$/, immutable: true },
  secretRef: { type: String, required: true, select: false, immutable: true },
  protocol: { type: String, required: true, enum: ["RTSP", "ONVIF"], immutable: true },
  equipment: { type: new mongoose.Schema({
    manufacturer: { type: String, maxlength: 80 }, model: { type: String, maxlength: 120 }, firmware: { type: String, maxlength: 80 },
    sourceKind: { type: String, enum: ["IP_CAMERA", "DVR_NVR"] }, channel: { type: Number, min: 1, max: 256 },
    motionDeclaration: { type: String, enum: ["YES", "NO", "UNKNOWN"] },
  }, { _id: false, strict: "throw" }), default: undefined },
  motionStatus: { type: String, enum: ["UNVERIFIED", "CONFIRMED", "UNAVAILABLE"], default: "UNVERIFIED" },
  sealedConnection: { type: String, select: false },
  setupFingerprint: { type: String, select: false },
  configurationVersion: { type: Number, default: 0, min: 0 },
  recordingMode: { type: String, enum: ["NONE", "EVENT", "BUFFER"], default: "EVENT" },
  status: { type: String, enum: ["PROVISIONING", "ACTIVE", "DISABLED", "REVOKED"], default: "PROVISIONING" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  requestKey: { type: String, required: true, maxlength: 128, immutable: true },
  revision: { type: Number, default: 0, min: 0, validate: Number.isSafeInteger },
}, { timestamps: true, strict: "throw" });
attachContextValidation(schema);
schema.index({ streamId: 1 }, { unique: true });
schema.index({ createdBy: 1, requestKey: 1 }, { unique: true });
module.exports = mongoose.model("Camera", schema);
