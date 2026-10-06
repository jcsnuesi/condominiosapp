"use strict";
const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  callId: { type: String, required: true, unique: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  condominiumId: { type: mongoose.Schema.Types.ObjectId, required: true },
  residentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  residentRole: { type: String, enum: ["OWNER", "FAMILY"], required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, required: true },
  startedAt: { type: Date, required: true },
  acceptedAt: Date,
  connectedAt: Date,
  endedAt: Date,
  result: { type: String, required: true },
}, { timestamps: true });
schema.index({ organizationId: 1, condominiumId: 1, startedAt: -1 });
module.exports = mongoose.model("SupportCall", schema);
