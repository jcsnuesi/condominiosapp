"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ContactPerson = Schema(
  {
    name_contact: { type: String, required: true },
    lastname_contact: { type: String, required: true },
    gender_contact: { type: String, required: true },
    email_contact: { type: String, required: true },
    phone_contact: [],
    role_contact: { type: String, required: true },
  },
  { timestamps: true }
);

var AdminSchema = Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    avatar: { type: String, default: "default-avatar.png" },
    company: { type: String, required: true },
    rnc: { type: String },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff_Admin" }],
    phone: [],
    street_1: { type: String, required: true },
    street_2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String },
    country: { type: String, required: true },
    first_password_changed: { type: Boolean },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact_person: [ContactPerson],
    role: { type: String, default: "ADMIN" },
    status: { type: String, default: "active" },
    verified: { type: Boolean, default: false },
    terms: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AdminSchema.method.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

AdminSchema.index({ organizationId: 1, status: 1 });
AdminSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Admin", AdminSchema);
