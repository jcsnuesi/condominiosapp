"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorizationAuditSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    actorId: { type: Schema.Types.ObjectId, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true, trim: true },
    targetType: { type: String, required: true, trim: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    before: { type: Schema.Types.Mixed, default: null },
    after: { type: Schema.Types.Mixed, default: null },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuthorizationAuditSchema.index({ organizationId: 1, createdAt: -1 });
AuthorizationAuditSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

for (const method of ["updateOne", "updateMany", "findOneAndUpdate", "deleteOne", "deleteMany", "findOneAndDelete"]) {
  AuthorizationAuditSchema.pre(method, function immutableAudit() {
    throw new Error("Authorization audit records are immutable");
  });
}

module.exports = mongoose.model("AuthorizationAudit", AuthorizationAuditSchema);
