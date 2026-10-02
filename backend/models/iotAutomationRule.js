"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const IoTAutomationRuleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    scopeType: {
      type: String,
      required: true,
      enum: ["CONDOMINIUM_UNIT", "PERSONAL_RESIDENCE", "COMMON_AREA"],
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    condominiumId: {
      type: Schema.Types.ObjectId,
      ref: "Condominium",
      default: null,
    },
    unitId: { type: Schema.Types.ObjectId, default: null },
    ownerId: { type: Schema.Types.ObjectId, ref: "Owner", default: null },
    residenceId: { type: Schema.Types.ObjectId, default: null },
    sourceDeviceId: {
      type: Schema.Types.ObjectId,
      ref: "IoTDevice",
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "water.detected",
        "battery.low",
        "temperature.high",
        "lock.open",
        "energy.threshold",
      ],
    },
    condition: {
      capability: { type: String, required: true },
      operator: {
        type: String,
        enum: ["EQ", "NE", "GT", "GTE", "LT", "LTE"],
        required: true,
      },
      value: { type: Schema.Types.Mixed, required: true },
    },
    targetDeviceId: {
      type: Schema.Types.ObjectId,
      ref: "IoTDevice",
      required: true,
    },
    command: { type: Schema.Types.Mixed, required: true },
    enabled: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "PAUSED"],
      default: "DRAFT",
    },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, strict: true }
);

IoTAutomationRuleSchema.index(
  { sourceDeviceId: 1, enabled: 1, status: 1 },
  { name: "iot_rule_source_enabled_lookup" }
);
IoTAutomationRuleSchema.index(
  { ownerId: 1, residenceId: 1, createdAt: -1 },
  { name: "iot_rule_personal_scope_lookup" }
);
IoTAutomationRuleSchema.index(
  { organizationId: 1, condominiumId: 1, unitId: 1, createdAt: -1 },
  { name: "iot_rule_condominium_scope_lookup" }
);

module.exports = mongoose.model("IoTAutomationRule", IoTAutomationRuleSchema);
