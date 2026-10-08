"use strict";
const { Schema, model } = require("mongoose");
const { PLATFORM_PERMISSIONS } = require("../service/platformPermissions");
const schema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100, unique: true },
  description: { type: String, default: "", maxlength: 500 },
  permissions: [{ type: String, enum: PLATFORM_PERMISSIONS }],
  status: { type: String, enum: ["active", "archived"], default: "active" },
  createdBy: { type: Schema.Types.ObjectId, ref: "PlatformUser", required: true },
}, { timestamps: true });
module.exports = model("PlatformPolicy", schema);
