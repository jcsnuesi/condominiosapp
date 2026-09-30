"use strict";
const Condominium = require("../models/condominio");
const mongoose = require("mongoose");

exports.propertyStatus = async function (req, res, next) {
  try {
    const body = req.body || {};
    const addressId =
      body.addressId || body.condo_id || req.params.id || body.condoId;

    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).send({
        status: "error",
        message: "Valid condominium id is required",
      });
    }

    const condoFound = await Condominium.findById(addressId)
      .select("status")
      .lean();

    if (!condoFound) {
      return res.status(404).send({
        status: "error",
        message: "Condominium not found",
      });
    }

    if (condoFound.status == "inactive") {
      return res.status(403).send({
        status: "error",
        code: "PROPERTY_INACTIVE",
        message:
          "This property is suspended. Activate it before making changes.",
      });
    }

    return next();
  } catch (error) {
    console.error("Error validating property status:", error);
    return res.status(500).send({
      status: "error",
      message: "Server error validating property status",
    });
  }
};
