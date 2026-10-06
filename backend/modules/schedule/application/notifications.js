"use strict";
const crypto = require("node:crypto"); const mongoose = require("mongoose");
const { Command, Notice, Schedule, ScheduleTask, contextOf } = require("../infrastructure/models");
const { resolveAccessContext } = require("../../../service/authorization");
const access = require("./access");
async function processOne(now = new Date()) {
  const token = crypto.randomUUID();
  const command = await Command.findOneAndUpdate({ status: "queued", nextAttemptAt: { $lte: now }, $or: [{ leaseUntil: null }, { leaseUntil: { $lte: now } }] }, { $set: { leaseToken: token, leaseUntil: new Date(now.getTime() + 120000) }, $inc: { attempts: 1 } }, { returnDocument: "after", sort: { nextAttemptAt: 1 } });
  if (!command) return false;
  try {
    const auth = await resolveAccessContext({ sub: String(command.recipientId), role: command.recipientRole });
    const permitted = auth && await access.authorized(auth, command, "maintenance.update");
    await mongoose.connection.transaction(async session => {
      const current = await Command.findOne({ _id: command._id, leaseToken: token, status: "queued", leaseUntil: { $gt: new Date() } }).session(session);
      if (!current) return;
      const schedule = await Schedule.findById(current.scheduleId).session(session);
      const task = await ScheduleTask.findById(current.taskId).session(session);
      if (!task?.isOpen || String(task.assignedUserId) !== String(current.recipientId) || task.assignedRole !== current.recipientRole) current.status = "obsolete";
      else if (!schedule?.isActive) { current.nextAttemptAt = new Date(now.getTime() + 1800000); }
      else if (!permitted) {
        current.status = "blocked"; current.error = "RECIPIENT_ACCESS_LOST";
        schedule.notificationError = "RECIPIENT_ACCESS_LOST"; await schedule.save({ session });
      } else {
        const titles = { reminder: "Mantenimiento próximo", due: "Mantenimiento pendiente", overdue: "Mantenimiento atrasado" };
        await Notice.updateOne({ key: current.key }, { $setOnInsert: { ...contextOf(current), key: current.key, taskId: current.taskId, scheduleId: current.scheduleId, recipientId: current.recipientId, recipientRole: current.recipientRole, title: titles[current.kind], content: task.name, publishedAt: now, priority: current.kind === "overdue" ? "high" : "medium", type: "maintenance" } }, { upsert: true, session, runValidators: true });
        current.status = "delivered"; current.error = undefined;
      }
      current.leaseToken = undefined; current.leaseUntil = undefined; await current.save({ session });
    });
  } catch {
    await Command.updateOne({ _id: command._id, leaseToken: token }, { $set: { error: "NOTIFICATION_DELIVERY_FAILED", nextAttemptAt: new Date(now.getTime() + Math.min(86400000, 30000 * 2 ** Math.min(command.attempts, 10))) }, $unset: { leaseToken: 1, leaseUntil: 1 } });
  }
  return true;
}
async function visibleFilter(auth) {
  const locations = await access.contexts(auth);
  const options = locations.map(c => ({ condominiumId: c.condominiumId || null, unitId: c.unitId || null, residenceId: c.residenceId || null }));
  return { ...access.scope(auth), recipientId: auth.account._id, recipientRole: auth.role, $or: options.length ? options : [{ _id: null }] };
}
async function inbox(auth, limit) {
  if (!auth.permissions.includes("maintenance.read")) return { notifications: [], unreadCount: 0 };
  const query = await visibleFilter(auth);
  const [notices, unreadCount] = await Promise.all([Notice.find(query).sort({ publishedAt: -1 }).limit(limit).lean(), Notice.countDocuments({ ...query, readAt: null })]);
  return { unreadCount, notifications: notices.map(n => ({ ...n, source: "schedule", readBy: n.readAt ? [{ userId: String(auth.account._id) }] : [] })) };
}
async function read(auth, id) {
  const notice = await Notice.findOneAndUpdate({ ...await visibleFilter(auth), _id: access.validId(id) }, { $set: { readAt: new Date() } }, { returnDocument: "after" });
  if (!notice) require("../domain/rules").fail("Notice not found", 404); return notice;
}
module.exports = { processOne, inbox, read };
