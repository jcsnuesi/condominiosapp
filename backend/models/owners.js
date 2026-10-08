"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var HistoricoOwner = require("./historico_owner");

// Función para calcular la fecha de finalización del contrato un año adelantado
const oneYearFromNow = () => {
  let date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
};

var OwnerSchema = Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: false,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
    },
    createdByModel: { type: String, enum: ["Admin", "Staff_Admin"] },
    avatar: { type: String, default: "noimage.jpeg" },
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
        contextType: {
          type: String,
          enum: ["CONDOMINIUM_UNIT", "PERSONAL_RESIDENCE"],
          default: "CONDOMINIUM_UNIT",
        },
        addressId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Condominium",
          required: function () {
            return (
              this.contextType !== "PERSONAL_RESIDENCE" &&
              this.status_property !== "inactive"
            );
          },
        },
        unitId: { type: mongoose.Schema.Types.ObjectId, default: null },
        residenceLabel: { type: String, trim: true, maxlength: 100 },
        formerCondominiumId: { type: mongoose.Schema.Types.ObjectId },
        formerCondominiumAlias: { type: String, trim: true },

        condominium_unit: {
          type: String,
          max: 80,
          required: function () {
            return this.contextType !== "PERSONAL_RESIDENCE";
          },
        },
        parkingsQty: { type: Number, default: 0, min: 0, max: 5 },
        isRenting: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        contractStart: { type: Date, required: true, default: Date.now },
        contractEnd: { type: Date, required: true, default: oneYearFromNow() },
        status_property: { type: String, default: "active" },
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
      unique: true,
      sparse: true,
    },
    id_image_front: { type: String },
    id_image_back: { type: String },
  },
  { timestamps: true }
);

OwnerSchema.index(
  { createdBy: 1, status: 1 },
  { name: "owner_created_by_status_lookup" }
);
OwnerSchema.index({ organizationId: 1, status: 1 });
OwnerSchema.index(
  { "propertyDetails.addressId": 1, status: 1 },
  { name: "owner_property_status_lookup" }
);
OwnerSchema.index(
  { "propertyDetails.addressId": 1, "propertyDetails.unitId": 1, status: 1 },
  { name: "owner_unit_context_lookup" }
);

OwnerSchema.method.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

OwnerSchema.pre("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());

  if (docToUpdate) {
    const plainDoc = docToUpdate.toObject();
    const originalId = plainDoc._id;
    delete plainDoc._id;

    const newDoc = new HistoricoOwner({
      ...plainDoc,
      property_id: originalId,
      httpMethod: "PUT",
    });

    await newDoc.save();
  }
});
OwnerSchema.pre("findOneAndDelete", async function () {
  const docToDelete = await this.model.findOne(this.getQuery());
  if (docToDelete) {
    const id = docToDelete._id;
    delete docToDelete._id;
    docToDelete["id"] = id;
    docToDelete["updatedAt"] = new Date();
    const newDoc = new HistoricoOwner(docToDelete.toObject());
    await newDoc.save();
  }
});

OwnerSchema.plugin(require("../service/saasMembershipService").membershipPlugin, { type: "PERSONAL_OWNER", relevant: ["propertyDetails"] });
module.exports = mongoose.model("Owner", OwnerSchema);
