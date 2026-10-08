"use strict";
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const { Ticket, Notice, Delivery, Config, Lifecycle } = require("../models/platformOperations");
const { scopeFilter } = require("./saas");
const { requireTarget } = require("../service/platformAuthorization");
const { usageFor } = require("../service/saasMembershipService");
const { fail } = require("../service/saasCommercial");
const handle = fn => async (req, res) => { try { await fn(req, res); } catch (e) { res.status(e.statusCode || 500).send({ code: "PLATFORM_OPERATIONS_ERROR", message: e.statusCode ? e.message : "No se pudo completar la operación" }); } };
const text = (value, limit) => { if (typeof value !== "string" || !value.trim() || value.length > limit) fail("Revisa los campos de texto"); return value.trim(); };
function target(req, input) { if (!mongoose.isObjectIdOrHexString(input.subjectId)) fail("Cuenta inválida"); requireTarget(req, input.subjectType, input.subjectId); return { subjectType: input.subjectType, subjectId: input.subjectId }; }
async function validateAccount(context, session) {
  const Model = context.subjectType === "ORGANIZATION" ? require("../models/organization") : require("../models/owners");
  if (!await Model.exists({ _id: context.subjectId, ...(context.subjectType === "PERSONAL_OWNER" ? { organizationId: null, "propertyDetails.contextType": "PERSONAL_RESIDENCE" } : {}) }).session(session || null)) fail("Cuenta no encontrada", 404);
}
async function audit(req, action, type, id, before, after, session) { await require("../models/platformAudit").create([{ actorId: req.user.sub, action, targetType: type, targetId: id, before, after, ip: req.ip }], { session }); }
exports.tickets = handle(async (req, res) => { const page = Math.max(1, Number(req.query.page) || 1); res.send({ data: { rows: await Ticket.find(scopeFilter(req.auth)).sort({ createdAt: -1 }).skip((page - 1) * 50).limit(50).lean(), total: await Ticket.countDocuments(scopeFilter(req.auth)) } }); });
exports.saveTicket = handle(async (req, res) => {
  const context = target(req, req.body); const values = { ...context, title: text(req.body.title, 150), description: text(req.body.description, 2000), state: req.body.state || "OPEN", assigneeId: req.body.assigneeId || null };
  if (!["OPEN", "IN_PROGRESS", "RESOLVED"].includes(values.state)) fail("Estado inválido");
  if (values.assigneeId) {
    if (!mongoose.isObjectIdOrHexString(values.assigneeId)) fail("Responsable inválido");
    const context = await require("../service/platformAuthorization").resolvePlatformContext({ sub: values.assigneeId, role: "PLATFORM_SUPERVISOR" }) || await require("../service/platformAuthorization").resolvePlatformContext({ sub: values.assigneeId, role: "PLATFORM_ADMIN" });
    if (!context?.permissions.includes("platform.support.read") || !require("../service/platformPermissions").platformScopeAllows(context.scope, values.subjectType, values.subjectId)) fail("El responsable no tiene acceso a esta cuenta", 403);
  }
  let saved;
  await mongoose.connection.transaction(async session => {
    await validateAccount(context, session);
    const before = req.params.id ? await Ticket.findById(req.params.id).session(session).lean() : null;
    if (req.params.id && !before) fail("Incidencia no encontrada", 404);
    if (before) requireTarget(req, before.subjectType, before.subjectId);
    saved = before ? await Ticket.findByIdAndUpdate(before._id, { $set: values }, { session, returnDocument: "after", runValidators: true }) : (await Ticket.create([{ ...values, createdBy: req.user.sub }], { session }))[0];
    await audit(req, "platform.ticket.save", context.subjectType, context.subjectId, before, saved.toObject(), session);
  }); res.send({ data: saved });
});
exports.diagnostic = handle(async (req, res) => {
  const context = target(req, req.params); await validateAccount(context);
  const filter = context.subjectType === "ORGANIZATION" ? { organizationId: context.subjectId } : { ownerId: context.subjectId, organizationId: null };
  const [membership, usage, gateways, cameras] = await Promise.all([require("../models/saasMembership").findOne(context).lean(), usageFor(context.subjectType, context.subjectId), require("../models/iotGateway").find(filter).select("status lastHeartbeatAt").lean(), require("../models/camera").countDocuments(filter)]);
  await audit(req, "platform.diagnostic.read", context.subjectType, context.subjectId);
  res.send({ data: { membership, usage, integration: { gateways: gateways.length, activeGateways: gateways.filter(g => g.status === "ACTIVE").length, cameras } } });
});
exports.configuration = handle(async (_req, res) => res.send({ data: await Config.findOne({ key: "global" }).lean() || { retentionDays: 90, supportEmail: "", maintenanceMessage: "" } }));
exports.saveConfiguration = handle(async (req, res) => {
  const { retentionDays, supportEmail, maintenanceMessage } = req.body;
  if (!Number.isSafeInteger(retentionDays) || retentionDays < 7 || retentionDays > 3650 || typeof supportEmail !== "string" || (supportEmail && !/^\S+@\S+\.\S+$/.test(supportEmail)) || typeof maintenanceMessage !== "string" || maintenanceMessage.length > 2000) fail("Configuración inválida");
  await mongoose.connection.transaction(async session => { const before = await Config.findOne({ key: "global" }).session(session).lean(); const saved = await Config.findOneAndUpdate({ key: "global" }, { $set: { retentionDays, supportEmail, maintenanceMessage } }, { upsert: true, runValidators: true, session, returnDocument: "after" }); await audit(req, "platform.configuration.save", "PLATFORM_CONFIGURATION", saved._id, before, saved.toObject(), session); });
  res.send({ data: { saved: true } });
});
exports.health = handle(async (_req, res) => res.send({ data: { backup: await require("../service/saasBackupStatus").read(), database: mongoose.connection.readyState === 1 ? "CONNECTED" : "UNAVAILABLE", uptimeSeconds: Math.floor(process.uptime()), billing: require("../service/saasBillingWorker").state, notices: require("../service/platformNoticeWorker").state, features: Object.fromEntries(["SAAS_FREE_REGISTRATION_ENABLED", "SAAS_MODULES_ENABLED", "SAAS_PAYPAL_ENABLED", "PLATFORM_MFA_ENABLED", "PLATFORM_OPERATIONS_ENABLED"].map(key => [key, process.env[key] === "true"])) } }));
exports.retryBilling = handle(async (req, res) => { if (req.auth.scope.mode !== "ALL") fail("El reintento global requiere alcance completo", 403); await audit(req, "platform.billing.retry", "PLATFORM_USER", req.user.sub); require("../service/saasBillingWorker").run().catch(() => {}); res.status(202).send({ data: { queued: true } }); });
function audience(req) {
  if (req.body.mode === "ALL") { if (req.auth.scope.mode !== "ALL") fail("No puedes publicar para todas las cuentas", 403); return { mode: "ALL" }; }
  if (!Array.isArray(req.body.accounts) || !req.body.accounts.length || req.body.accounts.length > 500) fail("Selecciona las cuentas destinatarias");
  return { mode: "SELECTED", accounts: req.body.accounts.map(row => target(req, row)) };
}
function fingerprint(data, actorId) { return crypto.createHmac("sha256", require("../service/jwt").getJwtSecret()).update(JSON.stringify({ data, actorId })).digest("hex"); }
exports.previewNotice = handle(async (req, res) => {
  const data = { title: text(req.body.title, 150), body: text(req.body.body, 2000), audience: audience(req), cutoff: new Date().toISOString(), expiresAt: req.body.expiresAt };
  if (!Number.isFinite(new Date(data.expiresAt).getTime()) || new Date(data.expiresAt) <= new Date() || new Date(data.expiresAt) > new Date(Date.now() + 365 * 86400000)) fail("Fecha de vigencia inválida");
  const counts = await require("../service/platformNoticeWorker").recipientCount(data.audience, data.cutoff);
  res.send({ data: { ...data, recipientCount: counts, token: fingerprint(data, req.user.sub) } });
});
exports.publishNotice = handle(async (req, res) => {
  const input = req.body.preview;
  if (!input || !/^[a-f0-9]{64}$/.test(input.token || "") || !Number.isFinite(new Date(input.cutoff).getTime()) || Date.now() - new Date(input.cutoff).getTime() > 600000 || new Date(input.cutoff) > new Date()) fail("Genera otra previsualización");
  const data = { title: input.title, body: input.body, audience: input.audience, cutoff: input.cutoff, expiresAt: input.expiresAt };
  if (!crypto.timingSafeEqual(Buffer.from(input.token), Buffer.from(fingerprint(data, req.user.sub)))) fail("Previsualización inválida");
  audience({ ...req, body: data.audience });
  let saved;
  await mongoose.connection.transaction(async session => { [saved] = await Notice.create([{ ...data, createdBy: req.user.sub }], { session }); await audit(req, "platform.notice.publish", "PLATFORM_NOTICE", saved._id, null, { title: saved.title, recipientCount: input.recipientCount, audience: data.audience }, session); });
  res.status(202).send({ data: saved });
});
exports.notices = handle(async (req, res) => res.send({ data: { rows: await Notice.find(req.auth.scope.mode === "ALL" ? {} : { createdBy: req.user.sub }).sort({ createdAt: -1 }).limit(50).lean() } }));
exports.inbox = handle(async (req, res) => {
  const filter = { subjectType: req.auth.organizationId ? "ORGANIZATION" : "PERSONAL_OWNER", subjectId: req.auth.organizationId || req.user.sub };
  const deliveries = await Delivery.find(filter).sort({ createdAt: -1 }).limit(50).select("noticeId").lean();
  res.send({ data: await Notice.find({ _id: { $in: deliveries.map(row => row.noticeId) }, state: "PUBLISHED", expiresAt: { $gt: new Date() } }).select("title body createdAt expiresAt").sort({ createdAt: -1 }).lean() });
});
exports.lifecycle = handle(async (req, res) => { const filter = req.auth.scope.mode === "ALL" ? {} : { organizationId: { $in: req.auth.scope.organizationIds } }; res.send({ data: { rows: await Lifecycle.find(filter).sort({ createdAt: -1 }).limit(50).lean() } }); });
exports.requestClosure = handle(async (req, res) => {
  const context = target(req, { subjectType: "ORGANIZATION", subjectId: req.body.organizationId }); await validateAccount(context);
  const reason = text(req.body.reason, 500); let saved;
  await mongoose.connection.transaction(async session => { [saved] = await Lifecycle.create([{ organizationId: context.subjectId, reason, requestedBy: req.user.sub }], { session }); await audit(req, "platform.closure.request", "ORGANIZATION", context.subjectId, null, { requestId: saved._id, reason }, session); });
  res.send({ data: saved });
});
exports.executeClosure = handle(async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) fail("Solicitud inválida");
  await mongoose.connection.transaction(async session => {
    const request = await Lifecycle.findById(req.params.id).session(session).lean();
    if (!request || request.state !== "REQUESTED") fail("Solicitud no disponible", 409);
    requireTarget(req, "ORGANIZATION", request.organizationId);
    if (String(request.requestedBy) === String(req.user.sub)) fail("La baja requiere revisión por otro operador", 403);
    if (await require("../models/saasSubscription").exists({ subjectType: "ORGANIZATION", subjectId: request.organizationId, open: true }).session(session)) fail("Cancela primero la suscripción PayPal", 409);
    const config = await Config.findOne({ key: "global" }).session(session).lean();
    const eligibleAfter = new Date(Date.now() + (config?.retentionDays || 90) * 86400000);
    await require("../models/organization").updateOne({ _id: request.organizationId }, { $set: { status: "suspended" } }, { session });
    await Lifecycle.updateOne({ _id: request._id }, { $set: { state: "CLOSED", reviewedBy: req.user.sub, eligibleAfter } }, { session });
    await audit(req, "platform.closure.execute", "ORGANIZATION", request.organizationId, { status: "active" }, { status: "suspended", eligibleAfter }, session);
  }); res.send({ data: { closed: true } });
});
module.exports.audit = audit;

