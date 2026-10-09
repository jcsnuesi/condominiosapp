"use strict";
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const commercial = require("../service/saasCommercial");
const Plan = require("../models/saasPlan");
const Membership = require("../models/saasMembership");
const { usageFor, exceededLimits } = require("../service/saasMembershipService");
const { requireTarget } = require("../service/platformAuthorization");
const handle = fn => async (req, res) => { try { await fn(req, res); } catch (e) { res.status(e.statusCode || 500).send({ code: "SAAS_MIGRATION_ERROR", message: e.statusCode ? e.message : "No se pudo completar la migración" }); } };
function selection(req) {
  if (!mongoose.isObjectIdOrHexString(req.body.planId) || !Array.isArray(req.body.accounts) || !req.body.accounts.length || req.body.accounts.length > 50) commercial.fail("Selecciona entre una y cincuenta cuentas y un plan");
  const seen = new Set();
  for (const row of req.body.accounts) {
    if (!mongoose.isObjectIdOrHexString(row.subjectId)) commercial.fail("Cuenta inválida");
    requireTarget(req, row.subjectType, row.subjectId);
    const key = `${row.subjectType}:${row.subjectId}`; if (seen.has(key)) commercial.fail("Cuenta repetida"); seen.add(key);
  }
}
async function review(req, session) {
  selection(req);
  const plan = await Plan.findOne({ _id: req.body.planId, kind: "FREE", status: "active" }).session(session || null).lean();
  if (!plan) commercial.fail("Selecciona un plan gratuito activo");
  const rows = [];
  for (const row of req.body.accounts) {
    if (row.subjectType !== plan.subjectType) commercial.fail("El plan no corresponde al tipo de cuenta");
    const Model = row.subjectType === "ORGANIZATION" ? require("../models/organization") : require("../models/owners");
    const account = await Model.findOne({ _id: row.subjectId, ...(row.subjectType === "PERSONAL_OWNER" ? { organizationId: null, "propertyDetails.contextType": "PERSONAL_RESIDENCE" } : {}) }).select("name lastname status").session(session || null).lean();
    if (!account) commercial.fail("Cuenta no encontrada", 404);
    const member = await Membership.findOne({ subjectType: row.subjectType, subjectId: row.subjectId }).session(session || null).lean();
    const openSubscription = await require("../models/saasSubscription").exists({ subjectType: row.subjectType, subjectId: row.subjectId, open: true }).session(session || null);
    if (openSubscription) commercial.fail("Cancela la suscripción de pago antes de migrar", 409);
    const usage = await usageFor(row.subjectType, row.subjectId, session);
    rows.push({ ...row, name: `${account.name} ${account.lastname || ""}`.trim(), status: account.status, previous: member || null, usage,
      exceeded: exceededLimits(plan.limits, usage), removedModules: (member?.modules || commercial.MODULES).filter(m => !commercial.moduleAllowed(plan.modules, `${m}.read`)) });
  }
  return { plan: commercial.snapshot(plan), rows };
}
function fingerprint(data, actorId, expiresAt) { return crypto.createHmac("sha256", require("../service/jwt").getJwtSecret()).update(JSON.stringify({ data, actorId, expiresAt })).digest("hex"); }
exports.preview = handle(async (req, res) => { const data = await review(req); const expiresAt = Date.now() + 600000; res.send({ data: { ...data, expiresAt, token: fingerprint(data, req.user.sub, expiresAt) } }); });
exports.apply = handle(async (req, res) => {
  if (!req.body.reason?.trim() || req.body.reason.length > 500 || !Number.isFinite(req.body.expiresAt) || req.body.expiresAt < Date.now() || req.body.expiresAt > Date.now() + 600000 || !/^[a-f0-9]{64}$/.test(req.body.token || "")) commercial.fail("Revisa la previsualización y escribe un motivo");
  await mongoose.connection.transaction(async session => {
    const data = await review(req, session);
    if (!crypto.timingSafeEqual(Buffer.from(req.body.token), Buffer.from(fingerprint(data, req.user.sub, req.body.expiresAt)))) commercial.fail("El consumo o el plan cambió. Genera otra previsualización", 409);
    await Plan.updateOne({ _id: req.body.planId }, { $inc: { revision: 1 } }, { session });
    for (const row of data.rows) {
      const filter = { subjectType: row.subjectType, subjectId: row.subjectId };
      const after = { ...data.plan, ...filter, distributionEnabled: false, allocations: [], scheduledCapacity: null, status: "ACTIVE", billingStatus: "CURRENT", endsAt: null, graceUntil: null, reason: req.body.reason.trim(), updatedBy: req.user.sub };
      await Membership.findOneAndUpdate(filter, { $set: after, $inc: { revision: 1 } }, { session, upsert: true, runValidators: true });
      await require("../models/platformAudit").create([{ actorId: req.user.sub, targetType: row.subjectType, targetId: row.subjectId, action: "saas.migration.free", before: row.previous, after, ip: req.ip }], { session });
    }
  });
  res.send({ data: { migrated: req.body.accounts.length } });
});
