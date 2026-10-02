"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const IoTAuditEventSchema = new Schema(
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
    deviceId: { type: Schema.Types.ObjectId, ref: "IoTDevice", default: null },
    actorId: { type: Schema.Types.ObjectId, required: true },
    actorRole: { type: String, required: true, trim: true, uppercase: true },
    action: { type: String, required: true, trim: true, uppercase: true },
    success: { type: Boolean, required: true },
    errorCode: { type: String, trim: true, maxlength: 80, default: "" },
    value: { type: Schema.Types.Mixed, default: null },
    requestId: { type: String, trim: true, maxlength: 128, default: "" },
    ip: { type: String, trim: true, maxlength: 64, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false }, strict: true }
);

IoTAuditEventSchema.pre("validate", function validateAuditScope() {
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
    this.invalidate("scopeType", "Audit references do not match scopeType");
});

IoTAuditEventSchema.index(
  { organizationId: 1, createdAt: -1 },
  { name: "iot_audit_org_timeline" }
);
IoTAuditEventSchema.index(
  { ownerId: 1, residenceId: 1, createdAt: -1 },
  { name: "iot_audit_owner_timeline" }
);
IoTAuditEventSchema.index(
  { deviceId: 1, createdAt: -1 },
  { name: "iot_audit_device_timeline" }
);

for (const method of [
  "updateOne",
  "updateMany",
  "findOneAndUpdate",
  "findOneAndReplace",
  "replaceOne",
  "deleteOne",
  "deleteMany",
  "findOneAndDelete",
]) {
  IoTAuditEventSchema.pre(method, function immutableAudit() {
    throw new Error("IoT audit events are immutable");
  });
}

IoTAuditEventSchema.pre("bulkWrite", function immutableAuditBulkWrite() {
  throw new Error("IoT audit events are immutable");
});

module.exports = mongoose.model("IoTAuditEvent", IoTAuditEventSchema);
