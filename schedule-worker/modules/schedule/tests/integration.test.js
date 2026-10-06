"use strict";
const test = require("node:test"); const assert = require("node:assert/strict"); const express = require("express"); const http = require("node:http"); const mongoose = require("mongoose");
const { fixture, scheduleInput } = require("./fixtures");
const models = require("../infrastructure/models"); const schedules = require("../application/service"); const { InternalSchedulerExecutor } = require("../application/executor"); const maintenance = require("../../maintenance/service"); const notices = require("../application/notifications"); const access = require("../application/access");
const { fileType, store, remove } = require("../../maintenance/evidence"); const { createToken } = require("../../../service/jwt");
test("Schedule integration: transactions, ownership, leases, API and private notices", { skip: !process.env.SCHEDULE_TEST_MONGODB_URI }, async t => {
  let f;
  t.after(async () => { if (f) await f.cleanup(); else if (mongoose.connection.readyState) await mongoose.disconnect(); });
  f = await fixture(process.env.SCHEDULE_TEST_MONGODB_URI);
  const now = new Date(); now.setUTCMilliseconds(0);
  const due = new Date(now.getTime() + 86400000);
  const input = scheduleInput({ condominiumId: f.condoId }, due);
  let schedule, task;
  await t.test("exclusive ownership is enforced even for raw writes", async () => {
    await assert.rejects(models.Schedule.collection.insertOne({ organizationId: f.orgId, ownerId: f.ownerId }), e => e.code === 121);
    await assert.rejects(models.Schedule.collection.insertOne({}), e => e.code === 121);
  });
  await t.test("two workers materialize one task and one reminder", async () => {
    schedule = await schedules.create(f.admin, input);
    const executor = new InternalSchedulerExecutor({ now: () => now });
    const results = await Promise.all([executor.execute(schedule._id), executor.execute(schedule._id)]);
    assert.equal(results.filter(Boolean).length, 1);
    assert.equal(await models.ScheduleTask.countDocuments({ scheduleId: schedule._id }), 1);
    assert.equal(await models.ScheduleRun.countDocuments({ scheduleId: schedule._id }), 1);
    task = await models.ScheduleTask.findOne({ scheduleId: schedule._id }); assert.equal(task.status, "SCHEDULED");
    await notices.processOne(now); await notices.processOne(now);
    assert.equal(await models.Notice.countDocuments({ taskId: task._id }), 1);
  });
  await t.test("leases recover, overdue advances and repeating the worker is safe", async () => {
    await models.Schedule.updateOne({ _id: schedule._id }, { $set: { leaseToken: "abandoned", leaseUntil: new Date(0) } });
    const clock = new Date(due.getTime() + 1000); const executor = new InternalSchedulerExecutor({ now: () => clock });
    await executor.execute(schedule._id); await executor.execute(schedule._id);
    task = await models.ScheduleTask.findById(task._id); assert.equal(task.status, "OVERDUE");
    assert.equal(await models.Command.countDocuments({ taskId: task._id, kind: "overdue" }), 1);
  });
  await t.test("tenant, owner and unit references cannot be forged", async () => {
    await assert.rejects(access.load(models.Schedule, f.foreignAdmin, schedule._id), e => e.statusCode === 404);
    await assert.rejects(schedules.create(f.admin, { ...input, condominiumId: f.foreignCondoId }), e => e.statusCode === 403);
    await assert.rejects(schedules.create(f.owner, { ...input, unitId: f.unitId, assignedUserId: f.adminId, assignedRole: "ADMIN" }), e => e.statusCode === 403);
    const privateSchedule = await schedules.create(f.owner, scheduleInput({ condominiumId: f.condoId, unitId: f.unitId }, due));
    assert.equal(privateSchedule.organizationId, null);
    await assert.rejects(access.load(models.Schedule, f.admin, privateSchedule._id), e => e.statusCode === 404);
    const personal = await schedules.create(f.personal, scheduleInput({ residenceId: f.residenceId }, due)); assert.equal(String(personal.ownerId), String(f.personalOwnerId));
  });
  await t.test("pause suppresses materialization and resume emits at most one occurrence", async () => {
    const paused = await schedules.create(f.admin, input); await schedules.active(f.admin, paused._id, false);
    const executor = new InternalSchedulerExecutor({ now: () => new Date(due.getTime() + 864000000) });
    assert.equal(await executor.execute(paused._id), false); await schedules.active(f.admin, paused._id, true);
    await executor.execute(paused._id); assert.equal(await models.ScheduleTask.countDocuments({ scheduleId: paused._id }), 1);
  });
  await t.test("reschedule keeps task identity and clears pending obsolete notices", async () => {
    const newDue = new Date(Date.now() + 172800000);
    await maintenance.reschedule(f.admin, task._id, newDue);
    assert.equal(await models.ScheduleTask.countDocuments({ scheduleId: schedule._id }), 1);
    assert.equal((await models.ScheduleTask.findById(task._id)).dueDate.toISOString(), newDue.toISOString());
    assert.equal(await models.Command.countDocuments({ taskId: task._id, status: "queued" }), 0);
  });
  await t.test("failed closure rolls back and repeated closure preserves the provider snapshot", async () => {
    await assert.rejects(maintenance.closeTask(f.admin, task._id, { performedAt: now.toISOString(), cost: "-1" }));
    assert.equal((await models.ScheduleTask.findById(task._id)).isOpen, true);
    assert.equal(await models.Record.countDocuments({ taskId: task._id }), 0);
    const vendor = await maintenance.saveVendor(f.admin, { name: "Proveedor de prueba", contact: "Contacto" });
    const record = await maintenance.closeTask(f.admin, task._id, { performedAt: now.toISOString(), cost: "1250.50", providerId: vendor._id, notes: "Trabajo realizado" });
    const repeated = await maintenance.closeTask(f.admin, task._id, { performedAt: now.toISOString(), cost: "0" });
    assert.equal(String(record._id), String(repeated._id)); assert.equal(record.cost.toString(), "1250.50");
    await maintenance.saveVendor(f.admin, { name: "Proveedor cambiado", contact: "", isActive: false }, vendor._id);
    assert.equal((await models.Record.findById(record._id)).providerSnapshot.name, "Proveedor de prueba");
    const expected = require("../domain/rules").nextDate(now, "MONTH", 4);
    assert.equal((await models.Schedule.findById(schedule._id)).nextRunAt.toISOString(), expected.toISOString());
    await assert.rejects(maintenance.status(f.admin, task._id, "PENDING"));
    await assert.rejects(models.Record.updateOne({ _id: record._id }, { notes: "altered" }));
  });
  await t.test("recipient loss blocks delivery and reassignment recovers safely", async () => {
    const pending = await schedules.create(f.personal, scheduleInput({ residenceId: f.residenceId }, due));
    await new InternalSchedulerExecutor({ now: () => now }).execute(pending._id);
    await require("../../../models/owners").collection.updateOne({ _id: f.personalOwnerId }, { $set: { status: "inactive" } });
    while (await notices.processOne(now)) {}
    assert.equal(await models.Notice.countDocuments({ scheduleId: pending._id }), 0);
    assert.equal((await models.Schedule.findById(pending._id)).notificationError, "RECIPIENT_ACCESS_LOST");
    await require("../../../models/owners").collection.updateOne({ _id: f.personalOwnerId }, { $set: { status: "active" } });
    // An explicit reassignment to the restored identity must also reset blocked commands.
    await schedules.update(f.personal, pending._id, { assignedUserId: String(f.personalOwnerId), assignedRole: "OWNER" });
  });
  await t.test("HTTP personal context, inbox, list filters and download authorization", async () => {
    const app = express(); app.use(express.json()); app.use("/api", require("../api")); app.use("/api", require("../../../routes/notification"));
    const server = http.createServer(app); await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    try {
      const base = `http://127.0.0.1:${server.address().port}/api`;
      const request = async (path, auth, method = "GET", body) => fetch(base + path, { method, headers: { Authorization: createToken(auth.account), ...(body ? { "Content-Type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
      assert.equal((await request("/schedules/contexts", f.personal)).status, 200);
      assert.equal((await request("/notifications/inbox", f.personal)).status, 200);
      const own = await (await request("/schedules", f.admin)).json(); assert(own.data.docs.every(d => String(d.organizationId) === String(f.orgId)));
      const foreign = await (await request(`/schedules?condominiumId=${f.foreignCondoId}`, f.admin)).json(); assert.equal(foreign.data.total, 0);
      assert.equal((await request(`/tasks/${task._id}`, f.foreignAdmin)).status, 404);
      const record = await models.Record.findOne({ taskId: task._id });
      assert.equal((await request(`/maintenance/history/${record._id}/evidence/${new mongoose.Types.ObjectId()}`, f.foreignAdmin)).status, 404);
      const inbox = await (await request("/notifications/inbox", f.admin)).json(); assert(inbox.data.notifications.some(n => n.source === "schedule"));
    } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  });
  await t.test("delegated manager permissions and deny overrides are enforced on action routes", async () => {
    const Staff = require("../../../models/staff_admin"), Grant = require("../../../models/accessGrant"), Policy = require("../../../models/accessPolicy");
    const staffId = new mongoose.Types.ObjectId(), policyId = new mongoose.Types.ObjectId();
    await Staff.collection.insertOne({ _id: staffId, organizationId: f.orgId, role: "STAFF_ADMIN", status: "active" });
    await Policy.collection.insertOne({ _id: policyId, organizationId: f.orgId, status: "active", name: "Schedule test manager", permissions: ["schedules.read", "schedules.create", "schedules.update", "maintenance.read", "maintenance.update"] });
    await Grant.collection.insertOne({ organizationId: f.orgId, subjectModel: "Staff_Admin", subjectId: staffId, policyIds: [policyId], overrides: { allow: [], deny: [] }, scope: { mode: "SELECTED", condominiumIds: [f.condoId] } });
    const delegated = await f.auth(staffId, "STAFF_ADMIN");
    const managed = await schedules.create(delegated, input);
    await assert.rejects(schedules.create(delegated, { ...input, condominiumId: f.foreignCondoId }));
    const app = express(); app.use(express.json()); app.use("/api", require("../api")); app.use("/api", require("../../../routes/notification")); const server = http.createServer(app);
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    try {
      const base = `http://127.0.0.1:${server.address().port}/api`;
      const token = createToken(delegated.account);
      const privateWork = await schedules.create(delegated, input);
      await new InternalSchedulerExecutor({ now: () => now }).execute(privateWork._id);
      await notices.processOne(now);
      await require("../../../models/notification").collection.insertOne({ organizationId: f.orgId, condominiumId: f.condoId, title: "Restricted community notice", content: "Private community content", type: "general", isActive: true, isDeleted: false, publishedAt: now });
      const inboxResponse = await fetch(`${base}/notifications/inbox`, { headers: { Authorization: token } });
      assert.equal(inboxResponse.status, 200);
      const inbox = (await inboxResponse.json()).data;
      assert(inbox.notifications.some(n => n.source === "schedule"));
      assert(inbox.notifications.every(n => n.source === "schedule"));
      assert.equal((await fetch(`${base}/schedules/${managed._id}/pause`, { method: "POST", headers: { Authorization: token } })).status, 200);
      await Grant.collection.updateOne({ subjectId: staffId }, { $set: { "overrides.deny": ["schedules.update"] } });
      assert.equal((await fetch(`${base}/schedules/${managed._id}/resume`, { method: "POST", headers: { Authorization: token } })).status, 403);
    } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  });
  await t.test("notification retries after a failed write do not duplicate delivery", async () => {
    const s = await schedules.create(f.admin, input); await new InternalSchedulerExecutor({ now: () => now }).execute(s._id);
    const command = await models.Command.findOne({ scheduleId: s._id });
    const original = models.Notice.updateOne; let failed = false;
    models.Notice.updateOne = function (...args) { if (args[0].key === command.key && !failed) { failed = true; throw new Error("Injected write failure"); } return original.apply(this, args); };
    try { await notices.processOne(now); } finally { models.Notice.updateOne = original; }
    assert.equal((await models.Command.findById(command._id)).status, "queued");
    const retryAt = new Date((await models.Command.findById(command._id)).nextAttemptAt.getTime() + 1);
    await notices.processOne(retryAt); await notices.processOne(retryAt);
    assert.equal(await models.Notice.countDocuments({ key: command.key }), 1);
    assert.equal((await models.Command.findById(command._id)).status, "delivered");
    assert.equal(await models.ScheduleTask.countDocuments({ scheduleId: s._id }), 1);
  });
  await t.test("one-time closure ends the schedule and manual next dates survive paused completion", async () => {
    const once = await schedules.create(f.admin, { ...input, frequencyType: "ONCE", remindBeforeDays: 0, startDate: now.toISOString() });
    await new InternalSchedulerExecutor({ now: () => now }).execute(once._id);
    const onceTask = await models.ScheduleTask.findOne({ scheduleId: once._id });
    await maintenance.closeTask(f.admin, onceTask._id, { performedAt: now.toISOString() });
    assert.equal((await models.Schedule.findById(once._id)).nextRunAt, null);
    await assert.rejects(schedules.active(f.admin, once._id, true), e => e.statusCode === 409);
    const recurring = await schedules.create(f.admin, input); await new InternalSchedulerExecutor({ now: () => now }).execute(recurring._id);
    const recurringTask = await models.ScheduleTask.findOne({ scheduleId: recurring._id });
    await schedules.active(f.admin, recurring._id, false);
    const manual = new Date(now.getTime() + 30 * 86400000);
    const record = await maintenance.closeTask(f.admin, recurringTask._id, { performedAt: now.toISOString(), nextRecommendedDate: manual.toISOString() });
    assert.equal(record.nextRecommendedDate.toISOString(), manual.toISOString());
    assert.equal((await models.Schedule.findById(recurring._id)).isActive, false);
  });
  await t.test("standard policy migration is repeatable and rollback preserves custom permissions", async () => {
    const Policy = require("../../../models/accessPolicy"); const { migrate } = require("../../../scripts/migrateSchedule");
    const policyId = new mongoose.Types.ObjectId();
    await Policy.collection.insertOne({ _id: policyId, organizationId: f.orgId, isSystem: true, key: "OPERATIONS_ADMIN", name: "Standard", status: "active", permissions: ["iot.read", "schedules.read"] });
    await migrate({ apply: true }); await migrate({ apply: true });
    const migrated = await Policy.findById(policyId).lean(); assert(migrated.permissions.includes("schedules.create"));
    assert.equal(migrated.permissions.filter(p => p === "schedules.create").length, 1);
    await migrate({ apply: true, rollback: true });
    assert.deepEqual((await Policy.findById(policyId)).permissions, ["iot.read", "schedules.read"]);
  });
  await t.test("failed materialization records the error and retry creates one occurrence", async () => {
    const s = await schedules.create(f.admin, input);
    const original = models.ScheduleTask.create;
    models.ScheduleTask.create = () => { throw new Error("Injected transaction failure"); };
    try { await assert.rejects(new InternalSchedulerExecutor({ now: () => now }).execute(s._id)); } finally { models.ScheduleTask.create = original; }
    assert.equal(await models.ScheduleTask.countDocuments({ scheduleId: s._id }), 0);
    assert.equal((await models.ScheduleRun.findOne({ scheduleId: s._id })).result, "FAILED");
    const retryAt = new Date(now.getTime() + 60001);
    await new InternalSchedulerExecutor({ now: () => retryAt }).execute(s._id);
    assert.equal(await models.ScheduleTask.countDocuments({ scheduleId: s._id }), 1);
    const run = await models.ScheduleRun.findOne({ scheduleId: s._id }); assert.equal(run.result, "MATERIALIZED"); assert.equal(run.attempts, 2); assert.equal(run.error, undefined);
  });
  await t.test("standalone worker starts without importing the HTTP app and produces a heartbeat", async () => {
    const { execFileSync } = require("node:child_process"); const path = require("node:path"); const fs = require("node:fs/promises");
    const uri = new URL(process.env.SCHEDULE_TEST_MONGODB_URI); uri.pathname = `/${mongoose.connection.name}`;
    const heartbeat = path.resolve(__dirname, "../../../../tmp/schedule-worker-smoke.txt");
    const worker = path.resolve(__dirname, "../worker.js");
    const output = execFileSync(process.execPath, ["-e", `const w=require(${JSON.stringify(worker)});w.start().then(()=>w.stop()).catch(e=>{console.error(e.message);process.exitCode=1});`], { env: { ...process.env, MONGODB_URI: uri.toString(), SCHEDULE_MODULE_ENABLED: "true", DISABLE_SCHEDULED_JOBS: "true", SCHEDULE_WORKER_HEARTBEAT: heartbeat }, timeout: 15000, encoding: "utf8" });
    assert(output.includes('"event":"schedule.tick"')); assert(!output.includes("Scheduled background jobs"));
    assert(Number(await fs.readFile(heartbeat, "utf8")) > Date.now() - 15000);
  });
  await t.test("evidence content rejects fake MIME and persists approved files", async () => {
    assert.throws(() => fileType(Buffer.from("<script>not an image</script>")));
    await assert.rejects(store([{ buffer: Buffer.from("%PDF-1.7\n"), mimetype: "image/png", originalname: "fake.png", size: 9 }]));
    const files = await store([{ buffer: Buffer.from("%PDF-1.7\n"), mimetype: "application/pdf", originalname: "receipt.pdf", size: 9 }]); assert.equal(files.length, 1); await remove(files);
  });
});
