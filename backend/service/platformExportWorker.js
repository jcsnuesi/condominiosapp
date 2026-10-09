"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const mongoose = require("mongoose");
const { Export } = require("../models/platformOperations");
const base = path.join(os.tmpdir(), "comunard-private-exports");
function fileFor(id) { if (!/^[a-f0-9]{24}$/.test(String(id))) throw new Error("invalid export ID"); return path.join(base, `${id}.ndjson`); }
function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (!value || typeof value !== "object" || value instanceof Date || value instanceof mongoose.Types.ObjectId) return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !/password|secret|token|credential|private.?key|rtsp|certificate|api.?key|authorization/i.test(key)).map(([key, child]) => [key, redact(child)]));
}
let timer, running = false;
async function run() {
  if (running || !require("./saasCommercial").enabled("PLATFORM_OPERATIONS_ENABLED")) return;
  running = true;
  try {
    await fs.mkdir(base, { recursive: true, mode: 0o700 });
    for await (const job of Export.find({ state: { $in: ["QUEUED", "RUNNING"] }, expiresAt: { $gt: new Date() } }).lean().cursor()) {
      let file;
      try {
        const actor = await require("../models/platformUser").findById(job.createdBy).select("role").lean();
        const context = actor && await require("./platformAuthorization").resolvePlatformContext({ sub: job.createdBy, role: actor.role });
        if (!context?.permissions.includes("platform.data.read") || !require("./platformPermissions").platformScopeAllows(context.scope, "ORGANIZATION", job.organizationId)) throw new Error("revoked");
        await Export.updateOne({ _id: job._id }, { $set: { state: "RUNNING" } });
        file = await fs.open(fileFor(job._id), "w", 0o600); let recordCount = 0;
        await file.write(JSON.stringify({ format: "comunard-organization-export-v1", organizationId: job.organizationId, generatedAt: new Date(), includes: "Tenant records and attachment metadata; credentials excluded" }) + "\n");
        const collections = new Map();
        for (const Model of Object.values(mongoose.models)) if (Model.schema.path("organizationId") && !Model.modelName.startsWith("Platform")) collections.set(Model.collection.name, Model);
        collections.set(require("../models/organization").collection.name, require("../models/organization"));
        for (const Model of collections.values()) {
          const filter = Model.modelName === "Organization" ? { _id: job.organizationId } : { organizationId: job.organizationId };
          for await (const document of Model.find(filter).lean().cursor({ batchSize: 100 })) { await file.write(JSON.stringify({ collection: Model.collection.name, document: redact(document) }) + "\n"); recordCount++; }
        }
        for (const Model of [require("../models/saasMembership"), require("../models/saasSubscription"), require("../models/saasBilling").Charge, require("../models/saasCapacityChange"), require("../models/saasBillingAdjustment")]) {
          for await (const document of Model.find({ subjectType: "ORGANIZATION", subjectId: job.organizationId }).lean().cursor({ batchSize: 100 })) { await file.write(JSON.stringify({ collection: Model.collection.name, document: redact(document) }) + "\n"); recordCount++; }
        }
        await file.close(); file = null;
        await Export.updateOne({ _id: job._id }, { $set: { state: "READY", recordCount } });
      } catch { if (file) await file.close(); await fs.unlink(fileFor(job._id)).catch(() => {}); await Export.updateOne({ _id: job._id }, { $set: { state: "FAILED" } }); }
    }
    for await (const job of Export.find({ state: { $ne: "EXPIRED" }, expiresAt: { $lte: new Date() } }).select("_id").lean().cursor()) { await fs.unlink(fileFor(job._id)).catch(() => {}); await Export.updateOne({ _id: job._id }, { $set: { state: "EXPIRED" } }); }
  } finally { running = false; }
}
function start() { if (!timer) { timer = setInterval(() => run().catch(() => {}), 60000); timer.unref(); } }
module.exports = { run, start, fileFor, redact };
