"use strict";
const mongoose = require("mongoose");
const Staff = require("../models/staff");
const invalid = (message) => Object.assign(new Error(message), { statusCode: 400 });
function parseSupport(value) {
  if (typeof value === "string") {
    try { value = JSON.parse(value); } catch { throw invalid("Configuración de atención inválida"); }
  }
  if (!value || typeof value !== "object" || typeof value.enabled !== "boolean") throw invalid("Configuración de atención inválida");
  const staffId = value.staffId || null;
  if (staffId && !mongoose.Types.ObjectId.isValid(staffId)) throw invalid("Responsable inválido");
  if (value.enabled && !staffId) throw invalid("Selecciona un STAFF responsable de atención");
  return { enabled: value.enabled, staffId };
}
async function validateSupport(value, condominiumId, organizationId) {
  const support = parseSupport(value);
  if (support.staffId && !(await Staff.exists({ _id: support.staffId, condo_id: condominiumId, organizationId, status: "active" }))) throw invalid("El responsable debe ser STAFF activo de este condominio");
  return support;
}
function hasSupportKeys(body) {
  return Object.keys(body).some((key) => key === "residentSupport" || key.startsWith("residentSupport.") || key.startsWith("residentSupport["));
}
module.exports = { parseSupport, validateSupport, hasSupportKeys };
