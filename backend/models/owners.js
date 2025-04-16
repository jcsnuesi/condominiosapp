"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Función para calcular la fecha de finalización del contrato un año adelantado
const oneYearFromNow = () => {
  let date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};

var OwnerSchema = Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    avatar: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String },
    phone: { type: String, required: true, unique: true },
    phone2: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    first_password_changed: { type: Boolean, default: false },
    propertyDetails: [
      {
        addressId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Condominium",
          required: true,
        },
        condominium_unit: { type: String, required: true, max: 5 },
        parkingsQty: { type: Number, required: true, max: 5 },
        isRenting: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        contractStart: { type: Date, required: true, default: Date.now },
        contractEnd: { type: Date, required: true, default: oneYearFromNow() },
      },
    ],
    familyAccount: [{ type: mongoose.Schema.Types.ObjectId, ref: "Family" }],
    role: { type: String, default: "OWNER" },
    status: { type: String, default: "active" },
    emailVerified: { type: Boolean, default: false },
    id_number: {
      type: String,
      required: true,
      max: 11,
      min: 11,
      unique: true,
    },
    id_image_front: { type: String },
    id_image_back: { type: String },
  },
  { timestamps: true }
);

OwnerSchema.method.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Owner", OwnerSchema);
