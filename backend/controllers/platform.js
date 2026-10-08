"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/platformUser");
const Policy = require("../models/platformPolicy");
const Audit = require("../models/platformAudit");
const Membership = require("../models/saasMembership");
const Plan = require("../models/saasPlan");
const Organization = require("../models/organization");
const Owner = require("../models/owners");
const Condominium = require("../models/condominio");
const { PLATFORM_PERMISSIONS, assertDelegation } = require("../service/platformPermissions");
const { requireTarget } = require("../service/platformAuthorization");
const { isMembershipCurrent, exceededLimits, unitCount, assignedUnitLabels, residenceCount, usageFor } = require("../service/saasMembershipService");

const fail = (message, statusCode = 400) => { throw Object.assign(new Error(message), { statusCode }); };
const validId = id => { if (!mongoose.isObjectIdOrHexString(id)) fail("Identificador inválido"); return id; };
const safeUser = user => { const { password, ...result } = user.toObject ? user.toObject() : user; return result; };
const handle = fn => async (req, res) => {
  try { await fn(req, res); }
  catch (error) { res.status(error.statusCode || (error.code === 11000 ? 409 : 500)).send({ status: "error", code: error.code || "PLATFORM_ERROR", message: error.statusCode ? error.message : error.code === 11000 ? "Ya existe un registro con estos datos" : "No se pudo completar la operación" }); }
};
const ok = (res, data, status = 200) => res.status(status).send({ status: "success", data });
function limitsInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("Indica los límites del plan");
  const result = {};
  for (const key of ["condominiums", "units", "unitsPerCondominium", "residences"]) {
    const value = input[key] ?? null;
    if (value !== null && (!Number.isSafeInteger(value) || value < 0)) fail("Los límites deben ser enteros positivos o cero");
    result[key] = value;
  }
  return result;
}
async function target(req) {
  const type = req.params.subjectType;
  const id = validId(req.params.subjectId);
  requireTarget(req, type, id);
  const query = type === "ORGANIZATION" ? Organization.findById(id) : Owner.findOne({ _id: id, organizationId: null, "propertyDetails.contextType": "PERSONAL_RESIDENCE" });
  const account = await query.select(type === "ORGANIZATION" ? "name status" : "name lastname status").lean();
  if (!account) fail("Cuenta no encontrada", 404);
  return { type, id, account };
}
async function writeAudit(req, session, action, targetType, targetId, before, after) {
  await Audit.create([{ actorId: req.user.sub, action, targetType, targetId, before, after, ip: req.ip }], { session });
}
function scopeInput(input) {
  if (!input || !["ALL", "SELECTED"].includes(input.mode)) fail("Alcance inválido");
  return { mode: input.mode, organizationIds: [...new Set(input.organizationIds || [])].map(validId), ownerIds: [...new Set(input.ownerIds || [])].map(validId) };
}
async function validateScope(scope, session) {
  if (scope.mode === "ALL") { scope.organizationIds = []; scope.ownerIds = []; return; }
  const organizations = await Organization.countDocuments({ _id: { $in: scope.organizationIds } }).session(session);
  const owners = await Owner.countDocuments({ _id: { $in: scope.ownerIds }, organizationId: null, "propertyDetails.contextType": "PERSONAL_RESIDENCE" }).session(session);
  if (organizations !== scope.organizationIds.length || owners !== scope.ownerIds.length) fail("El alcance contiene cuentas inválidas");
}
async function loadPolicies(ids, session) {
  if (!Array.isArray(ids)) fail("Selecciona las políticas");
  const unique = [...new Set(ids)].map(validId);
  const policies = await Policy.find({ _id: { $in: unique }, status: "active" }).session(session).lean();
  if (policies.length !== unique.length) fail("Política inválida o archivada");
  return { ids: unique, permissions: [...new Set(policies.flatMap(p => p.permissions))] };
}
async function lockPolicyWrites(session) {
  // Shared lock prevents concurrent policy edits and assignments from bypassing delegation.
  await require("../models/platformControl").findOneAndUpdate({ key: "authorization" }, { $inc: { revision: 1 } }, { upsert: true, session });
}
async function assertManageableUser(req, user, session) {
  if (user.role !== "PLATFORM_SUPERVISOR" || String(user._id) === String(req.user.sub)) fail("No puedes modificar esta cuenta", 403);
  const existing = await loadPolicies(user.policyIds.map(String), session);
  assertDelegation(req.auth, existing.permissions, user.scope);
}

// One scoped snapshot powers both account rows and KPIs; no credentials or resident PII.
async function accountSnapshot(context, selected = null) {
  const all = context.scope.mode === "ALL";
  const orgIds = selected ? selected.filter(row => row.subjectType === "ORGANIZATION").map(row => row.id) : null;
  const ownerIds = selected ? selected.filter(row => row.subjectType === "PERSONAL_OWNER").map(row => row.id) : null;
  const orgFilter = orgIds ? { _id: { $in: orgIds.filter(id => all || context.scope.organizationIds.map(String).includes(String(id))) } } : all ? {} : { _id: { $in: context.scope.organizationIds } };
  const ownerFilter = { organizationId: null, "propertyDetails.contextType": "PERSONAL_RESIDENCE", ...(ownerIds ? { _id: { $in: ownerIds.filter(id => all || context.scope.ownerIds.map(String).includes(String(id))) } } : all ? {} : { _id: { $in: context.scope.ownerIds } }) };
  const [orgs, owners] = await Promise.all([
    Organization.find(orgFilter).select("name status createdAt ownerAdminId").sort({ createdAt: -1 }).lean(),
    Owner.find(ownerFilter).select("name lastname status createdAt propertyDetails.contextType propertyDetails.status_property propertyDetails.addressId").sort({ createdAt: -1 }).lean(),
  ]);
  const [condos, memberships, tenantOwners] = await Promise.all([
    Condominium.find({ organizationId: { $in: orgs.map(o => o._id) }, status: { $ne: "inactive" } }).select("organizationId units.label units.normalizedLabel units.status availableUnits").lean(),
    Membership.find({ $or: [{ subjectType: "ORGANIZATION", subjectId: { $in: orgs.map(o => o._id) } }, { subjectType: "PERSONAL_OWNER", subjectId: { $in: owners.map(o => o._id) } }] }).lean(),
    Owner.find({ organizationId: { $in: orgs.map(o => o._id) }, status: { $ne: "inactive" } }).select("propertyDetails.addressId propertyDetails.condominium_unit propertyDetails.status_property").lean(),
  ]);
  const assignedLabels = assignedUnitLabels(tenantOwners);
  const bySubject = new Map(memberships.map(m => [`${m.subjectType}:${m.subjectId}`, m]));
  const orgUsage = new Map();
  for (const condo of condos) {
    const key = String(condo.organizationId);
    const usage = orgUsage.get(key) || { condominiums: 0, units: 0, unitsPerCondominium: 0, residences: 0 };
    const count = unitCount(condo, assignedLabels.get(String(condo._id)));
    usage.condominiums++; usage.units += count; usage.unitsPerCondominium = Math.max(usage.unitsPerCondominium, count);
    orgUsage.set(key, usage);
  }
  const row = (type, account, usage) => {
    const member = bySubject.get(`${type}:${account._id}`) || null;
    return { id: account._id, subjectType: type, name: `${account.name} ${account.lastname || ""}`.trim(), status: account.status, createdAt: account.createdAt, ownerAdminId: account.ownerAdminId || null,
      membership: member, usage, exceeded: member ? exceededLimits(member.limits, usage) : [],
      compliance: !member ? "UNPROVISIONED" : !isMembershipCurrent(member) ? "INACTIVE" : exceededLimits(member.limits, usage).length ? "EXCEEDED" : "COMPLIANT" };
  };
  return [...orgs.map(o => row("ORGANIZATION", o, orgUsage.get(String(o._id)) || { condominiums: 0, units: 0, unitsPerCondominium: 0, residences: 0 })),
    ...owners.map(o => row("PERSONAL_OWNER", o, { condominiums: 0, units: 0, unitsPerCondominium: 0, residences: residenceCount(o) }))];
}
function calculateKpis(rows, now = new Date()) {
  return { generatedAt: now.toISOString(), accounts: rows.length, organizations: rows.filter(r => r.subjectType === "ORGANIZATION").length,
    personalOwners: rows.filter(r => r.subjectType === "PERSONAL_OWNER").length,
    activeAccounts: rows.filter(r => r.status === "active").length, suspendedAccounts: rows.filter(r => r.status === "suspended" || r.status === "inactive").length,
    condominiums: rows.reduce((n, r) => n + r.usage.condominiums, 0), units: rows.reduce((n, r) => n + r.usage.units, 0), residences: rows.reduce((n, r) => n + r.usage.residences, 0),
    compliant: rows.filter(r => r.compliance === "COMPLIANT").length, exceeded: rows.filter(r => r.exceeded.length).length,
    unprovisioned: rows.filter(r => !r.membership).length,
    expired: rows.filter(r => r.membership?.endsAt && new Date(r.membership.endsAt) <= now).length,
    suspendedMemberships: rows.filter(r => r.membership?.status === "SUSPENDED").length,
    pastDue: rows.filter(r => r.membership?.billingStatus === "PAST_DUE").length,
    expiringSoon: rows.filter(r => r.membership && isMembershipCurrent(r.membership, now) && r.membership.endsAt && new Date(r.membership.endsAt) <= new Date(now.getTime() + 30 * 86400000)).length,
    plans: [...new Set(rows.map(r => r.membership?.plan).filter(Boolean))].map(plan => ({ plan, accounts: rows.filter(r => r.membership?.plan === plan).length })),
  };
}
function candidatePipeline(context, search = "", subjectType = "") {
  const all = context.scope.mode === "ALL";
  const ids = values => values.map(value => new mongoose.Types.ObjectId(value));
  const name = { $trim: { input: { $concat: [{ $ifNull: ["$name", ""] }, " ", { $ifNull: ["$lastname", ""] }] } } };
  const project = type => ({ $project: { id: "$_id", name, subjectType: { $literal: type }, createdAt: 1 } });
  const escaped = String(search).slice(0, 160).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [{ $match: all ? {} : { _id: { $in: ids(context.scope.organizationIds) } } }, project("ORGANIZATION"),
    { $unionWith: { coll: Owner.collection.name, pipeline: [{ $match: { organizationId: null, "propertyDetails.contextType": "PERSONAL_RESIDENCE", ...(all ? {} : { _id: { $in: ids(context.scope.ownerIds) } }) } }, project("PERSONAL_OWNER")] } },
    ...(subjectType ? [{ $match: { subjectType } }] : []), ...(escaped ? [{ $match: { name: { $regex: escaped, $options: "i" } } }] : []), { $sort: { createdAt: -1, id: -1 } }];
}
async function scanAccounts(context, search, consume) {
  let batch = [];
  for await (const row of Organization.aggregate(candidatePipeline(context, search)).cursor({ batchSize: 100 })) {
    batch.push(row);
    if (batch.length === 100) { await consume(await accountSnapshot(context, batch)); batch = []; }
  }
  if (batch.length) await consume(await accountSnapshot(context, batch));
}
const accounts = handle(async (req, res) => {
  if (req.query.subjectType && !["ORGANIZATION", "PERSONAL_OWNER"].includes(req.query.subjectType)) fail("Tipo de cuenta inválido");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 25));
  let rows, total;
  if (!req.query.compliance) {
    const [result] = await Organization.aggregate([...candidatePipeline(req.auth, req.query.search, req.query.subjectType), { $facet: { selected: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }], count: [{ $count: "total" }] } }]);
    const snapshots = await accountSnapshot(req.auth, result.selected);
    rows = result.selected.map(candidate => snapshots.find(row => String(row.id) === String(candidate.id) && row.subjectType === candidate.subjectType)).filter(Boolean);
    total = result.count[0]?.total || 0;
  } else {
    rows = []; total = 0;
    await scanAccounts(req.auth, req.query.search, async batch => { for (const row of batch) if (row.compliance === req.query.compliance) { if (total >= (page - 1) * pageSize && rows.length < pageSize) rows.push(row); total++; } });
  }
  ok(res, { rows, total, page, pageSize });
});
const kpis = handle(async (req, res) => {
  const result = calculateKpis([]); const plans = new Map();
  result.freeAccounts = 0; result.paidAccounts = 0; result.graceAccounts = 0;
  await scanAccounts(req.auth, "", async rows => {
    const batch = calculateKpis(rows);
    for (const [key, value] of Object.entries(batch)) if (typeof value === "number") result[key] += value;
    for (const plan of batch.plans) plans.set(plan.plan, (plans.get(plan.plan) || 0) + plan.accounts);
    result.freeAccounts += rows.filter(row => row.membership?.kind === "FREE").length;
    result.paidAccounts += rows.filter(row => row.membership?.kind === "PAID").length;
    result.graceAccounts += rows.filter(row => row.membership?.endsAt && new Date(row.membership.endsAt) <= new Date() && row.membership?.graceUntil && new Date(row.membership.graceUntil) > new Date()).length;
  });
  result.plans = [...plans].map(([plan, accounts]) => ({ plan, accounts }));
  if (req.auth.permissions.includes("platform.billing.read")) {
    const start = new Date(); start.setUTCDate(1); start.setUTCHours(0, 0, 0, 0);
    const scope = req.auth.scope;
    const filter = scope.mode === "ALL" ? {} : { $or: [{ subjectType: "ORGANIZATION", subjectId: { $in: scope.organizationIds.map(id => new mongoose.Types.ObjectId(id)) } }, { subjectType: "PERSONAL_OWNER", subjectId: { $in: scope.ownerIds.map(id => new mongoose.Types.ObjectId(id)) } }] };
    filter.environment = require("../service/saasPaypal").environment();
    const [subscriptions] = await require("../models/saasSubscription").aggregate([{ $match: filter }, { $group: { _id: null, mrrMinor: { $sum: { $cond: [{ $and: ["$open", { $eq: ["$state", "ACTIVE"] }, { $ne: ["$cancelRequested", true] }, { $gt: ["$paidThrough", new Date()] }] }, "$terms.priceMinor", 0] } }, cancelled: { $sum: { $cond: ["$cancelRequested", 1, 0] } } } }]);
    result.mrrMinor = subscriptions?.mrrMinor || 0; result.cancelledSubscriptions = subscriptions?.cancelled || 0;
    const totals = await require("../models/saasBilling").Charge.aggregate([{ $match: { ...filter, occurredAt: { $gte: start } } }, { $group: { _id: "$kind", amountMinor: { $sum: "$amountMinor" } } }]);
    result.revenueMonthMinor = totals.find(row => row._id === "PAYMENT")?.amountMinor || 0;
    result.refundsMonthMinor = totals.filter(row => row._id !== "PAYMENT").reduce((n, row) => n + row.amountMinor, 0);
  }
  ok(res, result);
});
const updateAccount = handle(async (req, res) => {
  const { type, id } = await target(req);
  const status = req.body.status;
  if (!req.body.reason?.trim() || req.body.reason.length > 500) fail("Indica el motivo del cambio");
  if (!(type === "ORGANIZATION" ? ["active", "suspended"] : ["active", "inactive"]).includes(status)) fail("Estado inválido");
  await mongoose.connection.transaction(async session => {
    const Model = type === "ORGANIZATION" ? Organization : Owner;
    if (type === "ORGANIZATION" && status === "active" && await require("../models/platformOperations").Lifecycle.exists({ organizationId: id, state: { $in: ["CLOSED", "DELETION_REQUESTED"] } }).session(session)) fail("Reactiva la organización desde Ciclo de vida", 409);
    const before = await Model.findById(id).select("status").session(session).lean();
    await Model.updateOne({ _id: id }, { $set: { status } }, { session });
    await writeAudit(req, session, "account.status", type, id, before, { status, reason: req.body.reason.trim() });
  });
  ok(res, { status });
});
const saveMembership = handle(async (req, res) => {
  const { type, id } = await target(req);
  const input = req.body;
  if (!input.reason?.trim() || input.reason.length > 500 || !["ACTIVE", "SUSPENDED", "CANCELLED"].includes(input.status) || !["MANUAL", "CURRENT", "PAST_DUE"].includes(input.billingStatus)) fail("Indica estado, facturación y motivo");
  const endsAt = input.endsAt ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(input.endsAt) ? `${input.endsAt}T23:59:59.999-04:00` : input.endsAt) : null;
  if (endsAt && !Number.isFinite(endsAt.getTime())) fail("Fecha inválida");
  let saved;
  await mongoose.connection.transaction(async session => {
    const before = await Membership.findOne({ subjectType: type, subjectId: id }).session(session).lean();
    const plan = await Plan.findOne({ name: input.plan, subjectType: type, ...(before?.plan === input.plan ? {} : { status: "active" }) }).session(session).lean();
    if (!plan) fail("Selecciona un plan activo para este tipo de cuenta");
    if (before?.kind === "PAID" && await require("../models/saasSubscription").exists({ subjectType: type, subjectId: id, open: true }).session(session)) fail("Gestiona la suscripción PayPal antes de cambiar la membresía", 409);
    saved = await Membership.findOneAndUpdate({ subjectType: type, subjectId: id }, { $set: { ...require("../service/saasCommercial").snapshot(plan), limits: limitsInput(input.limits || plan.limits), status: input.status, billingStatus: plan.kind === "FREE" ? "CURRENT" : input.billingStatus, endsAt: plan.kind === "FREE" ? null : endsAt, graceUntil: null, reason: input.reason.trim(), updatedBy: req.user.sub }, $inc: { revision: 1 } }, { upsert: true, returnDocument: "after", runValidators: true, session });
    await writeAudit(req, session, "membership.upsert", type, id, before, saved.toObject());
  });
  const usage = await usageFor(type, id);
  ok(res, { membership: saved, usage, exceeded: exceededLimits(saved.limits.toObject ? saved.limits.toObject() : saved.limits, usage) });
});
const listPolicies = handle(async (req, res) => ok(res, { permissions: PLATFORM_PERMISSIONS.filter(p => req.auth.permissions.includes(p)), policies: (await Policy.find().sort({ name: 1 }).lean()).filter(p => p.permissions.every(permission => req.auth.permissions.includes(permission))) }));
const savePolicy = handle(async (req, res) => {
  const permissions = [...new Set(req.body.permissions || [])];
  assertDelegation(req.auth, permissions, req.auth.scope);
  if (!req.body.name?.trim()) fail("Indica el nombre de la política");
  let saved;
  await mongoose.connection.transaction(async session => {
    await lockPolicyWrites(session);
    const before = req.params.id ? await Policy.findById(validId(req.params.id)).session(session).lean() : null;
    if (req.params.id && !before) fail("Política no encontrada", 404);
    if (before) {
      assertDelegation(req.auth, before.permissions, req.auth.scope);
      for (const user of await User.find({ policyIds: before._id }).session(session).lean()) {
        await assertManageableUser(req, user, session);
        assertDelegation(req.auth, permissions, user.scope);
      }
    }
    if (req.body.status === "archived" && before && await User.exists({ policyIds: before._id }).session(session)) fail("La política está asignada", 409);
    const values = { name: req.body.name.trim(), description: req.body.description || "", permissions, status: req.body.status === "archived" ? "archived" : "active" };
    if (before) saved = await Policy.findByIdAndUpdate(before._id, { $set: values }, { returnDocument: "after", runValidators: true, session });
    else [saved] = await Policy.create([{ ...values, createdBy: req.user.sub }], { session });
    await writeAudit(req, session, "platform.policy.save", "PLATFORM_POLICY", saved._id, before, saved.toObject());
  });
  ok(res, saved);
});
const listUsers = handle(async (req, res) => {
  const users = await User.find({ role: "PLATFORM_SUPERVISOR" }).populate("policyIds", "name permissions status").lean();
  const manageable = users.filter(user => { try { assertDelegation(req.auth, user.policyIds.flatMap(p => p.permissions), user.scope); return true; } catch { return false; } });
  ok(res, manageable.map(safeUser));
});
const saveUser = handle(async (req, res) => {
  const scope = scopeInput(req.body.scope);
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = req.body.password;
  if (!req.body.name?.trim() || !/^\S+@\S+\.\S+$/.test(email) || (password && (typeof password !== "string" || password.length < 12 || password.length > 128)) || (!req.params.id && !password)) fail("Indica nombre, correo y contraseña de 12 a 128 caracteres");
  if (!["active", "inactive"].includes(req.body.status)) fail("Estado inválido");
  const passwordHash = password ? await bcrypt.hash(password, 12) : null;
  let saved;
  await mongoose.connection.transaction(async session => {
    await lockPolicyWrites(session);
    const policies = await loadPolicies(req.body.policyIds, session);
    assertDelegation(req.auth, policies.permissions, scope);
    await validateScope(scope, session);
    const before = req.params.id ? await User.findById(validId(req.params.id)).session(session).lean() : null;
    if (req.params.id && !before) fail("Supervisor no encontrado", 404);
    if (before) await assertManageableUser(req, before, session);
    for (const Model of [User, ...new Set(Object.values(require("../service/authorization").ACCOUNT_MODELS))]) {
      if (await Model.exists({ email, ...(before ? { _id: { $ne: before._id } } : {}) }).session(session)) fail("El correo ya está en uso", 409);
    }
    const values = { name: req.body.name.trim(), lastname: String(req.body.lastname || "").trim(), phone: String(req.body.phone || ""), email, policyIds: policies.ids, scope, status: req.body.status, ...(passwordHash ? { password: passwordHash, sessionVersion: (before?.sessionVersion || 0) + 1 } : {}) };
    if (before) saved = await User.findByIdAndUpdate(before._id, { $set: values }, { returnDocument: "after", runValidators: true, session });
    else [saved] = await User.create([{ ...values, createdBy: req.user.sub, role: "PLATFORM_SUPERVISOR" }], { session });
    await writeAudit(req, session, "platform.supervisor.save", "PLATFORM_USER", saved._id, before && safeUser(before), safeUser(saved));
  });
  ok(res, safeUser(saved));
});
const listPlans = handle(async (req, res) => ok(res, await Plan.find().sort({ name: 1 }).lean()));
const savePlan = handle(async (req, res) => {
  if (!req.body.name?.trim() || !["ORGANIZATION", "PERSONAL_OWNER"].includes(req.body.subjectType)) fail("Plan inválido");
  let saved;
  await mongoose.connection.transaction(async session => {
    const before = req.params.id ? await Plan.findById(validId(req.params.id)).session(session).lean() : null;
    if (req.params.id && !before) fail("Plan no encontrado", 404);
    if (before?.publishing) fail("Finaliza la publicación PayPal antes de editar el plan", 409);
    const commercial = require("../service/saasCommercial").commercialInput(req.body, before || {});
    if (before?.paypalPlanId && (commercial.priceMinor !== before.priceMinor || req.body.name.trim() !== before.name || req.body.subjectType !== before.subjectType || commercial.kind !== before.kind || JSON.stringify(commercial.modules) !== JSON.stringify(before.modules) || JSON.stringify(limitsInput(req.body.limits)) !== JSON.stringify(before.limits))) fail("Crea otro plan para cambiar las condiciones de un plan publicado en PayPal", 409);
    const values = { ...commercial, name: req.body.name.trim(), subjectType: req.body.subjectType, limits: limitsInput(req.body.limits), status: req.body.status === "archived" ? "archived" : "active" };
    if (values.isDefaultFree && values.status === "active") await Plan.updateMany({ subjectType: values.subjectType, isDefaultFree: true, ...(before ? { _id: { $ne: before._id } } : {}) }, { $set: { isDefaultFree: false } }, { session });
    if (before) saved = await Plan.findByIdAndUpdate(before._id, { $set: values }, { returnDocument: "after", runValidators: true, session });
    else [saved] = await Plan.create([values], { session });
    await writeAudit(req, session, "plan.save", "SAAS_PLAN", saved._id, before, saved.toObject());
  });
  ok(res, saved);
});
const audits = handle(async (req, res) => {
  const filter = {};
  const objectIds = values => (values || []).map(value => new mongoose.Types.ObjectId(value));
  if (req.auth.scope.mode !== "ALL") filter.$or = [{ actorId: new mongoose.Types.ObjectId(req.user.sub) }, { targetType: "ORGANIZATION", targetId: { $in: objectIds(req.auth.scope.organizationIds) } }, { targetType: "PERSONAL_OWNER", targetId: { $in: objectIds(req.auth.scope.ownerIds) } }];
  const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
  const tenantFilter = req.auth.scope.mode === "ALL" ? {} : { organizationId: { $in: objectIds(req.auth.scope.organizationIds) } };
  for (const input of [filter, tenantFilter]) {
    if (req.query.action) input.action = String(req.query.action).slice(0, 150);
    if (req.query.actorId) input.actorId = new mongoose.Types.ObjectId(validId(req.query.actorId));
    if (req.query.from || req.query.to) {
      input.createdAt = {};
      for (const [key, value] of [["$gte", req.query.from], ["$lte", req.query.to]]) if (value) { const date = new Date(value); if (!Number.isFinite(date.getTime())) fail("Fecha inválida"); input.createdAt[key] = date; }
    }
  }
  const projection = { actorId: 1, actorRole: 1, action: 1, targetType: 1, targetId: 1, createdAt: 1 };
  const [result] = await Audit.aggregate([
    { $match: filter }, { $project: { ...projection, source: { $literal: "PLATFORM" } } },
    { $unionWith: { coll: require("../models/authorizationAudit").collection.name, pipeline: [{ $match: tenantFilter }, { $project: { ...projection, source: { $literal: "ORGANIZATION" } } }] } },
    { $facet: { rows: [{ $sort: { createdAt: -1, _id: -1 } }, { $skip: (page - 1) * 50 }, { $limit: 50 }], count: [{ $count: "total" }] } },
  ]);
  ok(res, { rows: result.rows, page, total: result.count[0]?.total || 0 });
});
const auditDetail = handle(async (req, res) => {
  const Model = req.query.source === "ORGANIZATION" ? require("../models/authorizationAudit") : Audit;
  const row = await Model.findById(validId(req.params.id)).lean();
  if (!row) fail("Registro no encontrado", 404);
  if (row.organizationId) requireTarget(req, "ORGANIZATION", row.organizationId);
  else if (["ORGANIZATION", "PERSONAL_OWNER"].includes(row.targetType)) requireTarget(req, row.targetType, row.targetId);
  else if (req.auth.scope.mode !== "ALL" && !(row.targetType === "PLATFORM_USER" && String(row.targetId) === String(req.user.sub))) fail("El detalle requiere alcance completo", 403);
  ok(res, require("../service/platformExportWorker").redact(row));
});
const organizationContext = async (req, res, next) => {
  try {
    validId(req.params.organizationId);
    requireTarget(req, "ORGANIZATION", req.params.organizationId);
    if (!await Organization.exists({ _id: req.params.organizationId })) fail("Organización no encontrada", 404);
    req.platformAuth = req.auth;
    req.auth = { ...req.auth, organizationId: req.params.organizationId };
    next();
  } catch (error) { res.status(error.statusCode || 500).send({ status: "error", message: error.message }); }
};
module.exports = { accounts, kpis, updateAccount, saveMembership, listPolicies, savePolicy, listUsers, saveUser, listPlans, savePlan, audits, auditDetail, organizationContext, calculateKpis, limitsInput };
