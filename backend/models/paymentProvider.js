"use strict";

const mongoose = require("mongoose");

const PaymentProviderSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  code: { type: String, required: true, trim: true, uppercase: true, maxlength: 80 },
}, { timestamps: true });

PaymentProviderSchema.index({ organizationId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model("PaymentProvider", PaymentProviderSchema);
