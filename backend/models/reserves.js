"use strict";

var mongoose = require("mongoose");
const { verify } = require("../controllers/users");
var Schema = mongoose.Schema;

const GuestSchema = {
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  notificationType: { type: String },
  verificationCode: { type: String },
  verify: { type: Boolean },
  guest_token: { type: String, required: true },
};

var reserveSchema = Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "memberModel",
    },
    memberModel: {
      type: String,
      required: true,
      enum: ["Owner", "Family"],
    },
    condoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    bookingName: { type: String, required: true },
    phone: { type: String },
    guest: [GuestSchema],
    comments: { type: String },
    apartmentUnit: { type: String, required: true },
    areaToReserve: { type: String },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    status: {
      type: String,
      required: true,
      enum: ["Guest", "Reserved", "Cancelled", "Completed"],
    },
    visitorNumber: { type: Number },
    // guestCode: { type: Number, max: 4 },
  },
  { timestamps: true }
);

reserveSchema.index(
  { condoId: 1, areaToReserve: 1, checkIn: 1, checkOut: 1 },
  { name: "reserve_availability_lookup" }
);
reserveSchema.index({ organizationId: 1, condoId: 1, status: 1 });
reserveSchema.index(
  { memberId: 1, memberModel: 1, status: 1 },
  { name: "reserve_member_status_lookup" }
);
reserveSchema.index(
  { condoId: 1, status: 1, checkOut: 1 },
  { name: "reserve_expiration_lookup" }
);
reserveSchema.index(
  { status: 1, createdAt: 1 },
  { name: "reserve_guest_cleanup_lookup" }
);

module.exports = mongoose.model("Reserve", reserveSchema);
