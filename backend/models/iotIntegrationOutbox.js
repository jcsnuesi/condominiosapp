"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  type: { type: String, required: true, enum: ["COMMAND_DISPATCH"], immutable: true },
  commandId: { type: String, required: true, maxlength: 128, immutable: true },
  status: { type: String, enum: ["PENDING", "LEASED", "SENT", "DEAD"], default: "PENDING" },
  attempts: { type: Number, default: 0, min: 0, validate: Number.isSafeInteger },
  availableAt: { type: Date, default: Date.now },
  leaseToken: { type: String, maxlength: 64, default: null },
  leaseUntil: { type: Date, default: null },
  lastErrorCode: { type: String, maxlength: 80, match: /^[A-Z0-9_]*$/, default: "" },
  sentAt: { type: Date, default: null },
}, { timestamps: true, strict: "throw" });
attachContextValidation(schema);
schema.index({ commandId: 1 }, { unique: true });
schema.index({ status: 1, availableAt: 1, leaseUntil: 1 });
module.exports = mongoose.model("IoTIntegrationOutbox", schema);
