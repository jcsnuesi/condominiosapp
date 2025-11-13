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
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    condoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    bookingName: { type: String, required: true },
    phone: { type: String, required: true },
    guest: [GuestSchema],
    comments: { type: String },
    apartmentUnit: { type: String, required: true },
    areaToReserve: { type: String },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    status: { type: String, default: "Reserved", required: true },
    visitorNumber: { type: Number },
    guestCode: { type: Number, max: 4 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reserve", reserveSchema);
