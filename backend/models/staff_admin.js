"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdminsSchema = Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    avatar: { type: String, default: "default-avatar1.png" },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    government_id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    first_password_changed: { type: Boolean },
    status: { type: String, default: "active" },
    role: { type: String, default: "STAFF_ADMIN" },
    permissions: [
      {
        type: String,
        enum: ["read", "create", "delete", "update"],
        default: ["read"],
        required: true,
      },
    ],
  },
  { timestamp: true }
);

AdminsSchema.method.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Staff_Admin", AdminsSchema);
