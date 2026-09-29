"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AmenityReservationSchema = Schema(
  {
    condoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    apartmentUnit: { type: String, required: true },
    amenityName: { type: String, required: true },
    reservedById: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reservedByModel",
    },
    reservedByModel: {
      type: String,
      required: true,
      enum: ["Owner", "Family"],
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      default: "Reserved",
      enum: ["Reserved", "Cancelled", "Completed", "Expired"],
    },
    comments: { type: String },
    visitorNumber: { type: Number, default: 0 },
    legacyReserveId: { type: mongoose.Schema.Types.ObjectId, ref: "Reserve" },
  },
  { timestamps: true }
);

AmenityReservationSchema.index(
  { condoId: 1, amenityName: 1, checkIn: 1, checkOut: 1 },
  { name: "amenity_reservation_availability_lookup" }
);
AmenityReservationSchema.index(
  { reservedById: 1, reservedByModel: 1, status: 1 },
  { name: "amenity_reservation_member_status_lookup" }
);

module.exports = mongoose.model("AmenityReservation", AmenityReservationSchema);
