"use strict";
const mongoose = require("mongoose");
const Membership = require("../models/saasMembership");

function membershipError(code, message, statusCode = 409) {
  return Object.assign(new Error(message), { code, statusCode });
}
function isMembershipCurrent(membership, now = new Date()) {
  const grace = Boolean(membership.graceUntil && new Date(membership.graceUntil) > now);
  return membership.status === "ACTIVE" && (membership.billingStatus !== "PAST_DUE" || grace) && (!membership.endsAt || new Date(membership.endsAt) > now || grace);
}
const normalizeUnit = value => String(value || "").normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
function unitCount(condominium, assignedLabels = []) {
  // Union the current inventory and legacy labels, including assigned units.
  const units = condominium.units || [];
  const inactive = new Set(units.filter(u => u.status === "inactive").map(u => normalizeUnit(u.label || u.normalizedLabel)));
  const labels = [...(condominium.availableUnits || []), ...assignedLabels, ...units.filter(u => u.status !== "inactive").map((u, i) => u.label || u.normalizedLabel || String(u._id || `registered:${i}`))];
  return new Set(labels.map(normalizeUnit).filter(label => label && !inactive.has(label))).size;
}
function assignedUnitLabels(owners) {
  const labels = new Map();
  for (const owner of owners) for (const property of owner.propertyDetails || []) {
    if (!property.addressId || property.status_property === "inactive") continue;
    const key = String(property.addressId);
    const list = labels.get(key) || [];
    list.push(property.condominium_unit);
    labels.set(key, list);
  }
  return labels;
}
function residenceCount(owner) {
  return (owner.propertyDetails || []).filter(p => p.contextType === "PERSONAL_RESIDENCE" && !p.addressId && p.status_property !== "inactive").length;
}
function exceededLimits(limits, usage) {
  return Object.entries(limits || {}).filter(([key, value]) => value !== null && value !== undefined && usage[key] > value).map(([key]) => key);
}
async function usageFor(type, id, session = null) {
  if (type === "PERSONAL_OWNER") {
    const owner = await require("../models/owners").findById(id).select("propertyDetails").session(session).lean();
    return { condominiums: 0, units: 0, unitsPerCondominium: 0, residences: residenceCount(owner || {}) };
  }
  const condos = await require("../models/condominio").find({ organizationId: id, status: { $ne: "inactive" } }).select("units availableUnits").session(session).lean();
  const owners = await require("../models/owners").find({ organizationId: id, status: { $ne: "inactive" } }).select("propertyDetails.addressId propertyDetails.condominium_unit propertyDetails.status_property").session(session).lean();
  const labels = assignedUnitLabels(owners);
  const counts = condos.map(c => unitCount(c, labels.get(String(c._id))));
  return { condominiums: condos.length, units: counts.reduce((a, b) => a + b, 0), unitsPerCondominium: Math.max(0, ...counts), residences: 0 };
}
async function lockMembership(type, id, session) {
  if (!id) return null;
  const filter = { subjectType: type, subjectId: id };
  const member = await Membership.findOne(filter).session(session || null).lean();
  if (!member) return null; // Existing accounts remain unrestricted until provisioned.
  if (!session?.inTransaction()) throw membershipError("SAAS_TRANSACTION_REQUIRED", "Esta operación requiere una transacción para proteger el cupo", 503);
  if (!isMembershipCurrent(member)) throw membershipError("SAAS_MEMBERSHIP_INACTIVE", "La membresía no está vigente", 403);
  await Membership.updateOne({ _id: member._id }, { $inc: { revision: 1 } }, { session });
  return member;
}
async function assertUsage(type, id, member, session) {
  if (!member) return;
  const usage = await usageFor(type, id, session);
  if (exceededLimits(member.limits, usage).length) throw membershipError("SAAS_LIMIT_REACHED", "La operación supera el límite de la membresía");
}
async function withMembershipWrite(type, id, work) {
  if (!await Membership.exists({ subjectType: type, subjectId: id })) return work(null);
  return mongoose.connection.transaction(async session => {
    const member = await lockMembership(type, id, session);
    const before = await usageFor(type, id, session);
    const result = await work(session);
    const after = await usageFor(type, id, session);
    // Reductions remain possible for accounts already exceeding a downgraded plan.
    for (const key of exceededLimits(member.limits, after)) {
      if (after[key] > before[key]) throw membershipError("SAAS_LIMIT_REACHED", "La operación supera el límite de la membresía");
    }
    return result;
  });
}
async function enforceMembershipRequest(req) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && !require("./saasCommercial").enabled("SAAS_MODULES_ENABLED")) return;
  if (/^\/(?:auth\/me(?:\/password)?|update-password|saas\/|platform-announcements)/.test(req.path)) return;
  const type = req.auth.organizationId ? "ORGANIZATION" : "PERSONAL_OWNER";
  const id = req.auth.organizationId || req.user.sub;
  const member = await Membership.findOne({ subjectType: type, subjectId: id }).lean();
  if (member && !isMembershipCurrent(member) && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) throw membershipError("SAAS_MEMBERSHIP_INACTIVE", "Tu membresía no está vigente. Contacta al administrador", 403);
  if (member && require("./saasCommercial").enabled("SAAS_MODULES_ENABLED")) {
    const match = require("./routeModules").find(([pattern]) => pattern.test(req.path));
    const module = /camera-recordings|\/(recordings|playback|events)(?:\/|$)/.test(req.path) && match?.[1] === "cameras" ? "cameras.recordings" : match?.[1];
    if (module && !require("./saasCommercial").moduleAllowed(member.modules, `${module}.read`)) throw membershipError("SAAS_MODULE_UNAVAILABLE", "Este módulo no está incluido en tu plan", 403);
  }
}

// Defense in depth: other writers cannot bypass quota enforcement. Quota-changing
// writes to provisioned accounts must share the membership lock and transaction.
function membershipPlugin(schema, { type, relevant }) {
  schema.pre("insertMany", async function (docs) {
    const checks = new Map();
    for (const doc of docs) {
      const id = type === "ORGANIZATION" ? doc.organizationId : doc._id;
      const member = await lockMembership(type, id, doc.$session?.());
      if (!member) continue;
      const key = String(id);
      const usage = checks.get(key) || await usageFor(type, id, doc.$session());
      if (type === "ORGANIZATION" && doc.status !== "inactive") {
        usage.condominiums++; usage.units += unitCount(doc); usage.unitsPerCondominium = Math.max(usage.unitsPerCondominium, unitCount(doc));
      } else if (type === "PERSONAL_OWNER") usage.residences += residenceCount(doc);
      if (exceededLimits(member.limits, usage).length) throw membershipError("SAAS_LIMIT_REACHED", "La importación supera el límite de la membresía");
      checks.set(key, usage);
    }
  });
  schema.pre("bulkWrite", async function () {
    throw membershipError("SAAS_UNSUPPORTED_BULK_WRITE", "Usa el servicio de membresía para escrituras masivas", 400);
  });
  schema.pre("save", async function () {
    if (!this.isNew && !relevant.some(key => this.isModified(key))) return;
    const id = type === "ORGANIZATION" ? this.organizationId : this._id;
    if (type === "ORGANIZATION" && !this.isNew && this.isModified("organizationId")) throw membershipError("SAAS_UNSUPPORTED_UPDATE", "No puedes trasladar recursos entre cuentas", 400);
    const member = await lockMembership(type, id, this.$session());
    if (!member) return;
    const beforeUsage = await usageFor(type, id, this.$session());
    const previous = this.isNew ? null : await this.constructor.findById(this._id).session(this.$session()).lean();
    const afterUsage = { ...beforeUsage };
    if (type === "ORGANIZATION") {
      const activeBefore = previous && previous.status !== "inactive";
      const activeAfter = this.status !== "inactive";
      afterUsage.condominiums += Number(activeAfter) - Number(Boolean(activeBefore));
      afterUsage.units += (activeAfter ? unitCount(this) : 0) - (activeBefore ? unitCount(previous) : 0);
      if (activeAfter && member.limits.unitsPerCondominium !== null && member.limits.unitsPerCondominium !== undefined && unitCount(this) > member.limits.unitsPerCondominium && unitCount(this) > unitCount(previous || {})) {
        throw membershipError("SAAS_LIMIT_REACHED", "El condominio supera su límite de unidades");
      }
    } else afterUsage.residences += residenceCount(this) - residenceCount(previous || {});
    if (exceededLimits(member.limits, afterUsage).some(key => afterUsage[key] > beforeUsage[key])) throw membershipError("SAAS_LIMIT_REACHED", "La operación supera el límite de la membresía");
  });
  for (const method of ["updateOne", "findOneAndUpdate", "updateMany", "replaceOne", "findOneAndReplace"]) {
    schema.pre(method, async function () {
      const update = this.getUpdate();
      const keys = Array.isArray(update) ? relevant : Object.entries(update || {}).flatMap(([key, value]) => key.startsWith("$") ? Object.keys(value || {}) : [key]);
      const changesCapacity = keys.some(key => relevant.some(field => key === field || key.startsWith(`${field}.`)) && !key.endsWith(".availability"));
      if (!changesCapacity) return;
      if (this.getOptions().upsert) throw membershipError("SAAS_UNSUPPORTED_UPSERT", "Usa creación explícita para recursos con cupos", 400);
      const docs = await this.model.find(this.getFilter()).session(this.getOptions().session || null).lean();
      this._saasChecks = [];
      for (const doc of docs) {
        const id = type === "ORGANIZATION" ? doc.organizationId : doc._id;
        const session = this.getOptions().session;
        const member = await lockMembership(type, id, session);
        if (member) {
          if (Array.isArray(update) || keys.some(key => key === "organizationId" || key === "_id")) throw membershipError("SAAS_UNSUPPORTED_UPDATE", "No puedes trasladar recursos entre cuentas", 400);
          const owners = type === "ORGANIZATION" ? await require("../models/owners").find({ organizationId: id, status: { $ne: "inactive" }, "propertyDetails.addressId": doc._id }).select("propertyDetails.addressId propertyDetails.condominium_unit propertyDetails.status_property").session(session).lean() : [];
          const assignedLabels = assignedUnitLabels(owners).get(String(doc._id)) || [];
          this._saasChecks.push({ id, member, documentId: doc._id, assignedLabels, beforeUnitCount: unitCount(doc, assignedLabels), before: await usageFor(type, id, session) });
        }
      }
    });
    schema.post(method, async function () {
      for (const check of this._saasChecks || []) {
        const after = await usageFor(type, check.id, this.getOptions().session);
        if (type === "ORGANIZATION" && check.member.limits.unitsPerCondominium !== null && check.member.limits.unitsPerCondominium !== undefined) {
          const updated = await this.model.findById(check.documentId).session(this.getOptions().session).lean();
          const count = updated && updated.status !== "inactive" ? unitCount(updated, check.assignedLabels) : 0;
          if (count > check.member.limits.unitsPerCondominium && count > check.beforeUnitCount) throw membershipError("SAAS_LIMIT_REACHED", "El condominio supera su límite de unidades");
        }
        if (exceededLimits(check.member.limits, after).some(key => after[key] > check.before[key])) throw membershipError("SAAS_LIMIT_REACHED", "La operación supera el límite de la membresía");
      }
    });
  }
}
module.exports = { membershipError, isMembershipCurrent, unitCount, assignedUnitLabels, residenceCount, exceededLimits, usageFor, lockMembership, assertUsage, withMembershipWrite, enforceMembershipRequest, membershipPlugin };
