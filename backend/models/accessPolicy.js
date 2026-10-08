"use strict";

const mongoose = require("mongoose");
const { isValidPermission, MODULE_ACTIONS } = require("../service/permissionCatalog");
const Schema = mongoose.Schema;

const AccessPolicySchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    key: { type: String, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    permissions: {
      type: [{ type: String, lowercase: true, trim: true }],
      default: [],
      validate: {
        validator: (permissions) => permissions.every(isValidPermission),
        message: "Policy contains an unknown permission",
      },
    },
    isSystem: { type: Boolean, default: false },
    excludedModules: {
      type: [{ type: String, lowercase: true, trim: true, enum: Object.keys(MODULE_ACTIONS) }],
      default: [],
    },
    status: { type: String, enum: ["active", "archived"], default: "active" },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

AccessPolicySchema.index({ organizationId: 1, name: 1 }, { unique: true });
AccessPolicySchema.index({ organizationId: 1, status: 1 });

module.exports = mongoose.model("AccessPolicy", AccessPolicySchema);
