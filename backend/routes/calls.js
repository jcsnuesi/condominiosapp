"use strict";
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { timingSafeEqual } = require("node:crypto");
const mongoose = require("mongoose");
const { authenticated } = require("../middleware/auth");
const { requirePermission } = require("../middleware/organizationAuth");
const { resolveAccessContext, canAccessCondominium } = require("../service/authorization");
const { authorizedFamilyPropertyDetails, activeOwnerPropertyDetails, propertyCondominiumId } = require("../service/residentPropertyAccess");
const { validateSupport } = require("../service/residentSupport");
const Condominium = require("../models/condominio");
const Staff = require("../models/staff");
const SupportCall = require("../models/supportCall");
function secret(name) {
  const value = process.env[name];
  if (!value || value.length < 32) throw Object.assign(new Error("Servicio de llamadas no configurado"), { statusCode: 503 });
  return value;
}
function internal(req, res, next) {
  try {
    const expected = Buffer.from(secret("CALL_INTERNAL_TOKEN"));
    const supplied = Buffer.from(String(req.headers["x-call-internal-token"] || ""));
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return res.status(403).json({ message: "Forbidden" });
    next();
  } catch (error) { next(error); }
}
async function credentialContext(token) {
  const payload = jwt.verify(token, secret("CALL_TOKEN_SECRET"), { algorithms: ["HS256"], audience: "call-service", issuer: "condapp" });
  const context = await resolveAccessContext(payload);
  if (!context?.organizationId || !["OWNER", "FAMILY", "STAFF"].includes(context.role)) throw Object.assign(new Error("Acceso no autorizado"), { statusCode: 403 });
  return context;
}
async function destinations(context) {
  if (!["OWNER", "FAMILY", "STAFF"].includes(context.role) || !context.organizationId) return [];
  const filter = { organizationId: context.organizationId, status: "active", "residentSupport.enabled": true };
  if (context.role === "STAFF") filter["residentSupport.staffId"] = context.account._id;
  else filter._id = { $in: context.scope.condominiumIds };
  const condos = await Condominium.find(filter).select("alias residentSupport").lean();
  const result = [];
  for (const condo of condos) {
    if (await Staff.exists({ _id: condo.residentSupport.staffId, organizationId: context.organizationId, condo_id: condo._id, status: "active" })) result.push({ condominiumId: String(condo._id), alias: condo.alias, staffId: String(condo.residentSupport.staffId) });
  }
  return result;
}
router.get("/calls/session", authenticated, async (req, res, next) => {
  try {
    res.set("Cache-Control", "no-store");
    const targets = await destinations(req.auth);
    if (!req.auth.organizationId || !["OWNER", "FAMILY", "STAFF"].includes(req.auth.role)) return res.json({ destinations: [], token: null });
    if (!targets.length && !process.env.CALL_TOKEN_SECRET) return res.json({ destinations: [], token: null });
    const token = jwt.sign({ sub: String(req.auth.account._id), role: req.auth.role }, secret("CALL_TOKEN_SECRET"), { algorithm: "HS256", audience: "call-service", issuer: "condapp", expiresIn: "5m" });
    res.json({ token, destinations: targets });
  } catch (error) { next(error); }
});
router.get("/calls/settings/:id", authenticated, requirePermission("condominiums.update", { getCondominiumId: (req) => req.params.id }), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Condominio inválido" });
    const condo = await Condominium.findOne({ _id: req.params.id, organizationId: req.auth.organizationId, status: "active" }).select("residentSupport").lean();
    if (!condo) return res.sendStatus(404);
    const staff = await Staff.find({ condo_id: condo._id, organizationId: req.auth.organizationId, status: "active" }).select("name lastname").lean();
    res.json({ support: condo.residentSupport || { enabled: false, staffId: null }, staff });
  } catch (error) { next(error); }
});
router.put("/calls/settings/:id", authenticated, requirePermission("condominiums.update", { getCondominiumId: (req) => req.params.id }), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Condominio inválido" });
    const support = await validateSupport(req.body, req.params.id, req.auth.organizationId);
    const condo = await Condominium.findOneAndUpdate({ _id: req.params.id, organizationId: req.auth.organizationId, status: "active" }, { $set: { residentSupport: support } }, { new: true, runValidators: true });
    if (!condo) return res.sendStatus(404);
    res.json({ support: condo.residentSupport });
  } catch (error) { next(error); }
});
router.post("/calls/internal/validate", internal, async (req, res, next) => {
  try {
    const context = await credentialContext(req.body.token);
    const memberships = context.role === "STAFF" ? [context.account.condo_id].filter(Boolean) : context.scope.condominiumIds;
    const activeCondos = await Condominium.find({ organizationId: context.organizationId, status: "active", _id: { $in: memberships } }).select("_id").lean();
    res.json({ userId: String(context.account._id), role: context.role, authorizedCondominiumIds: activeCondos.map((condo) => String(condo._id)), destinations: await destinations(context) });
  } catch (error) { next(error); }
});
router.post("/calls/internal/authorize", internal, async (req, res, next) => {
  try {
    const resident = await credentialContext(req.body.residentToken);
    if (!["OWNER", "FAMILY"].includes(resident.role) || !mongoose.Types.ObjectId.isValid(req.body.condominiumId) || !canAccessCondominium(resident, req.body.condominiumId)) return res.sendStatus(403);
    const condo = await Condominium.findOne({ _id: req.body.condominiumId, organizationId: resident.organizationId, status: "active", "residentSupport.enabled": true }).lean();
    if (!condo || !(await Staff.exists({ _id: condo.residentSupport.staffId, condo_id: condo._id, organizationId: resident.organizationId, status: "active" }))) return res.sendStatus(403);
    if (req.body.staffToken) {
      const staff = await credentialContext(req.body.staffToken);
      if (staff.role !== "STAFF" || String(staff.account._id) !== String(condo.residentSupport.staffId) || String(staff.organizationId) !== String(resident.organizationId)) return res.sendStatus(403);
    }
    const properties = resident.role === "FAMILY" ? authorizedFamilyPropertyDetails(resident.account) : activeOwnerPropertyDetails(resident.account, condo._id);
    const units = properties.filter((property) => String(propertyCondominiumId(property)) === String(condo._id)).map((property) => resident.role === "FAMILY" ? property.unit : property.condominium_unit).filter(Boolean);
    res.json({ organizationId: String(resident.organizationId), condominiumId: String(condo._id), alias: condo.alias, residentId: String(resident.account._id), residentRole: resident.role, staffId: String(condo.residentSupport.staffId), name: `${resident.account.name} ${resident.account.lastname}`.trim(), units });
  } catch (error) { next(error); }
});
router.post("/calls/internal/history", internal, async (req, res, next) => {
  try {
    const { callId, organizationId, condominiumId, residentId, residentRole, staffId, startedAt, acceptedAt, connectedAt, endedAt, result } = req.body;
    if (!/^[0-9a-f-]{36}$/i.test(callId || "") || !["ringing", "connecting", "active", "ended", "rejected", "cancelled", "missed", "failed", "disconnected", "service_restart"].includes(result)) return res.sendStatus(400);
    const final = !["ringing", "connecting", "active"].includes(result);
    // Only the service writes history; updates for a call are serialized by it.
    const existing = await SupportCall.findOne({ callId });
    if (existing?.endedAt) return res.sendStatus(204);
    await SupportCall.updateOne({ callId }, { $set: { organizationId, condominiumId, residentId, residentRole, staffId, startedAt, acceptedAt, connectedAt, endedAt: final ? endedAt || new Date() : undefined, result } }, { upsert: true, runValidators: true });
    res.sendStatus(204);
  } catch (error) { next(error); }
});
router.post("/calls/internal/recover", internal, async (_req, res, next) => {
  try {
    await SupportCall.updateMany({ endedAt: null, result: { $in: ["ringing", "connecting", "active"] } }, { $set: { result: "service_restart", endedAt: new Date() } });
    res.sendStatus(204);
  } catch (error) { next(error); }
});
router.use((error, _req, res, _next) => {
  const authError = ["JsonWebTokenError", "TokenExpiredError"].includes(error.name);
  const code = authError ? 403 : error.statusCode || 500;
  res.status(code).json({ message: code === 500 ? "No se pudo procesar la llamada" : error.message });
});
module.exports = router;
