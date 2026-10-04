"use strict";
const mongoose = require("mongoose");
const { canAccessCondominium, hasPermission } = require("./authorization");
const { problem } = require("./bankReconciliationRules");
const { FinanceSettings } = require("../models/finance");
const Condominium = require("../models/condominio");

function id(value) {
  if (!mongoose.isObjectIdOrHexString(value)) throw problem("Identificador inválido");
  return value;
}
function access(req, write = false, permission = "finance.read") {
  if (!req.auth?.organizationId || !["ADMIN", "STAFF_ADMIN", "OWNER"].includes(req.user?.role) || (write && req.user.role === "OWNER")) throw problem("No autorizado", 403, "FORBIDDEN");
  if (req.user.role !== "OWNER" && !req.auth.isOwnerAdmin && !hasPermission(req.auth, permission)) throw problem("No tiene permiso financiero", 403, "FORBIDDEN");
}
function scope(req, condominiumId) {
  const query = { organizationId: req.auth.organizationId };
  if (condominiumId) {
    id(condominiumId);
    if (!canAccessCondominium(req.auth, condominiumId)) throw problem("Condominio fuera de alcance", 403, "FORBIDDEN");
    query.condominiumId = condominiumId;
  } else if (req.auth.scope?.mode !== "ALL") query.condominiumId = { $in: req.auth.scope?.condominiumIds || [] };
  return query;
}
async function condominium(req, value) {
  scope(req, value);
  const doc = await Condominium.findOne({ _id: id(value), organizationId: req.auth.organizationId });
  if (!doc) throw problem("Condominio no encontrado", 404);
  return doc;
}
async function enabled(req, value, stage = "enabled") {
  const query = scope(req, value);
  if (!value) throw problem("Seleccione un condominio");
  const settings = await FinanceSettings.findOne(query).lean();
  if (!settings?.enabled || !settings[stage]) throw problem("Active esta etapa financiera después de revisar los saldos", 409, "FINANCE_DISABLED");
  return settings;
}
async function findScoped(Model, req, value, session) {
  const doc = await Model.findOne({ ...scope(req), _id: id(value) }).session(session || null);
  if (!doc) throw problem("Registro no encontrado", 404);
  return doc;
}
async function migrationReady() {
  const Invoice = require("../models/invoice");
  const indexes = await Invoice.collection.indexes();
  return !indexes.some(index => index.name === "unique_monthly_unit_invoice") && indexes.some(index => index.name === "invoice_source_unique" && index.unique);
}
module.exports = { id, access, scope, condominium, enabled, findScoped, migrationReady };
