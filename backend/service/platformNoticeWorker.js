"use strict";
const { Notice, Delivery } = require("../models/platformOperations");
const { enabled } = require("./saasCommercial");
let timer, running = false;
const state = { running: false, lastRunAt: null, lastSuccessAt: null, failures: 0 };
function filterFor(audience, cutoff, subjectType) {
  const filter = { $or: [{ createdAt: { $lte: new Date(cutoff) } }, { createdAt: { $exists: false } }] };
  if (subjectType === "PERSONAL_OWNER") Object.assign(filter, { organizationId: null, "propertyDetails.contextType": "PERSONAL_RESIDENCE" });
  if (audience.mode !== "ALL") filter._id = { $in: audience.accounts.filter(row => row.subjectType === subjectType).map(row => row.subjectId) };
  return filter;
}
const models = () => [["ORGANIZATION", require("../models/organization")], ["PERSONAL_OWNER", require("../models/owners")]];
async function recipientCount(audience, cutoff) { let total = 0; for (const [type, Model] of models()) total += await Model.countDocuments(filterFor(audience, cutoff, type)); return total; }
async function run() {
  if (running || !enabled("PLATFORM_OPERATIONS_ENABLED")) return;
  running = true; state.running = true; state.lastRunAt = new Date();
  try {
    for await (const notice of Notice.find({ state: "QUEUED" }).lean().cursor()) {
      try {
        const actor = await require("../models/platformUser").findById(notice.createdBy).select("role").lean();
        const context = actor && await require("./platformAuthorization").resolvePlatformContext({ sub: notice.createdBy, role: actor.role });
        if (!context?.permissions.includes("platform.communications.manage")) throw new Error("revoked");
        if (notice.audience.mode === "ALL" && context.scope.mode !== "ALL") throw new Error("scope revoked");
        if (notice.audience.mode !== "ALL" && notice.audience.accounts.some(row => !require("./platformPermissions").platformScopeAllows(context.scope, row.subjectType, row.subjectId))) throw new Error("scope revoked");
        for (const [type, Model] of models()) {
          let batch = [];
          for await (const account of Model.find(filterFor(notice.audience, notice.cutoff, type)).select("_id").lean().cursor()) {
            batch.push({ updateOne: { filter: { noticeId: notice._id, subjectType: type, subjectId: account._id }, update: { $setOnInsert: { noticeId: notice._id, subjectType: type, subjectId: account._id } }, upsert: true } });
            if (batch.length === 100) { await Delivery.bulkWrite(batch); batch = []; }
          }
          if (batch.length) await Delivery.bulkWrite(batch);
        }
        await Notice.updateOne({ _id: notice._id }, { $set: { state: "PUBLISHED", recipientCount: await Delivery.countDocuments({ noticeId: notice._id }) } });
      } catch { state.failures++; await Notice.updateOne({ _id: notice._id }, { $set: { state: "ERROR" } }); }
    }
    state.lastSuccessAt = new Date();
  } finally { running = false; state.running = false; }
}
function start() { if (!timer) { timer = setInterval(() => run().catch(() => { state.failures++; }), 60000); timer.unref(); } }
module.exports = { run, start, state, recipientCount, filterFor };
