"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DocsSchema = Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    condoId: { type: mongoose.Schema.Types.ObjectId, ref: "Condominium" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel",
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["Staff", "Staff_Admin", "Admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Docs", DocsSchema);
