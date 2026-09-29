"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    rnc: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: [{ type: String, trim: true }],
    address: {
      street_1: { type: String, trim: true },
      street_2: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipcode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    ownerAdminId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    status: {
      type: String,
      enum: ["provisioning", "active", "suspended"],
      default: "provisioning",
    },
    provisionedBy: { type: Schema.Types.ObjectId, ref: "Superuser", required: true },
    provisionedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

OrganizationSchema.index({ slug: 1 }, { unique: true });
OrganizationSchema.index({ ownerAdminId: 1 }, { unique: true, sparse: true });
OrganizationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Organization", OrganizationSchema);
