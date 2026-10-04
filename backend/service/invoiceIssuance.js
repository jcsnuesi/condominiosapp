"use strict";
const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const Owner = require("../models/owners");
const { activeOwnerPropertyDetails } = require("./residentPropertyAccess");
const { problem, moneyMinor, dateOnly, bounded, currencyCode } = require("./bankReconciliationRules");
const { unitKey, monthlySourceKey, isVerifiedMonthly } = require("./financeRules");

async function ownerUnit(condominium, ownerId, unitNumber, session) {
  if (!mongoose.isObjectIdOrHexString(ownerId)) throw problem("Propietario inválido");
  const activeAssociation = (condominium.units_ownerId || []).some(entry => String(entry.ownerId || entry) === String(ownerId) && String(entry.status || "active") !== "inactive");
  if (!activeAssociation) throw problem("Propietario inactivo en el condominio", 403);
  const owner = await Owner.findOne({ _id: ownerId, organizationId: condominium.organizationId, status: "active" }).select("propertyDetails").session(session || null).lean();
  const matches = activeOwnerPropertyDetails(owner, condominium._id).filter(property => unitKey(property.condominium_unit) === unitKey(unitNumber));
  if (matches.length !== 1) throw problem("La unidad no pertenece al propietario activo", 409);
  return matches[0];
}

async function issueInvoice({ condominium, ownerId, unitNumber, amount, issueDate, dueDate, chargeType, sourceKey, description, createdBy, currency = "DOP", sourceInvoiceId, session }) {
  if (condominium.status !== "active") throw problem("Condominio inactivo", 409);
  const property = await ownerUnit(condominium, ownerId, unitNumber, session);
  const issued = dateOnly(issueDate), due = dateOnly(dueDate);
  if (due < issued) throw problem("El vencimiento no puede preceder a la emisión");
  const period = issued.slice(0, 7);
  const key = chargeType === "monthly" ? monthlySourceKey(property.condominium_unit, period) : sourceKey;
  if (!key || key.length > 250) throw problem("Referencia de cargo inválida");
  const scope = { organizationId: condominium.organizationId, condominiumId: condominium._id };
  const existing = await Invoice.findOne({ ...scope, sourceKey: key }).session(session || null);
  if (existing) {
    if (chargeType !== "monthly" && (String(existing.ownerId) !== String(ownerId) || unitKey(existing.unitNumber) !== unitKey(unitNumber) || existing.amount !== moneyMinor(amount) / 100 || existing.currency !== currencyCode(currency) || existing.chargeType !== chargeType || existing.description !== bounded(description, 500) || existing.issueDate.toISOString().slice(0, 10) !== issued || existing.dueDate?.toISOString().slice(0, 10) !== due)) throw problem("La clave del cargo corresponde a otros datos", 409, "IDEMPOTENCY_CONFLICT");
    return existing;
  }
  if (chargeType === "monthly") {
    // Legacy fallback is limited to recognizable monthly invoices, never generic charges.
    const start = new Date(issued.slice(0, 7) + "-01T00:00:00Z");
    const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
    const legacy = await Invoice.find({ ...scope, issueDate: { $gte: start, $lt: end }, sourceKey: { $exists: false } }).session(session || null);
    const match = legacy.find(invoice => invoice.unitNumber && unitKey(invoice.unitNumber) === unitKey(property.condominium_unit) && isVerifiedMonthly(invoice));
    if (match) return match;
  }
  const total = moneyMinor(amount) / 100;
  const invoice = new Invoice({ ...scope, ownerId, unitNumber: property.condominium_unit, unitId: property.unitId || undefined, amount: total, issueDate: new Date(issued + "T00:00:00Z"), dueDate: new Date(due + "T00:00:00Z"), chargeType, period: chargeType === "monthly" ? period : undefined, sourceKey: key, sourceInvoiceId, description: bounded(description, 500), paymentDescription: chargeType, createdBy, currency: currencyCode(currency), paidAmount: 0, adjustmentAmount: 0, creditAppliedAmount: 0, balancePending: total, status: "active", paymentStatus: "pending" });
  try { return await invoice.save({ session }); }
  catch (error) {
    if (error.code !== 11000 || session) throw error;
    const duplicate = await Invoice.findOne({ ...scope, sourceKey: key });
    if (!duplicate) throw error;
    return issueInvoice({ condominium, ownerId, unitNumber, amount, issueDate, dueDate, chargeType, sourceKey, description, createdBy, currency, sourceInvoiceId });
  }
}
module.exports = { issueInvoice, ownerUnit };
