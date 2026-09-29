"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DocsSchema = Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
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
    category: {
      type: String,
      required: true,
      enum: ["RULE", "REGULATION", "OTHER", "SPENDING"],
    },
    status: { type: String, default: "Active" },
    file: [
      {
        filename: { type: String, required: true },
        size: { type: Number, required: true },
        mimetype: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

DocsSchema.index(
  { createdBy: 1, condoId: 1, createdAt: -1 },
  { name: "docs_creator_condo_lookup" }
);
DocsSchema.index({ organizationId: 1, condoId: 1, status: 1 });
DocsSchema.index(
  { condoId: 1, status: 1 },
  { name: "docs_condo_status_lookup" }
);

module.exports = mongoose.model("Docs", DocsSchema);
