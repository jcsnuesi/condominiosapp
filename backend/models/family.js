"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FamilySchema = Schema(
  {
    avatar: { type: String, default: "noimage.jpeg" },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    phone: { type: String, required: true },
    first_password_changed: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    role: { type: String, default: "FAMILY" },
    propertyDetails: [
      {
        _id: false,
        addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Condominium" },
        unit: { type: String, required: true },
        family_status: { type: String, default: "authorized", required: true },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    accountAvailabilityDate: { type: Date, default: null },
    accountExpirationDate: { type: Date, default: null },
    delete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Family", FamilySchema);
