"use strict";
const mongoose = require("mongoose");
const { fail } = require("../domain/rules");
const Owner = require("../../../models/owners");
const Condominium = require("../../../models/condominio");
const { ACCOUNT_MODELS, resolveAccessContext, hasPermission, canAccessCondominium } = require("../../../service/authorization");
function validId(value) { if (!mongoose.isObjectIdOrHexString(value)) fail("Invalid identifier"); return value; }
function scope(auth) {
  if (auth?.role === "OWNER") return { ownerId: auth.account._id, organizationId: null };
  if (!["ADMIN", "STAFF_ADMIN", "STAFF"].includes(auth?.role) || !auth.organizationId) fail("Access denied", 403);
  return { organizationId: auth.organizationId, ownerId: null, ...(auth.scope.mode === "ALL" ? {} : { condominiumId: { $in: auth.scope.condominiumIds } }) };
}
async function contexts(auth) {
  scope(auth);
  if (auth.role === "OWNER") {
    const owner = await Owner.findById(auth.account._id).lean();
    const properties = (owner?.propertyDetails || []).filter(p => String(p.status_property || "active").toLowerCase() !== "inactive");
    const ids = properties.map(p => p.addressId).filter(Boolean);
    const condos = await Condominium.find({ _id: { $in: ids }, organizationId: owner.organizationId, status: "active" }).select("alias units").lean();
    return properties.flatMap(p => {
      if (p.contextType === "PERSONAL_RESIDENCE" && !p.addressId) return [{ residenceId: p._id, label: p.residenceLabel || "Residencia", contextType: "OWNER" }];
      const condo = condos.find(c => String(c._id) === String(p.addressId));
      const unit = condo?.units?.find(u => String(u._id) === String(p.unitId) && u.status !== "inactive");
      if (!condo || !unit) return [];
      return [{ condominiumId: condo._id, unitId: unit._id, label: `${condo.alias} · ${unit.label}`, contextType: "OWNER" }];
    });
  }
  return (await Condominium.find({ organizationId: auth.organizationId, status: "active", ...(auth.scope.mode === "ALL" ? {} : { _id: { $in: auth.scope.condominiumIds } }) }).select("alias units").lean())
    .flatMap(c => [{ condominiumId: c._id, label: c.alias, contextType: "ORGANIZATION" }, ...(c.units || []).filter(u => u.status !== "inactive").map(u => ({ condominiumId: c._id, unitId: u._id, label: `${c.alias} · ${u.label}`, contextType: "ORGANIZATION" }))]);
}
async function location(auth, input) {
  const list = await contexts(auth);
  const found = list.find(c => ["condominiumId", "unitId", "residenceId"].every(key => String(c[key] || "") === String(input[key] || "")));
  if (!found) fail("Location is outside current ownership or scope", 403);
  const owner = auth.role === "OWNER";
  return { organizationId: owner ? null : auth.organizationId, ownerId: owner ? auth.account._id : null, condominiumId: found.condominiumId || null, unitId: found.unitId || null, residenceId: found.residenceId || null };
}
async function authorized(auth, resource, permission = "maintenance.read") {
  if (!hasPermission(auth, permission)) return false;
  try {
    const filter = scope(auth);
    if (String(filter.ownerId || "") !== String(resource.ownerId || "") || String(filter.organizationId || "") !== String(resource.organizationId || "")) return false;
    await location(auth, resource); return true;
  } catch { return false; }
}
async function load(Model, auth, id, session, checkLocation = true) {
  const resource = await Model.findOne({ ...scope(auth), _id: validId(id) }).session(session || null);
  if (!resource) fail("Resource not found", 404);
  if (checkLocation) await location(auth, resource);
  return resource;
}
async function assignee(auth, input, resource) {
  const id = input.assignedUserId || auth.account._id;
  const role = input.assignedRole || auth.role;
  validId(id);
  if (!ACCOUNT_MODELS[role] || (auth.role === "OWNER" && (role !== "OWNER" || String(id) !== String(auth.account._id)))) fail("Invalid responsible user", 403);
  const target = await resolveAccessContext({ sub: String(id), role });
  if (!target || !(await authorized(target, resource, "maintenance.update"))) fail("Responsible user has no access", 403);
  return { assignedUserId: id, assignedRole: role };
}
async function recipients(auth, input) {
  const resource = await location(auth, input);
  if (auth.role === "OWNER") return [{ id: auth.account._id, role: "OWNER", name: `${auth.account.name} ${auth.account.lastname}` }];
  const results = [];
  for (const role of ["ADMIN", "STAFF_ADMIN", "STAFF"]) {
    const accounts = await ACCOUNT_MODELS[role].find({ organizationId: auth.organizationId, status: "active" }).select("name lastname").limit(200).lean();
    for (const account of accounts) {
      const target = await resolveAccessContext({ sub: String(account._id), role });
      if (target && await authorized(target, resource, "maintenance.update")) results.push({ id: account._id, role, name: `${account.name || ""} ${account.lastname || ""}`.trim() || role });
    }
  }
  return results;
}
module.exports = { validId, scope, contexts, location, authorized, load, assignee, recipients };
