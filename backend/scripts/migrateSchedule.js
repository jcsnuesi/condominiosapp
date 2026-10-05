"use strict";
require("dotenv").config(); const mongoose = require("mongoose");
const models = require("../modules/schedule/infrastructure/models"); const Policy = require("../models/accessPolicy");
const { PERMISSIONS } = require("../service/permissionCatalog");
const schedulePermissions = PERMISSIONS.filter(p => /^(schedules|maintenance|vendors)\./.test(p));
const validator = { $or: [
  { organizationId: { $type: "objectId" }, ownerId: { $eq: null } },
  { ownerId: { $type: "objectId" }, organizationId: { $eq: null } },
] };
async function migrate({ apply = false, rollback = false } = {}) {
  const state = mongoose.connection.db.collection("schedule_migration_state");
  if (rollback) {
    const snapshots = await state.find({ migration: "schedule-v1" }).toArray();
    for (const snapshot of snapshots) {
      console.log(JSON.stringify({ policyId: String(snapshot.policyId), action: apply ? "restore-policy-permissions" : "rollback-dry-run" }));
      if (apply) {
        await Policy.updateOne({ _id: snapshot.policyId, isSystem: true }, { $pull: { permissions: { $in: snapshot.added } } });
        await state.deleteOne({ _id: snapshot._id });
      }
    }
    return;
  }
  for (const Model of Object.values(models).filter(m => m?.modelName)) {
    const name = Model.collection.name;
    console.log(JSON.stringify({ collection: name, action: apply ? "ensure-validator-and-indexes" : "dry-run", indexes: Model.schema.indexes().length }));
    if (!apply) continue;
    const exists = await mongoose.connection.db.listCollections({ name }).toArray();
    if (!exists.length) {
      try { await mongoose.connection.db.createCollection(name, { validator, validationLevel: "strict", validationAction: "error" }); }
      catch (error) { if (error.code !== 48) throw error; }
    }
    await mongoose.connection.db.command({ collMod: name, validator, validationLevel: "strict", validationAction: "error" });
    await Model.createIndexes();
  }
  const policies = await Policy.find({ isSystem: true, key: { $in: ["OPERATIONS_ADMIN", "READ_ONLY"] } }).select("_id key permissions").lean();
  for (const policy of policies) {
    const permissions = policy.key === "READ_ONLY" ? schedulePermissions.filter(p => p.endsWith(".read")) : schedulePermissions;
    if (apply) {
      await state.updateOne({ _id: `schedule-v1:${policy._id}` }, { $setOnInsert: { migration: "schedule-v1", policyId: policy._id, added: permissions.filter(p => !policy.permissions.includes(p)) } }, { upsert: true });
      await Policy.updateOne({ _id: policy._id }, { $addToSet: { permissions: { $each: permissions } } });
    }
  }
  console.log(JSON.stringify({ policies: policies.length, applied: apply }));
}
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { autoIndex: false, autoCreate: false }).then(() => migrate({ apply: process.argv.includes("--apply"), rollback: process.argv.includes("--rollback") })).then(() => mongoose.disconnect()).catch(async () => { console.error("Schedule migration failed; check MongoDB and existing indexes"); await mongoose.disconnect(); process.exitCode = 1; });
}
module.exports = { migrate, validator };
