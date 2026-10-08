"use strict";
const mongoose = require("mongoose");
const { Export } = require("../models/platformOperations");
const { requireTarget } = require("../service/platformAuthorization");
const { fail } = require("../service/saasCommercial");
const { audit } = require("./platformOperations");
const handle = fn => async (req, res) => { try { await fn(req, res); } catch (e) { res.status(e.statusCode || 500).send({ message: e.statusCode ? e.message : "No se pudo completar la exportación" }); } };
exports.create = handle(async (req, res) => {
  const organizationId = req.body.organizationId;
  if (!mongoose.isObjectIdOrHexString(organizationId)) fail("Organización inválida"); requireTarget(req, "ORGANIZATION", organizationId);
  if (!await require("../models/organization").exists({ _id: organizationId })) fail("Organización no encontrada", 404);
  let job;
  await mongoose.connection.transaction(async session => { [job] = await Export.create([{ organizationId, createdBy: req.user.sub, expiresAt: new Date(Date.now() + 86400000) }], { session }); await audit(req, "platform.export.request", "ORGANIZATION", organizationId, null, { exportId: job._id }, session); });
  res.status(202).send({ data: job });
});
exports.list = handle(async (req, res) => res.send({ data: await Export.find({ createdBy: req.user.sub }).sort({ createdAt: -1 }).limit(50).lean() }));
exports.download = handle(async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) fail("Exportación inválida");
  const job = await Export.findOne({ _id: req.params.id, createdBy: req.user.sub, state: "READY", expiresAt: { $gt: new Date() } }).lean();
  if (!job) fail("Exportación no disponible", 404); requireTarget(req, "ORGANIZATION", job.organizationId);
  await audit(req, "platform.export.download", "ORGANIZATION", job.organizationId, null, { exportId: job._id });
  res.download(require("../service/platformExportWorker").fileFor(job._id), `comunard-${job.organizationId}.ndjson`, error => { if (error && !res.headersSent) res.status(410).send({ message: "El archivo expiró o el servidor se reinició; genera otra exportación" }); });
});
