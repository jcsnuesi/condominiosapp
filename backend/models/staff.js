"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StaffSchema = Schema(
  {
    avatar: { type: String, default: "noimage.jpeg" },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    government_id: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, default: "active" },
    condo_id: { type: mongoose.Schema.Types.ObjectId, ref: "Condominium" },
    role: { type: String, default: "STAFF" },
    permissions: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

StaffSchema.method.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Staff", StaffSchema);
