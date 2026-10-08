"use strict";
const mongoose = require("mongoose");
const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true, match: /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/ },
  type: { type: String, required: true, enum: ["boolean", "number", "string"] },
  unit: { type: String, maxlength: 32 },
  min: Number,
  max: Number,
  values: [{ type: String, maxlength: 128 }],
}, { _id: false, strict: "throw" });
const fields = () => ({ type: [fieldSchema], default: [], validate: (items) => items.length <= 32 && new Set(items.map((item) => item.name)).size === items.length });
fieldSchema.pre("validate", function () {
  if (["constructor", "prototype", "__proto__"].includes(this.name) ||
      (this.min != null && !Number.isFinite(this.min)) ||
      (this.max != null && !Number.isFinite(this.max)) ||
      (this.min != null && this.max != null && this.min > this.max) ||
      (this.type !== "number" && (this.min != null || this.max != null)) ||
      (this.type !== "string" && this.values?.length)) this.invalidate("type", "Invalid profile field constraints");
});
const schema = new mongoose.Schema({
  key: { type: String, required: true, match: /^[a-z0-9][a-z0-9_-]{0,79}$/ },
  version: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  manufacturer: { type: String, required: true, maxlength: 120 },
  model: { type: String, required: true, maxlength: 120 },
  protocol: { type: String, required: true, enum: ["AWS_SHADOW", "ZIGBEE", "ONVIF", "FRIGATE"] },
  deviceTypes: { type: [String], default: [], enum: ["LIGHT", "AIR_CONDITIONER", "SMART_LOCK", "WATER_SENSOR", "ENERGY_METER", "WATER_PUMP"] },
  testedFirmware: { type: [String], default: [], validate: (items) => items.length <= 20 && items.every((item) => item.length <= 80) },
  certification: { type: String, enum: ["CERTIFIED", "SUPPORTED", "EXPERIMENTAL", "UNSUPPORTED"], default: "EXPERIMENTAL" },
  commandFeedback: { type: String, enum: ["NONE", "DEVICE_REPORT"], default: "NONE" },
  stateFields: fields(),
  commandFields: fields(),
}, { timestamps: true, strict: "throw" });
schema.index({ key: 1, version: 1 }, { unique: true });
module.exports = mongoose.model("IoTDeviceProfile", schema);
