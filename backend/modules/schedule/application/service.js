"use strict";
const mongoose = require("mongoose");
const { Schedule, ScheduleTask, Command } = require("../infrastructure/models");
const access = require("./access");
const rules = require("../domain/rules");
const { audit } = require("../../maintenance/service");
function inputFields(input) {
  const frequencyValue = input.frequencyValue;
  if (
    !rules.FREQUENCIES.includes(input.frequencyType) ||
    !Number.isInteger(frequencyValue) ||
    frequencyValue < 1 ||
    frequencyValue > 10000
  )
    rules.fail("Invalid frequency");
  const days = input.remindBeforeDays ?? 7;
  if (!Number.isInteger(days) || days < 0 || days > 365)
    rules.fail("Reminder days must be between 0 and 365");
  return {
    name: rules.text(input.name, 200, true),
    description: rules.text(input.description || "", 5000),
    equipmentName: rules.text(input.equipmentName || "", 200),
    frequencyType: input.frequencyType,
    frequencyValue,
    timezone: rules.timezone(input.timezone),
    remindBeforeDays: days,
  };
}
async function create(auth, input) {
  const context = await access.location(auth, input);
  const fields = inputFields(input);
  const responsible = await access.assignee(auth, input, context);
  const start = rules.date(input.startDate, "startDate");
  let result;
  await mongoose.connection.transaction(async (session) => {
    [result] = await Schedule.create(
      [
        {
          ...context,
          ...fields,
          ...responsible,
          startDate: start,
          nextRunAt: start,
          nextActionAt: rules.reminderDate(
            start,
            fields.remindBeforeDays,
            fields.timezone
          ),
          createdBy: auth.account._id,
        },
      ],
      { session }
    );
    await audit(
      auth,
      result,
      "schedule.created",
      { name: fields.name },
      session
    );
  });
  return result;
}
async function update(auth, id, input) {
  let result;
  await mongoose.connection.transaction(async (session) => {
    const schedule = await access.load(Schedule, auth, id, session);
    const hadDeliveryFailure = Boolean(schedule.notificationError);
    for (const field of [
      "organizationId",
      "ownerId",
      "condominiumId",
      "unitId",
      "residenceId",
      "startDate",
      "nextRunAt",
      "isActive",
    ])
      if (Object.hasOwn(input, field))
        rules.fail(`Use a dedicated action to change ${field}`);
    const fields = inputFields({ ...schedule.toObject(), ...input });
    const resetResponsible =
      Object.hasOwn(input, "assignedUserId") && input.assignedUserId === null;
    const responsible = await access.assignee(
      auth,
      resetResponsible
        ? {}
        : {
            assignedUserId: input.assignedUserId || schedule.assignedUserId,
            assignedRole: input.assignedRole || schedule.assignedRole,
          },
      schedule
    );
    Object.assign(schedule, fields, responsible);
    schedule.notificationError = null;
    schedule.revision += 1;
    const task = schedule.openTaskId
      ? await ScheduleTask.findById(schedule.openTaskId).session(session)
      : null;
    if (task) {
      const changed =
        hadDeliveryFailure ||
        String(task.assignedUserId) !== String(responsible.assignedUserId) ||
        task.assignedRole !== responsible.assignedRole;
      Object.assign(task, responsible, { name: fields.name });
      if (changed) {
        task.notificationVersion += 1;
        task.reminderSent = false;
        task.dueSent = false;
        task.overdueSent = false;
        await Command.updateMany(
          { taskId: task._id, status: { $in: ["queued", "blocked"] } },
          { $set: { status: "obsolete" } },
          { session }
        );
      }
      await task.save({ session });
    }
    schedule.nextActionAt = schedule.nextRunAt
      ? rules.reminderDate(
          schedule.nextRunAt,
          fields.remindBeforeDays,
          fields.timezone
        )
      : null;
    schedule.leaseToken = undefined;
    schedule.leaseUntil = undefined;
    await schedule.save({ session });
    await audit(
      auth,
      schedule,
      "schedule.updated",
      { ...fields, ...responsible },
      session
    );
    result = schedule;
  });
  return result;
}
async function active(auth, id, isActive) {
  let result;
  await mongoose.connection.transaction(async (session) => {
    const schedule = await access.load(Schedule, auth, id, session);
    if (isActive && !schedule.nextRunAt)
      rules.fail("Schedule has no pending occurrence", 409);
    schedule.isActive = isActive;
    schedule.revision += 1;
    schedule.leaseUntil = undefined;
    schedule.leaseToken = undefined;
    if (isActive) {
      const reminder = rules.reminderDate(
        schedule.nextRunAt,
        schedule.remindBeforeDays,
        schedule.timezone
      );
      schedule.nextActionAt = reminder < new Date() ? new Date() : reminder;
    }
    await schedule.save({ session });
    await audit(
      auth,
      schedule,
      isActive ? "schedule.resumed" : "schedule.paused",
      {},
      session
    );
    result = schedule;
  });
  return result;
}
module.exports = { create, update, active, inputFields };
