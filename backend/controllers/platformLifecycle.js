"use strict";
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const { Lifecycle, Export } = require("../models/platformOperations");
const Organization = require("../models/organization");
const { requireTarget } = require("../service/platformAuthorization");
const { fail } = require("../service/saasCommercial");
const { audit } = require("./platformOperations");
const handle = fn => async (req, res) => { try { await fn(req, res); } catch (e) { res.status(e.statusCode || 500).send({ message: e.statusCode ? e.message : "No se pudo completar el ciclo de vida" }); } };
async function requestFor(req, session) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) fail("Solicitud inválida");
  const row = await Lifecycle.findById(req.params.id).session(session || null).lean();
  if (!row) fail("Solicitud no encontrada", 404);
  requireTarget(req, "ORGANIZATION", row.organizationId); return row;
}
exports.reactivate = handle(async (req, res) => {
  if (!req.body.reason?.trim() || req.body.reason.length > 500) fail("Indica el motivo de la reactivación");
  await mongoose.connection.transaction(async session => {
    const row = await requestFor(req, session);
    if (!["REQUESTED", "CLOSED", "DELETION_REQUESTED"].includes(row.state)) fail("La solicitud ya terminó", 409);
    await Organization.updateOne({ _id: row.organizationId }, { $set: { status: "active" } }, { session });
    await Lifecycle.updateOne({ _id: row._id }, { $set: { state: "CANCELLED" } }, { session });
    await audit(req, "platform.closure.reactivate", "ORGANIZATION", row.organizationId, { state: row.state }, { reason: req.body.reason.trim() }, session);
  }); res.send({ data: { reactivated: true } });
});
exports.requestDeletion = handle(async (req, res) => {
  if (!req.body.reason?.trim() || req.body.reason.length > 500) fail("Indica el motivo del borrado");
  await mongoose.connection.transaction(async session => {
    const row = await requestFor(req, session);
    if (row.state !== "CLOSED" || !row.eligibleAfter || new Date(row.eligibleAfter) > new Date()) fail("La retención aún no terminó", 409);
    await Lifecycle.updateOne({ _id: row._id }, { $set: { state: "DELETION_REQUESTED", requestedBy: req.user.sub, reviewedBy: null, reason: req.body.reason.trim() } }, { session });
    await audit(req, "platform.deletion.request", "ORGANIZATION", row.organizationId, null, { requestId: row._id, reason: req.body.reason.trim() }, session);
  }); res.send({ data: { requested: true } });
});
// Financial records and immutable audit trails follow their separate retention
// policy. Physical files/cloud resources must be removed through their existing
// owners first; this endpoint never guesses a filesystem or cloud deletion path.
function retained(name) { return /Audit|Invoice|PaymentTransaction|Finance|Bank|TransferReceipt|OwnerCredit|Cxc/.test(name); }
async function manifest(row, session) {
  const org = await Organization.findById(row.organizationId).session(session || null).lean();
  if (!org || org.status !== "suspended" || row.state !== "DELETION_REQUESTED" || !row.eligibleAfter || new Date(row.eligibleAfter) > new Date()) fail("La organización no está lista para borrado", 409);
  if (await require("../models/saasSubscription").exists({ subjectType: "ORGANIZATION", subjectId: row.organizationId, open: true }).session(session || null)) fail("Hay una suscripción abierta", 409);
  const blockers = [];
  for (const Model of [require("../models/camera"), require("../models/iotGateway")]) if (await Model.exists({ organizationId: row.organizationId }).session(session || null)) blockers.push(`Retira primero ${Model.modelName} y sus recursos externos`);
  const collections = new Map();
  for (const Model of Object.values(mongoose.models)) if (Model.schema.path("organizationId") && !Model.modelName.startsWith("Platform")) collections.set(Model.collection.name, Model);
  const rows = [];
  for (const Model of collections.values()) {
    const filter = { organizationId: row.organizationId };
    const count = await Model.countDocuments(filter).session(session || null);
    if (!count) continue;
    const preserve = retained(Model.modelName);
    rows.push({ collection: Model.collection.name, model: Model.modelName, count, preserve });
    if (!preserve) {
      const fileFields = ["file", "attachments", "evidence", "avatar", "id_image_front", "id_image_back"].filter(key => Model.schema.path(key));
      if (fileFields.length && await Model.exists({ ...filter, $or: fileFields.map(key => ["file", "attachments", "evidence"].includes(key) ? { [`${key}.0`]: { $exists: true } } : { [key]: { $exists: true, $nin: [null, "", "noimage.jpeg", "default-avatar.png"] } }) }).session(session || null)) blockers.push(`Retira los adjuntos de ${Model.modelName}`);
    }
  }
  const ownerIds = (await require("../models/owners").find({ organizationId: row.organizationId }).select("_id").session(session || null).lean()).map(owner => owner._id);
  const condoIds = (await require("../models/condominio").find({ organizationId: row.organizationId }).select("_id").session(session || null).lean()).map(condo => condo._id);
  // Legacy collections cannot safely be erased by inferred owner/condominium
  // links, some of which may cross account boundaries. Require explicit cleanup.
  for (const Model of Object.values(mongoose.models)) {
    if (Model.schema.path("organizationId") || Model.modelName.startsWith("Platform")) continue;
    const refs = [];
    if (ownerIds.length && Model.schema.path("ownerId")) refs.push({ ownerId: { $in: ownerIds } });
    if (condoIds.length && Model.schema.path("propertyDetails.addressId")) refs.push({ "propertyDetails.addressId": { $in: condoIds } });
    if (refs.length && await Model.exists({ $or: refs }).session(session || null)) blockers.push(`Revisa las referencias heredadas en ${Model.modelName}`);
  }
  if (rows.reduce((n, item) => n + (item.preserve ? 0 : item.count), 0) > 50000) blockers.push("La cuenta requiere purga por lotes fuera de la interfaz");
  const backup = await require("../service/saasBackupStatus").read();
  if (backup.state !== "VERIFIED_RECENT" || !backup.offsiteVerified || backup.backupAt < new Date(row.eligibleAfter)) blockers.push("Se requiere respaldo externo restaurado y verificado después de la retención, de las últimas 24 horas");
  return { requestId: String(row._id), organizationId: String(row.organizationId), slug: org.slug, rows, blockers, backup: backup.artifact, expiresAt: new Date(Date.now() + 600000).toISOString() };
}
function signature(data, actorId) { return crypto.createHmac("sha256", require("../service/jwt").getJwtSecret()).update(JSON.stringify({ data, actorId })).digest("hex"); }
exports.previewDeletion = handle(async (req, res) => { const row = await requestFor(req); const data = await manifest(row); res.send({ data: { ...data, token: signature(data, req.user.sub) } }); });
exports.executeDeletion = handle(async (req, res) => {
  if (process.env.PLATFORM_DATA_PURGE_ENABLED !== "true") fail("La purga física no está habilitada", 503);
  const { preview, confirmation } = req.body;
  if (!preview || !/^[a-f0-9]{64}$/.test(preview.token || "") || !Number.isFinite(new Date(preview.expiresAt).getTime()) || new Date(preview.expiresAt) < new Date()) fail("Genera otra revisión de borrado");
  const { token, ...signed } = preview;
  if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(signature(signed, req.user.sub)))) fail("Revisión inválida");
  await mongoose.connection.transaction(async session => {
    const row = await requestFor(req, session);
    if (String(row.requestedBy) === String(req.user.sub)) fail("El borrado requiere otro operador", 403);
    const current = await manifest(row, session); current.expiresAt = signed.expiresAt;
    if (JSON.stringify(current) !== JSON.stringify(signed)) fail("La revisión cambió; genera otra", 409);
    if (current.blockers.length) fail(current.blockers.join(". "), 409);
    if (confirmation !== current.slug) fail("Escribe el identificador exacto de la organización");
    await Organization.updateOne({ _id: row.organizationId, status: "suspended" }, { $set: { status: "suspended" } }, { session });
    for (const item of current.rows.filter(item => !item.preserve)) await mongoose.models[item.model].deleteMany({ organizationId: row.organizationId }, { session });
    await require("../models/saasMembership").deleteOne({ subjectType: "ORGANIZATION", subjectId: row.organizationId }, { session });
    await require("../models/platformOperations").Ticket.deleteMany({ subjectType: "ORGANIZATION", subjectId: row.organizationId }, { session });
    await require("../models/platformOperations").Delivery.deleteMany({ subjectType: "ORGANIZATION", subjectId: row.organizationId }, { session });
    await Export.updateMany({ organizationId: row.organizationId }, { $set: { expiresAt: new Date(), state: "FAILED" } }, { session });
    await Organization.deleteOne({ _id: row.organizationId }, { session });
    await Lifecycle.updateOne({ _id: row._id }, { $set: { state: "DELETED", reviewedBy: req.user.sub } }, { session });
    await audit(req, "platform.deletion.execute", "ORGANIZATION", row.organizationId, null, { collections: current.rows, backup: current.backup }, session);
  }); res.send({ data: { deleted: true } });
});
