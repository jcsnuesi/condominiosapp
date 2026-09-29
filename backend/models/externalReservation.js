"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExternalReservationSchema = Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    rentalChannelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentalChannel",
      required: true,
    },
    condoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    apartmentUnit: { type: String, required: true },
    externalEventId: { type: String, required: true, trim: true },
    bookingName: { type: String, trim: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    sourceStatus: {
      type: String,
      required: true,
      default: "confirmed",
      enum: ["confirmed", "cancelled", "tentative"],
    },
    conflictStatus: {
      type: String,
      required: true,
      default: "none",
      enum: ["none", "potential", "confirmed"],
    },
    linkedReserveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reserve",
    },
    rawPayload: { type: Schema.Types.Mixed },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ExternalReservationSchema.index(
  { rentalChannelId: 1, externalEventId: 1 },
  { unique: true, name: "external_reservation_event_unique" }
);
ExternalReservationSchema.index({ organizationId: 1, condoId: 1, checkIn: 1 });
ExternalReservationSchema.index(
  { condoId: 1, apartmentUnit: 1, checkIn: 1, checkOut: 1 },
  { name: "external_reservation_availability_lookup" }
);
ExternalReservationSchema.index(
  { condoId: 1, conflictStatus: 1, checkIn: 1 },
  { name: "external_reservation_conflict_lookup" }
);

module.exports = mongoose.model(
  "ExternalReservation",
  ExternalReservationSchema
);
