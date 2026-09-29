"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RentalChannelSchema = Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    condoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    channelType: {
      type: String,
      required: true,
      enum: ["AIRBNB", "BOOKING", "VRBO", "DIRECT", "OTHER"],
    },
    channelLabel: { type: String, trim: true },
    calendarUrl: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "inactive", "error"],
    },
    syncFrequencyMinutes: {
      type: Number,
      default: 30,
      min: 5,
      max: 1440,
    },
    lastSyncedAt: { type: Date },
    lastSyncStatus: {
      type: String,
      enum: ["ok", "warning", "error"],
      default: "ok",
    },
    lastSyncError: { type: String },
    timezone: { type: String, default: "America/Santo_Domingo" },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

RentalChannelSchema.index(
  { condoId: 1, ownerId: 1, status: 1 },
  { name: "rental_channel_owner_status_lookup" }
);
RentalChannelSchema.index({ organizationId: 1, condoId: 1, status: 1 });
RentalChannelSchema.index(
  { condoId: 1, channelType: 1, status: 1 },
  { name: "rental_channel_type_status_lookup" }
);
RentalChannelSchema.index(
  { calendarUrl: 1, condoId: 1 },
  { unique: true, name: "rental_channel_calendar_unique_per_condo" }
);

module.exports = mongoose.model("RentalChannel", RentalChannelSchema);
