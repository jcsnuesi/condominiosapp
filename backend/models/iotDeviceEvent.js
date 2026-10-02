"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const IoTDeviceEventSchema = new Schema(
  {
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
    deviceId: { type: Schema.Types.ObjectId, ref: "IoTDevice", required: true },
    eventType: {
      type: String,
      required: true,
      enum: [
        "device.offline",
        "device.online",
        "water.detected",
        "battery.low",
        "temperature.high",
        "lock.open",
        "energy.threshold",
      ],
    },
    severity: {
      type: String,
      enum: ["INFO", "WARNING", "CRITICAL"],
      required: true,
    },
    eventKey: { type: String, required: true, unique: true, maxlength: 200 },
    observedValue: { type: Schema.Types.Mixed, default: null },
    status: { type: String, enum: ["NEW", "ACKNOWLEDGED"], default: "NEW" },
    occurredAt: { type: Date, required: true, default: Date.now },
    acknowledgedAt: { type: Date, default: null },
    acknowledgedBy: { type: Schema.Types.ObjectId, default: null },
  },
  { timestamps: true, strict: true }
);

IoTDeviceEventSchema.pre("validate", function validateEventScope() {
  const has = (value) => value !== null && value !== undefined;
  const valid =
    (this.scopeType === "CONDOMINIUM_UNIT" &&
      has(this.organizationId) &&
      has(this.condominiumId) &&
      has(this.unitId) &&
      !has(this.ownerId) &&
      !has(this.residenceId)) ||
    (this.scopeType === "PERSONAL_RESIDENCE" &&
      !has(this.organizationId) &&
      !has(this.condominiumId) &&
      !has(this.unitId) &&
      has(this.ownerId) &&
      has(this.residenceId)) ||
    (this.scopeType === "COMMON_AREA" &&
      has(this.organizationId) &&
      has(this.condominiumId) &&
      !has(this.unitId) &&
      !has(this.ownerId) &&
      !has(this.residenceId));
  if (!valid)
    this.invalidate("scopeType", "Event references do not match scopeType");
});

IoTDeviceEventSchema.index(
  { deviceId: 1, occurredAt: -1 },
  { name: "iot_device_event_timeline" }
);
IoTDeviceEventSchema.index(
  { ownerId: 1, residenceId: 1, status: 1, occurredAt: -1 },
  { name: "iot_owner_alert_inbox" }
);
IoTDeviceEventSchema.index(
  { organizationId: 1, condominiumId: 1, status: 1, occurredAt: -1 },
  { name: "iot_common_alert_inbox" }
);

module.exports = mongoose.model("IoTDeviceEvent", IoTDeviceEventSchema);
