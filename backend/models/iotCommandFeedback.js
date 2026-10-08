"use strict";
const mongoose = require("mongoose");
const { contextFields, attachContextValidation } = require("../modules/iot/domain/context");
const schema = new mongoose.Schema({
  ...contextFields(),
  commandId: { type: String, required: true, maxlength: 128, immutable: true },
  gatewayId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, required: true, immutable: true },
  profileVersion: { type: Number, required: true, min: 1, immutable: true },
  bindingAddress: { type: String, required: true, maxlength: 128, immutable: true },
  sourceEventId: { type: String, required: true, match: /^[A-Za-z0-9_-]{1,128}$/, immutable: true },
  observedAt: { type: Date, required: true, immutable: true },
  reported: { type: mongoose.Schema.Types.Mixed, required: true, immutable: true, validate: (value) => {
    if (!value || Object.getPrototypeOf(value) !== Object.prototype) return false;
    const entries = Object.entries(value);
    return entries.length > 0 && entries.length <= 32 && entries.every(([key, item]) =>
      /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(key) && !["constructor", "prototype", "__proto__"].includes(key) &&
      ((typeof item === "number" && Number.isFinite(item)) || typeof item === "boolean" || (typeof item === "string" && item.length <= 128)));
  } },
}, { timestamps: { createdAt: true, updatedAt: false }, strict: "throw" });
attachContextValidation(schema);
schema.index({ commandId: 1 }, { unique: true });
schema.index({ gatewayId: 1, sourceEventId: 1 }, { unique: true });
schema.pre("save", function () { if (!this.isNew) throw new Error("Command feedback evidence is immutable"); });
for (const method of ["updateOne", "updateMany", "findOneAndUpdate", "findOneAndReplace", "replaceOne", "deleteOne", "deleteMany", "findOneAndDelete", "bulkWrite"]) {
  schema.pre(method, function () { throw new Error("Command feedback evidence is immutable"); });
}
module.exports = mongoose.model("IoTCommandFeedback", schema);
