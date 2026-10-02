"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const IoTSubscriptionSchema = new Schema(
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
    plan: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 40,
    },
    deviceLimit: { type: Number, required: true, min: 0 },
    deviceUsage: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
    billingStatus: {
      type: String,
      enum: ["MANUAL", "CURRENT", "PAST_DUE", "CANCELLED"],
      default: "MANUAL",
    },
    startedAt: { type: Date, default: Date.now },
    renewedAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    provisionedBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

IoTSubscriptionSchema.pre("validate", function validateContext() {
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
    this.invalidate(
      "scopeType",
      "Subscription references do not match scopeType"
    );
  if (this.deviceUsage > this.deviceLimit) {
    this.invalidate(
      "deviceUsage",
      "Device usage cannot exceed the subscription limit"
    );
  }
});

IoTSubscriptionSchema.index(
  { condominiumId: 1, unitId: 1 },
  {
    unique: true,
    name: "iot_unit_subscription_unique",
    partialFilterExpression: { scopeType: "CONDOMINIUM_UNIT" },
  }
);
IoTSubscriptionSchema.index(
  { ownerId: 1, residenceId: 1 },
  {
    unique: true,
    name: "iot_residence_subscription_unique",
    partialFilterExpression: { scopeType: "PERSONAL_RESIDENCE" },
  }
);
IoTSubscriptionSchema.index(
  { condominiumId: 1, scopeType: 1 },
  {
    unique: true,
    name: "iot_common_area_subscription_unique",
    partialFilterExpression: { scopeType: "COMMON_AREA" },
  }
);

module.exports = mongoose.model("IoTSubscription", IoTSubscriptionSchema);
