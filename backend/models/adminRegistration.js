"use strict";

const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  address: {
    street_1: String,
    city: String,
    state: String,
    country: String,
  },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date, default: null },
}, { timestamps: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model("AdminRegistration", schema);
