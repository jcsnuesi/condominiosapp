"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const IoTOwnerVerificationSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

IoTOwnerVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "iot_owner_verification_ttl" }
);

module.exports = mongoose.model(
  "IoTOwnerVerification",
  IoTOwnerVerificationSchema
);
