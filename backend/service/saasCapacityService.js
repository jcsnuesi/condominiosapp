"use strict";
const mongoose = require("mongoose");
const Membership = require("../models/saasMembership");
const Plan = require("../models/saasPlan");
const quota = require("./saasMembershipService");
const fail = (message, statusCode = 409) => { throw Object.assign(new Error(message), { statusCode, code: "SAAS_CAPACITY_INVALID" }); };
const keyFor = type => type === "ORGANIZATION" ? "units" : "residences";
function capacityTerms(terms, type, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 0) fail("Indica una cantidad adicional entera, positiva o cero", 400);
  if (terms.kind !== "PAID" || !Number.isSafeInteger(terms.extraPriceMinor) || terms.extraPriceMinor <= 0) fail("Este plan no permite contratar capacidad adicional");
  const includedLimits = terms.includedLimits || terms.limits;
  const key = keyFor(type);
  if (!Number.isSafeInteger(includedLimits[key])) fail("El plan ya permite capacidad ilimitada");
  const basePriceMinor = terms.basePriceMinor ?? terms.priceMinor;
  const priceMinor = basePriceMinor + quantity * terms.extraPriceMinor;
  const total = includedLimits[key] + quantity;
  if (!Number.isSafeInteger(priceMinor) || !Number.isSafeInteger(total)) fail("La cantidad supera el máximo permitido", 400);
  return { ...terms, includedLimits: { ...includedLimits }, basePriceMinor, additionalQuantity: quantity, priceMinor, limits: { ...includedLimits, [key]: total } };
}
function prorate(before, after, start, end, at) {
  const duration = new Date(end) - new Date(start);
  const remaining = new Date(end) - new Date(at);
  if (!Number.isFinite(duration) || duration <= 0 || remaining <= 0 || remaining > duration) fail("El período pagado no permite calcular el prorrateo");
  return Math.round(Math.max(0, after.priceMinor - before.priceMinor) * remaining / duration);
}
function distributionTotal(allocations) {
  if (!Array.isArray(allocations)) fail("Indica la distribución completa", 400);
  const ids = new Set();
  let total = 0;
  for (const row of allocations) {
    if (!mongoose.isObjectIdOrHexString(row.condominiumId) || ids.has(String(row.condominiumId)) || !Number.isSafeInteger(row.capacity) || row.capacity < 0) fail("Los cupos deben ser enteros y los condominios no pueden repetirse", 400);
    ids.add(String(row.condominiumId)); total += row.capacity;
  }
  if (!Number.isSafeInteger(total)) fail("Capacidad inválida", 400);
  return total;
}
async function condominiumUsage(id, session = null, includeInactive = false) {
  const condos = await require("../models/condominio").find({ organizationId: id, ...(includeInactive ? {} : { status: { $ne: "inactive" } }) }).select("alias units availableUnits status").session(session).lean();
  const owners = await require("../models/owners").find({ organizationId: id, status: { $ne: "inactive" } }).select("propertyDetails.addressId propertyDetails.condominium_unit propertyDetails.status_property").session(session).lean();
  const labels = quota.assignedUnitLabels(owners);
  return condos.map(c => ({ condominiumId: c._id, name: c.alias, active: c.status !== "inactive", used: c.status !== "inactive" ? quota.unitCount(c, labels.get(String(c._id))) : 0 }));
}
async function validateDistribution(id, allocations, totalCapacity, session) {
  const assigned = distributionTotal(allocations);
  if (totalCapacity !== null && assigned > totalCapacity) fail("La distribución supera la capacidad contratada");
  const rows = await condominiumUsage(id, session, true);
  const known = new Set(rows.map(c => String(c.condominiumId)));
  if (allocations.some(a => !known.has(String(a.condominiumId)))) fail("Un condominio no pertenece a esta organización", 403);
  for (const row of rows) {
    const capacity = allocations.find(a => String(a.condominiumId) === String(row.condominiumId))?.capacity || 0;
    if (row.used > capacity) fail(`El cupo de ${row.name} es inferior a sus ${row.used} unidades activas`);
  }
  return assigned;
}
async function view(context, membership) {
  if (!membership) return null;
  const usage = await quota.usageFor(context.subjectType, context.subjectId);
  const key = keyFor(context.subjectType);
  const condominiums = context.subjectType === "ORGANIZATION" ? await condominiumUsage(context.subjectId, null, true) : [];
  const allocated = (membership.allocations || []).reduce((n, a) => n + a.capacity, 0);
  const plan = membership.planId && await Plan.findById(membership.planId).select("allocationMode").lean();
  return { resource: key, included: (membership.includedLimits || membership.limits)[key], additional: membership.additionalQuantity || 0,
    total: membership.limits[key], used: usage[key], revision: membership.revision, distributionEnabled: Boolean(membership.distributionEnabled),
    canEnableDistribution: context.subjectType === "ORGANIZATION" && membership.kind === "PAID" && plan?.allocationMode === "DISTRIBUTED",
    allocated, unallocated: membership.limits[key] === null ? null : membership.limits[key] - allocated,
    condominiums: condominiums.map(c => ({ ...c, capacity: membership.allocations?.find(a => String(a.condominiumId) === String(c.condominiumId))?.capacity ?? (membership.distributionEnabled ? 0 : Math.max(c.used, membership.limits.unitsPerCondominium || 0)) })) };
}
async function saveDistribution(context, input) {
  if (context.subjectType !== "ORGANIZATION") fail("Solo las organizaciones distribuyen cupos", 400);
  if (!Number.isSafeInteger(input.revision) || input.revision < 0) fail("Actualiza la distribución antes de guardarla", 400);
  return mongoose.connection.transaction(async session => {
    const member = await quota.lockMembership(context.subjectType, context.subjectId, session);
    if (!member || member.revision !== input.revision) fail("La capacidad cambió; actualiza la pantalla");
    const plan = await Plan.findById(member.planId).session(session).lean();
    if (member.kind !== "PAID" || (!member.distributionEnabled && plan?.allocationMode !== "DISTRIBUTED")) fail("El plan no permite redistribución");
    const allocations = Array.isArray(input.allocations) ? input.allocations.map(a => ({ condominiumId: a.condominiumId, capacity: a.capacity })) : input.allocations;
    await validateDistribution(context.subjectId, allocations, member.limits.units, session);
    if (member.scheduledCapacity) await validateDistribution(context.subjectId, allocations, member.scheduledCapacity.limits.units, session);
    await Membership.updateOne({ _id: member._id }, { $set: { allocations, distributionEnabled: true, allocationMode: "DISTRIBUTED", "limits.unitsPerCondominium": null } }, { session, runValidators: true });
    await require("../models/platformAudit").create([{ actorId: context.actorId, targetType: context.subjectType, targetId: context.subjectId, action: "saas.capacity.distribution", before: member.allocations, after: allocations }], { session });
    return Membership.findById(member._id).session(session).lean();
  });
}
module.exports = { fail, keyFor, capacityTerms, prorate, distributionTotal, condominiumUsage, validateDistribution, view, saveDistribution };
