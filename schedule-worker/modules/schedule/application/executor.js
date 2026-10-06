"use strict";
const mongoose = require("mongoose"); const crypto = require("node:crypto");
const { Schedule, ScheduleTask, ScheduleRun, Command, contextOf } = require("../infrastructure/models");
const rules = require("../domain/rules");
const { resolveAccessContext } = require("../../../service/authorization");
const access = require("./access");
const { audit } = require("../../maintenance/service");
class ScheduleExecutor { async execute() { throw new Error("Executor must implement execute(scheduleId)"); } }
class InternalSchedulerExecutor extends ScheduleExecutor {
  constructor({ now = () => new Date(), leaseMs = 120000 } = {}) { super(); this.now = now; this.leaseMs = leaseMs; }
  async execute(scheduleId) {
    const now = this.now(), token = crypto.randomUUID();
    const claimed = await Schedule.findOneAndUpdate({ _id: scheduleId, isActive: true, nextActionAt: { $lte: now }, $or: [{ leaseUntil: null }, { leaseUntil: { $lte: now } }] }, { $set: { leaseToken: token, leaseUntil: new Date(now.getTime() + this.leaseMs) } }, { returnDocument: "after" });
    if (!claimed) return false;
    try {
      await mongoose.connection.transaction(async session => {
        const schedule = await Schedule.findOne({ _id: scheduleId, leaseToken: token, leaseUntil: { $gt: this.now() }, isActive: true }).session(session);
        if (!schedule) return;
        // A schedule cannot keep running against a removed unit or residence.
        const identity = schedule.ownerId ? { sub: String(schedule.ownerId), role: "OWNER" } : { sub: String(schedule.createdBy), role: "ADMIN" };
        // Organizational scope is validated against the location itself; creator
        // delegation is not the continuing authority for organization-owned work.
        let locationValid = true;
        if (schedule.ownerId) {
          const ownerAuth = await resolveAccessContext(identity);
          locationValid = Boolean(ownerAuth && await access.authorized(ownerAuth, schedule));
        } else {
          const condo = await require("../../../models/condominio").exists({ _id: schedule.condominiumId, organizationId: schedule.organizationId, status: "active", ...(schedule.unitId ? { units: { $elemMatch: { _id: schedule.unitId, status: "active" } } } : {}) }).session(session);
          locationValid = Boolean(condo);
          const org = await require("../../../models/organization").exists({ _id: schedule.organizationId, status: "active" }).session(session); locationValid = locationValid && Boolean(org);
        }
        if (!locationValid) {
          schedule.isActive = false; schedule.notificationError = "LOCATION_ACCESS_LOST";
          await audit(null, schedule, "schedule.access_lost", {}, session);
        } else {
          let task = schedule.openTaskId ? await ScheduleTask.findById(schedule.openTaskId).session(session) : null;
          if (!task) {
            const runKey = `${schedule._id}:${schedule.nextRunAt.toISOString()}:${schedule.revision}`;
            [task] = await ScheduleTask.create([{ ...contextOf(schedule), scheduleId: schedule._id, runKey, name: schedule.name, dueDate: schedule.nextRunAt, originalDueDate: schedule.nextRunAt, timezone: schedule.timezone, assignedUserId: schedule.assignedUserId, assignedRole: schedule.assignedRole, status: schedule.nextRunAt <= now ? "PENDING" : "SCHEDULED" }], { session });
            await ScheduleRun.updateOne({ runKey }, { $setOnInsert: { ...contextOf(schedule), scheduleId: schedule._id, runKey }, $set: { taskId: task._id, startedAt: now, finishedAt: now, result: "MATERIALIZED" }, $unset: { error: 1 }, $inc: { attempts: 1 } }, { session, upsert: true, runValidators: true });
            schedule.openTaskId = task._id;
          }
          const reminderAt = rules.reminderDate(task.dueDate, schedule.remindBeforeDays, schedule.timezone);
          const overdueAt = new Date(task.dueDate.getTime() + 1);
          const enqueue = async (kind, flag) => {
            if (task[flag]) return;
            await Command.create([{ ...contextOf(task), key: `${task.runKey}:${task.notificationVersion}:${kind}`, taskId: task._id, scheduleId: schedule._id, recipientId: task.assignedUserId, recipientRole: task.assignedRole, kind, nextAttemptAt: now }], { session });
            task[flag] = true;
          };
          if (now < task.dueDate && now >= reminderAt) await enqueue("reminder", "reminderSent");
          if (now >= task.dueDate) {
            if (task.status === "SCHEDULED") task.status = "PENDING";
            if (now < overdueAt) await enqueue("due", "dueSent");
          }
          if (now >= overdueAt) {
            if (task.status !== "OVERDUE") { task.status = "OVERDUE"; await audit(null, task, "task.overdue", {}, session); }
            await enqueue("overdue", "overdueSent");
          }
          await task.save({ session });
          schedule.nextActionAt = now < reminderAt ? reminderAt : now < task.dueDate ? task.dueDate : now < overdueAt ? overdueAt : new Date(now.getTime() + 86400000);
        }
        schedule.leaseToken = undefined; schedule.leaseUntil = undefined;
        await schedule.save({ session });
      });
      return true;
    } catch (error) {
      const runKey = `${claimed._id}:${claimed.nextRunAt.toISOString()}:${claimed.revision}`;
      // Preserve a successful commit if a network error made its outcome ambiguous.
      await ScheduleRun.updateOne({ runKey, result: { $ne: "MATERIALIZED" } }, { $setOnInsert: { ...contextOf(claimed), scheduleId: claimed._id, runKey, startedAt: now }, $set: { finishedAt: this.now(), result: "FAILED", error: "SCHEDULE_EXECUTION_FAILED" }, $inc: { attempts: 1 } }, { upsert: true }).catch(() => {});
      await Schedule.updateOne({ _id: scheduleId, leaseToken: token }, { $set: { nextActionAt: new Date(this.now().getTime() + 60000) }, $unset: { leaseToken: 1, leaseUntil: 1 } }); throw error;
    }
  }
}
module.exports = { ScheduleExecutor, InternalSchedulerExecutor };
