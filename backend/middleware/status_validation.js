"use strict";
const Condominium = require("../models/condominio");
const mongoose = require("mongoose");

exports.propertyStatus = async function (req, res, next) {
  const addressId = req.body.addressId || req.body.condo_id || req.params.id;
  const condoFound = await Condominium.findOne(
    mongoose.Types.ObjectId(addressId)
  );
  console.log("Params", condoFound);
  if (condoFound.status == "inactive") {
    return res.status(500).send({
      status: "error",
      message:
        "Forbidden to any action with inactive properties. Only active status is allowed.",
    });
  }
  return next();
};
