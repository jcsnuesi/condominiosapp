"use strict";

const { Schema } = require("mongoose");
const CONTEXT_KEYS = ["organizationId", "condominiumId", "unitId", "ownerId", "residenceId"];

function contextFields() {
  return {
    scopeType: { type: String, required: true, immutable: true, enum: ["COMMON_AREA", "CONDOMINIUM_UNIT", "PERSONAL_RESIDENCE"] },
    ...Object.fromEntries(CONTEXT_KEYS.map((key) => [key, { type: Schema.Types.ObjectId, default: null, immutable: true }])),
  };
}

function validContext(context) {
  const expected = {
    COMMON_AREA: ["organizationId", "condominiumId"],
    CONDOMINIUM_UNIT: ["organizationId", "condominiumId", "unitId"],
    PERSONAL_RESIDENCE: ["ownerId", "residenceId"],
  }[context.scopeType];
  return Boolean(expected && CONTEXT_KEYS.every((key) => Boolean(context[key]) === expected.includes(key)));
}

function sameContext(left, right) {
  return validContext(left) && validContext(right) && left.scopeType === right.scopeType &&
    CONTEXT_KEYS.every((key) => String(left[key] || "") === String(right[key] || ""));
}

function attachContextValidation(schema) {
  schema.pre("validate", function () {
    if (!validContext(this)) this.invalidate("scopeType", "Context references do not match scopeType");
  });
  schema.index({ organizationId: 1, condominiumId: 1, unitId: 1, createdAt: -1 });
  schema.index({ ownerId: 1, residenceId: 1, createdAt: -1 });
}

module.exports = { contextFields, validContext, sameContext, attachContextValidation };
