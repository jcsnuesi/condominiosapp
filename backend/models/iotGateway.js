"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  displayName: { type: String, required: true, trim: true, maxlength: 120 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  idempotencyKey: { type: String, trim: true, maxlength: 128, default: null, immutable: true },
  hardwareModel: { type: String, maxlength: 120 },
  agentVersion: { type: String, maxlength: 80 },
  adapters: [{ type: String, enum: ["AWS_SHADOW", "ZIGBEE", "ONVIF", "FRIGATE"] }],
  awsThingName: { type: String, required: true, trim: true, maxlength: 128 },
  status: { type: String, enum: ["PROVISIONING", "ACTIVE", "ERROR", "REVOKED"], default: "PROVISIONING" },
  lastHeartbeatAt: { type: Date, default: null },
  heartbeatSequence: { type: Number, min: 0, default: null, validate: (value) => value === null || Number.isSafeInteger(value) },
  health: { type: new mongoose.Schema({
    reportedConfigurationVersion: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    uptimeSeconds: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
    spoolCommandCount: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
    spoolAccountedBytes: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
    spoolCapacityBytes: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    storageBlocked: { type: Boolean, required: true },
  }, { _id: false, strict: "throw" }), default: null },
  ingestionRevision: { type: Number, min: 0, default: 0, validate: Number.isSafeInteger },
  configurationVersion: { type: Number, min: 1, default: 1, validate: Number.isSafeInteger },
}, { timestamps: true, strict: "throw" });
attachContextValidation(schema);
schema.index({ awsThingName: 1 }, { unique: true });
schema.index({ createdBy: 1, idempotencyKey: 1 }, { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } });
module.exports = mongoose.model("IoTGateway", schema);
