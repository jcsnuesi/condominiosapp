"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  gatewayId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  messageId: { type: String, required: true, match: /^[A-Za-z0-9_-]{1,128}$/, immutable: true },
  schemaVersion: { type: Number, required: true, enum: [1], immutable: true },
  type: { type: String, required: true, enum: ["DEVICE_STATE", "COMMAND_ACK", "GATEWAY_HEARTBEAT"], immutable: true },
  contentHash: { type: String, required: true, match: /^[a-f0-9]{64}$/, immutable: true },
  sequence: { type: Number, required: true, min: 0, validate: Number.isSafeInteger, immutable: true },
  occurredAt: { type: Date, required: true, immutable: true },
  receivedAt: { type: Date, required: true, immutable: true },
  status: { type: String, required: true, enum: ["APPLIED", "IGNORED_OUT_OF_ORDER"], immutable: true },
  eventCount: { type: Number, required: true, min: 0, immutable: true },
}, { timestamps: { createdAt: true, updatedAt: false }, strict: "throw" });
attachContextValidation(schema);
schema.index({ gatewayId: 1, messageId: 1 }, { unique: true, name: "iot_inbox_message_unique" });
schema.index({ resourceId: 1, occurredAt: -1 });
// Receipts contain hashes/results only, not raw telemetry or credentials.
module.exports = mongoose.model("IoTIntegrationInbox", schema);
