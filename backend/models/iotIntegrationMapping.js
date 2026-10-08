"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  resourceType: { type: String, required: true, enum: ["GATEWAY", "DEVICE"] },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  integration: { type: String, required: true, enum: ["AWS", "THINGSBOARD", "EDGE"], immutable: true },
  externalId: { type: String, trim: true, maxlength: 256, default: null },
  externalParentId: { type: String, trim: true, maxlength: 256, default: null },
  status: { type: String, enum: ["PENDING", "SYNCED", "ERROR", "REVOKED"], default: "PENDING" },
  revision: { type: Number, default: 1, min: 1, validate: Number.isSafeInteger },
  attempts: { type: Number, default: 0, min: 0, validate: Number.isSafeInteger },
  nextRetryAt: { type: Date, default: null },
  lastErrorCode: { type: String, default: "", maxlength: 80, match: /^[A-Z0-9_]*$/ },
}, { timestamps: true, strict: "throw" });
attachContextValidation(schema);
schema.index({ resourceType: 1, resourceId: 1, integration: 1 }, { unique: true });
schema.index({ integration: 1, externalId: 1 }, { unique: true, partialFilterExpression: { externalId: { $type: "string" } } });
schema.index({ status: 1, nextRetryAt: 1 });
module.exports = mongoose.model("IoTIntegrationMapping", schema);
