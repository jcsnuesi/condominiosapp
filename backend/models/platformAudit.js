"use strict";
const { Schema, model } = require("mongoose");
const schema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: "PlatformUser", required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  before: Schema.Types.Mixed,
  after: Schema.Types.Mixed,
  ip: String,
}, { timestamps: { createdAt: true, updatedAt: false } });
schema.index({ createdAt: -1 });
schema.index({ targetType: 1, targetId: 1, createdAt: -1 });
schema.index({ actorId: 1, createdAt: -1 });
schema.index({ action: 1, createdAt: -1 });
schema.pre("save", function () { if (!this.isNew) throw new Error("Platform audit records are immutable"); });
for (const method of ["updateOne", "updateMany", "findOneAndUpdate", "deleteOne", "deleteMany", "findOneAndDelete", "replaceOne", "findOneAndReplace", "bulkWrite"]) {
  schema.pre(method, function () { throw new Error("Platform audit records are immutable"); });
}
schema.pre("deleteOne", { document: true, query: false }, function () { throw new Error("Platform audit records are immutable"); });
module.exports = model("PlatformAudit", schema);
