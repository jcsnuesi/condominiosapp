"use strict";
const { Schema, model } = require("mongoose");
const limits = require("./saasMembership").schema.path("limits.condominiums").options;
const schema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80, unique: true },
  subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true },
  limits: { condominiums: { ...limits }, units: { ...limits }, unitsPerCondominium: { ...limits }, residences: { ...limits } },
  status: { type: String, enum: ["active", "archived"], default: "active" },
}, { timestamps: true });
module.exports = model("SaasPlan", schema);
