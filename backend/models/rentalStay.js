"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RentalStaySchema = Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    condoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    apartmentUnit: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    sourceType: {
      type: String,
      required: true,
      enum: ["internal", "external"],
    },
    status: {
      type: String,
      required: true,
      default: "booked",
      enum: ["booked", "cancelled", "checked_in", "checked_out"],
    },
    guestName: { type: String },
    guestsCount: { type: Number, default: 1 },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    externalReservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExternalReservation",
    },
    legacyReserveId: { type: mongoose.Schema.Types.ObjectId, ref: "Reserve" },
  },
  { timestamps: true }
);

RentalStaySchema.index(
  { condoId: 1, apartmentUnit: 1, checkIn: 1, checkOut: 1 },
  { name: "rental_stay_availability_lookup" }
);
RentalStaySchema.index({ organizationId: 1, condoId: 1, status: 1 });
RentalStaySchema.index(
  { ownerId: 1, sourceType: 1, status: 1 },
  { name: "rental_stay_owner_status_lookup" }
);

module.exports = mongoose.model("RentalStay", RentalStaySchema);
