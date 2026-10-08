"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const IoTDeviceSchema = new Schema(
  {
    displayName: { type: String, required: true, trim: true, maxlength: 120 },
    awsThingName: { type: String, required: true, trim: true, maxlength: 128 },
    gatewayId: { type: Schema.Types.ObjectId, ref: "IoTGateway", default: null },
    protocol: { type: String, enum: ["AWS_SHADOW", "ZIGBEE", "ONVIF", "FRIGATE"], default: "AWS_SHADOW" },
    profileId: { type: Schema.Types.ObjectId, ref: "IoTDeviceProfile", default: null },
    profileVersion: { type: Number, min: 1, default: null, validate: (value) => value === null || Number.isSafeInteger(value) },
    bindingAddress: { type: String, trim: true, maxlength: 128, default: null },
    lastReportedAt: { type: Date, default: null },
    ingestion: {
      sequence: { type: Number, min: 0, default: null, validate: (value) => value === null || Number.isSafeInteger(value) },
      messageId: { type: String, maxlength: 128, default: null },
      occurredAt: { type: Date, default: null },
    },
    deviceType: {
      type: String,
      required: true,
      enum: [
        "LIGHT",
        "AIR_CONDITIONER",
        "SMART_LOCK",
        "WATER_SENSOR",
        "ENERGY_METER",
        "WATER_PUMP",
      ],
    },
    location: { type: String, trim: true, maxlength: 120, default: "" },
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
    createdBy: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["PROVISIONING", "ACTIVE", "ERROR", "DELETING", "DELETED"],
      default: "PROVISIONING",
      index: true,
    },
    reconciliationAttempts: { type: Number, default: 0, min: 0 },
    nextRetryAt: { type: Date, default: null },
    lastErrorCode: { type: String, trim: true, maxlength: 80, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
    capabilities: { type: [String], default: [] },
    enabled: { type: Boolean, default: true },
    quotaReserved: { type: Boolean, default: true },
    connectivity: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "UNKNOWN"],
      default: "UNKNOWN",
    },
    lastSeen: { type: Date, default: null },
    shadow: {
      reported: { type: Schema.Types.Mixed, default: {} },
      desired: { type: Schema.Types.Mixed, default: {} },
      delta: { type: Schema.Types.Mixed, default: {} },
      version: { type: Number, default: 0 },
      updatedAt: { type: Date, default: null },
    },
    idempotencyKey: { type: String, trim: true, maxlength: 128, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

IoTDeviceSchema.pre("validate", function validateContext() {
  const has = (value) => value !== null && value !== undefined;
  const hasOrganization = has(this.organizationId);
  const hasCondominium = has(this.condominiumId);
  const hasUnit = has(this.unitId);
  const hasOwner = has(this.ownerId);
  const hasResidence = has(this.residenceId);

  const valid =
    (this.scopeType === "CONDOMINIUM_UNIT" &&
      hasOrganization &&
      hasCondominium &&
      hasUnit &&
      !hasOwner &&
      !hasResidence) ||
    (this.scopeType === "PERSONAL_RESIDENCE" &&
      !hasOrganization &&
      !hasCondominium &&
      !hasUnit &&
      hasOwner &&
      hasResidence) ||
    (this.scopeType === "COMMON_AREA" &&
      hasOrganization &&
      hasCondominium &&
      !hasUnit &&
      !hasOwner &&
      !hasResidence);

  if (!valid) {
    this.invalidate("scopeType", "Context references do not match scopeType");
  }
});

IoTDeviceSchema.index(
  { connectivity: 1, status: 1, lastReportedAt: 1 },
  { name: "iot_presence_sweep" }
);
IoTDeviceSchema.index(
  { gatewayId: 1, bindingAddress: 1 },
  {
    unique: true,
    name: "iot_gateway_binding_unique",
    partialFilterExpression: { gatewayId: { $type: "objectId" }, bindingAddress: { $type: "string" } },
  }
);
IoTDeviceSchema.index(
  { awsThingName: 1 },
  { unique: true, name: "iot_thing_name_unique" }
);
IoTDeviceSchema.index(
  { status: 1, nextRetryAt: 1, updatedAt: 1 },
  { name: "iot_reconciliation_lookup" }
);
IoTDeviceSchema.index(
  {
    organizationId: 1,
    scopeType: 1,
    condominiumId: 1,
    unitId: 1,
    status: 1,
    createdAt: -1,
  },
  { name: "iot_condominium_scope_lookup" }
);
IoTDeviceSchema.index(
  { ownerId: 1, residenceId: 1, status: 1, createdAt: -1 },
  { name: "iot_personal_scope_lookup" }
);
IoTDeviceSchema.index(
  { createdBy: 1, idempotencyKey: 1 },
  {
    unique: true,
    name: "iot_create_idempotency_unique",
    partialFilterExpression: { idempotencyKey: { $type: "string" } },
  }
);

module.exports = mongoose.model("IoTDevice", IoTDeviceSchema);
