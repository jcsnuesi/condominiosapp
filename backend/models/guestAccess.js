"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuestAccessSchema = Schema(
  {
    condoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    apartmentUnit: { type: String, required: true },
    hostMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "hostMemberModel",
    },
    hostMemberModel: {
      type: String,
      required: true,
      enum: ["Owner", "Family"],
    },
    guestFullname: { type: String, required: true },
    guestPhone: { type: String, required: true },
    verificationCode: { type: String },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "approved", "used", "expired", "cancelled"],
    },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    linkedReserveId: { type: mongoose.Schema.Types.ObjectId, ref: "Reserve" },
  },
  { timestamps: true }
);

GuestAccessSchema.index(
  { condoId: 1, apartmentUnit: 1, status: 1, validFrom: 1 },
  { name: "guest_access_lookup" }
);
GuestAccessSchema.index(
  { hostMemberId: 1, hostMemberModel: 1, status: 1 },
  { name: "guest_access_host_lookup" }
);

module.exports = mongoose.model("GuestAccess", GuestAccessSchema);
