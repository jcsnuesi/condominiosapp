"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StaffSchema = Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    avatar: { type: String, default: "noimage.jpeg" },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    first_password_changed: { type: Boolean },
    emailVerified: { type: Boolean, default: false },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, default: "active" },
    condo_id: { type: mongoose.Schema.Types.ObjectId, ref: "Condominium" },
    role: { type: String, default: "STAFF" },
    permissions: [{ type: String }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

StaffSchema.index(
  { createdBy: 1, status: 1 },
  { name: "staff_created_by_status_lookup" }
);
StaffSchema.index({ organizationId: 1, status: 1 });
StaffSchema.index(
  { condo_id: 1, status: 1 },
  { name: "staff_condo_status_lookup" }
);

StaffSchema.method.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Staff", StaffSchema);
