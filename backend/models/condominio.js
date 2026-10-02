"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongooPaginate = require("mongoose-paginate-v2");

var CondominiumUnitSchema = Schema({
  label: { type: String, required: true, trim: true, maxlength: 80 },
  normalizedLabel: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  availability: {
    type: String,
    enum: ["AVAILABLE", "ASSIGNED"],
    default: "AVAILABLE",
  },
});

var CondominiumSchema = Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    avatar: { type: String, default: "noimage2.jpeg" },
    alias: { type: String, required: true },
    typeOfProperty: { type: String, required: true },
    phone: { type: String, required: true },
    phone2: { type: String },
    street_1: { type: String, required: true },
    street_2: { type: String },
    sector_name: { type: String, required: true },
    availableUnits: [{ type: String }],
    units: { type: [CondominiumUnitSchema], default: [] },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zipcode: { type: String },
    country: { type: String, required: true },
    socialAreas: [{ type: String }],
    mPayment: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    invoiceDueDate: {
      type: Date,
      required: true,
      default: () => new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
    status: { type: String, default: "active" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    units_ownerId: [
      {
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
        status: { type: String, default: "active" },
      },
    ],
  },
  { timestamps: true }
);

CondominiumSchema.index(
  { createdBy: 1, status: 1 },
  { name: "condominium_created_by_status_lookup" }
);
CondominiumSchema.index({ organizationId: 1, status: 1, alias: 1 });
CondominiumSchema.index(
  { alias: 1, createdBy: 1 },
  { name: "condominium_alias_created_by_lookup" }
);

CondominiumSchema.plugin(mongooPaginate);

module.exports = mongoose.model("Condominium", CondominiumSchema);
