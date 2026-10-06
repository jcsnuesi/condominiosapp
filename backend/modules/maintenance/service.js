"use strict";
const mongoose = require("mongoose");
const {
  Schedule,
  ScheduleTask,
  Record,
  Vendor,
  Audit,
  Command,
  contextOf,
} = require("../schedule/infrastructure/models");
const access = require("../schedule/application/access");
const rules = require("../schedule/domain/rules");
const Docs = require("../../models/docs");
function catalogScope(auth) {
  const { condominiumId, ...filter } = access.scope(auth);
  return filter;
}
async function audit(auth, resource, action, changes, session) {
  await Audit.create(
    [
      {
        ...contextOf(resource),
        actorId: auth?.account?._id || null,
        action,
        targetId: resource._id,
        changes,
      },
    ],
    { session }
  );
}
function money(value = "0") {
  const string = String(value);
  if (!/^\d{1,12}(?:\.\d{1,2})?$/.test(string))
    rules.fail(
      "Cost must be a nonnegative decimal with at most two decimal places"
    );
  return mongoose.Types.Decimal128.fromString(string);
}
function vendorInput(input) {
  return {
    name: rules.text(input.name, 200, true),
    contact: rules.text(input.contact || "", 300),
    notes: rules.text(input.notes || "", 2000),
    ...(typeof input.isActive === "boolean"
      ? { isActive: input.isActive }
      : {}),
  };
}
async function saveVendor(auth, input, id) {
  const fields = vendorInput(input);
  let result;
  await mongoose.connection.transaction(async (session) => {
    if (id) {
      result = await Vendor.findOneAndUpdate(
        { ...catalogScope(auth), _id: access.validId(id) },
        {
          $set: {
            ...fields,
            ...(typeof input.isActive === "boolean"
              ? { isActive: input.isActive }
              : {}),
          },
        },
        { returnDocument: "after", runValidators: true, session }
      );
      if (!result) rules.fail("Provider not found", 404);
    } else
      [result] = await Vendor.create([{ ...catalogScope(auth), ...fields }], {
        session,
      });
    await audit(
      auth,
      result,
      id ? "vendor.updated" : "vendor.created",
      fields,
      session
    );
  });
  return result;
}
async function closeTask(
  auth,
  taskId,
  input = {},
  evidence = [],
  target = "COMPLETED",
  now = new Date()
) {
  let result;
  await mongoose.connection.transaction(async (session) => {
    const task = await access.load(ScheduleTask, auth, taskId, session);
    if (!task.isOpen) {
      if (task.status !== target) rules.fail("Task is already closed", 409);
      result =
        target === "COMPLETED"
          ? await Record.findOne({ taskId: task._id }).session(session)
          : task;
      return;
    }
    const schedule = await access.load(
      Schedule,
      auth,
      task.scheduleId,
      session
    );
    let base = now;
    let provider = null;
    if (target === "COMPLETED") {
      base = rules.date(input.performedAt, "performedAt");
      if (base > now) rules.fail("Performed date cannot be in the future");
      if (input.providerId) {
        provider = await Vendor.findOne({
          ...catalogScope(auth),
          _id: access.validId(input.providerId),
          isActive: true,
        }).session(session);
        if (!provider) rules.fail("Provider not available", 403);
      }
      if (
        !Array.isArray(input.documentIds || []) ||
        (input.documentIds || []).length > 5
      )
        rules.fail("Invalid document references");
      if (input.documentIds?.length) {
        if (!auth.permissions.includes("documents.read"))
          rules.fail("Document access permission is required", 403);
        if (!auth.organizationId || !schedule.condominiumId)
          rules.fail("Existing documents require organization context", 403);
        const unique = [...new Set(input.documentIds.map(String))];
        unique.forEach(access.validId);
        const docs = await Docs.find({
          _id: { $in: unique },
          organizationId: auth.organizationId,
          condoId: schedule.condominiumId,
          status: "Active",
        })
          .session(session)
          .lean();
        if (docs.length !== unique.length)
          rules.fail("Document reference outside scope", 403);
      }
    } else rules.transition(task.status, target);
    let next = rules.nextDate(
      base,
      schedule.frequencyType,
      schedule.frequencyValue,
      schedule.timezone
    );
    if (target === "COMPLETED" && input.nextRecommendedDate) {
      if (schedule.frequencyType === "ONCE")
        rules.fail("A one-time schedule cannot have a successor");
      next = rules.date(input.nextRecommendedDate, "nextRecommendedDate");
      if (next <= base) rules.fail("Next date must follow performed date");
    }
    if (target === "COMPLETED") {
      const currency = input.currency || "DOP";
      if (!/^[A-Z]{3}$/.test(currency)) rules.fail("Invalid currency");
      [result] = await Record.create(
        [
          {
            ...contextOf(task),
            scheduleId: schedule._id,
            taskId: task._id,
            name: task.name,
            providerId: provider?._id || null,
            providerSnapshot: provider
              ? { name: provider.name, contact: provider.contact }
              : undefined,
            performedAt: base,
            completedAt: now,
            performedBy: auth.account._id,
            cost: money(input.cost),
            currency,
            timezone: task.timezone,
            description: rules.text(input.description || "", 5000),
            notes: rules.text(input.notes || "", 5000),
            nextRecommendedDate: next,
            documentIds: input.documentIds || [],
            evidence,
          },
        ],
        { session }
      );
    }
    task.status = target;
    task.isOpen = false;
    task.completedAt = now;
    await task.save({ session });
    schedule.openTaskId = null;
    schedule.nextRunAt = next;
    schedule.nextActionAt = next
      ? rules.reminderDate(next, schedule.remindBeforeDays, schedule.timezone)
      : null;
    if (!next) schedule.isActive = false;
    schedule.leaseToken = undefined;
    schedule.leaseUntil = undefined;
    schedule.revision += 1;
    await schedule.save({ session });
    await Command.updateMany(
      { taskId: task._id, status: { $in: ["queued", "blocked"] } },
      { $set: { status: "obsolete" } },
      { session }
    );
    await audit(
      auth,
      task,
      `task.${target.toLowerCase()}`,
      { nextRunAt: next },
      session
    );
    if (target !== "COMPLETED") result = task;
  });
  return result;
}
async function status(auth, taskId, target) {
  if (["CANCELLED", "SKIPPED"].includes(target))
    return closeTask(auth, taskId, {}, [], target);
  let result;
  await mongoose.connection.transaction(async (session) => {
    const task = await access.load(ScheduleTask, auth, taskId, session);
    rules.transition(task.status, target);
    const before = task.status;
    task.status = target;
    await task.save({ session });
    await audit(auth, task, "task.status", { before, after: target }, session);
    result = task;
  });
  return result;
}
async function reschedule(auth, taskId, dueDate, now = new Date()) {
  const due = rules.date(dueDate, "dueDate");
  if (due <= now) rules.fail("Rescheduled date must be in the future");
  let result;
  await mongoose.connection.transaction(async (session) => {
    const task = await access.load(ScheduleTask, auth, taskId, session);
    if (!task.isOpen) rules.fail("Task is already closed", 409);
    const schedule = await access.load(
      Schedule,
      auth,
      task.scheduleId,
      session
    );
    const before = task.dueDate;
    task.dueDate = due;
    task.status = "SCHEDULED";
    task.reminderSent = false;
    task.dueSent = false;
    task.overdueSent = false;
    task.notificationVersion += 1;
    await task.save({ session });
    schedule.nextRunAt = due;
    schedule.nextActionAt = rules.reminderDate(
      due,
      schedule.remindBeforeDays,
      schedule.timezone
    );
    schedule.revision += 1;
    schedule.leaseToken = undefined;
    schedule.leaseUntil = undefined;
    await schedule.save({ session });
    await Command.updateMany(
      { taskId, status: { $in: ["queued", "blocked"] } },
      { $set: { status: "obsolete" } },
      { session }
    );
    await audit(
      auth,
      task,
      "task.rescheduled",
      { before, after: due },
      session
    );
    result = task;
  });
  return result;
}
module.exports = {
  audit,
  money,
  catalogScope,
  saveVendor,
  closeTask,
  status,
  reschedule,
};
