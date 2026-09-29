"use strict";

const mongoose = require("mongoose");
const { isValidPermission } = require("../service/permissionCatalog");
const Schema = mongoose.Schema;

const PermissionList = {
  type: [{ type: String, lowercase: true, trim: true }],
  default: [],
  validate: {
    validator: (permissions) => permissions.every(isValidPermission),
    message: "Grant contains an unknown permission",
  },
};

const AccessGrantSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    subjectModel: { type: String, enum: ["Admin", "Staff_Admin", "Staff"], required: true },
    subjectId: { type: Schema.Types.ObjectId, required: true, refPath: "subjectModel" },
    policyIds: [{ type: Schema.Types.ObjectId, ref: "AccessPolicy" }],
    overrides: {
      allow: PermissionList,
      deny: PermissionList,
    },
    scope: {
      mode: { type: String, enum: ["ALL", "SELECTED"], required: true, default: "SELECTED" },
      condominiumIds: [{ type: Schema.Types.ObjectId, ref: "Condominium" }],
    },
    updatedBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

AccessGrantSchema.index({ subjectModel: 1, subjectId: 1 }, { unique: true });
AccessGrantSchema.index({ organizationId: 1, "scope.condominiumIds": 1 });

module.exports = mongoose.model("AccessGrant", AccessGrantSchema);
