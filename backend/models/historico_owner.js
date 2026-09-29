"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Función para calcular la fecha de finalización del contrato un año adelantado
const oneYearFromNow = () => {
  let date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};

var HistoryOwner = Schema({
  property_id: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  avatar: { type: String },
  name: { type: String },
  lastname: { type: String },
  gender: { type: String },
  dob: { type: String },
  phone: { type: String, unique: false },
  phone2: { type: String },
  email: { type: String },
  password: { type: String },
  first_password_changed: { type: Boolean, default: false },
  propertyDetails: [
    {
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Condominium",
        required: true,
      },
      condominium_unit: { type: String, max: 5 },
      parkingsQty: { type: Number, max: 5 },
      isRenting: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      contractStart: { type: Date, default: Date.now },
      contractEnd: { type: Date, default: oneYearFromNow() },
    },
  ],
  familyAccount: [{ type: mongoose.Schema.Types.ObjectId, ref: "Family" }],
  role: { type: String, default: "OWNER" },
  status: { type: String, default: "active" },
  emailVerified: { type: Boolean, default: false },
  id_number: {
    type: String,
    max: 11,
    min: 11,
  },
  id_image_front: { type: String },
  id_image_back: { type: String },
  httpMethod: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

HistoryOwner.method.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("HistoryOwner", HistoryOwner);
