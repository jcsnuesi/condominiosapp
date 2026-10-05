"use strict";
const mongoose = require("mongoose");
const { FREQUENCIES, OPEN, CLOSED, ownership } = require("../domain/rules");
const { Schema } = mongoose; const id = Schema.Types.ObjectId;
const context = { organizationId: { type: id, default: null }, ownerId: { type: id, default: null }, condominiumId: { type: id, default: null }, residenceId: { type: id, default: null }, unitId: { type: id, default: null } };
function model(name, fields, indexes = [], immutable = false) {
  const schema = new Schema({ ...context, ...fields }, { timestamps: true });
  schema.pre("validate", function () { if (!ownership(this)) this.invalidate("organizationId", "Exactly one organizationId or ownerId is required"); });
  schema.index({ organizationId: 1, condominiumId: 1, createdAt: -1 });
  schema.index({ ownerId: 1, residenceId: 1, createdAt: -1 });
  for (const [keys, options] of indexes) schema.index(keys, options || {});
  if (immutable) for (const method of ["updateOne", "updateMany", "findOneAndUpdate", "deleteOne", "deleteMany", "findOneAndDelete"]) schema.pre(method, function () { throw new Error("Immutable maintenance history"); });
  return mongoose.models[name] || mongoose.model(name, schema);
}
const Schedule = model("Schedule", {
  name: { type: String, required: true, maxlength: 200 }, description: { type: String, maxlength: 5000, default: "" }, equipmentName: { type: String, maxlength: 200, default: "" },
  frequencyType: { type: String, enum: FREQUENCIES, required: true }, frequencyValue: { type: Number, min: 1, max: 10000, required: true },
  startDate: { type: Date, required: true }, nextRunAt: Date, timezone: { type: String, required: true }, remindBeforeDays: { type: Number, min: 0, max: 365, default: 7 },
  assignedUserId: { type: id, required: true }, assignedRole: { type: String, required: true }, createdBy: { type: id, required: true },
  isActive: { type: Boolean, default: true }, openTaskId: { type: id, default: null }, nextActionAt: Date,
  leaseToken: String, leaseUntil: Date, revision: { type: Number, default: 0 }, notificationError: { type: String, default: null },
}, [[{ isActive: 1, nextActionAt: 1, leaseUntil: 1 }]]);
const ScheduleTask = model("ScheduleTask", {
  scheduleId: { type: id, required: true }, runKey: { type: String, required: true }, name: { type: String, required: true },
  dueDate: { type: Date, required: true }, originalDueDate: { type: Date, required: true },
  timezone: { type: String, default: "America/Santo_Domingo" },
  status: { type: String, enum: [...OPEN, ...CLOSED], required: true }, isOpen: { type: Boolean, default: true },
  assignedUserId: { type: id, required: true }, assignedRole: { type: String, required: true }, completedAt: Date,
  reminderSent: { type: Boolean, default: false }, dueSent: { type: Boolean, default: false }, overdueSent: { type: Boolean, default: false }, notificationVersion: { type: Number, default: 0 },
}, [[{ runKey: 1 }, { unique: true }], [{ scheduleId: 1 }, { unique: true, partialFilterExpression: { isOpen: true } }], [{ organizationId: 1, status: 1, dueDate: 1 }], [{ ownerId: 1, status: 1, dueDate: 1 }]]);
const ScheduleRun = model("ScheduleRun", { scheduleId: { type: id, required: true }, taskId: id, runKey: { type: String, required: true }, startedAt: Date, finishedAt: Date, result: String, error: String, attempts: { type: Number, default: 0 } }, [[{ runKey: 1 }, { unique: true }]]);
const Vendor = model("MaintenanceVendor", { name: { type: String, required: true, maxlength: 200 }, contact: { type: String, maxlength: 300, default: "" }, notes: { type: String, maxlength: 2000, default: "" }, isActive: { type: Boolean, default: true } });
const evidence = new Schema({ filename: String, storedFilename: String, mimetype: String, size: Number }, { _id: true });
const Record = model("MaintenanceRecord", {
  scheduleId: { type: id, required: true }, taskId: { type: id, required: true }, name: String, providerId: id,
  providerSnapshot: { name: String, contact: String }, performedAt: { type: Date, required: true }, completedAt: { type: Date, required: true },
  timezone: { type: String, default: "America/Santo_Domingo" },
  cost: { type: Schema.Types.Decimal128, required: true }, currency: { type: String, match: /^[A-Z]{3}$/, default: "DOP" },
  description: { type: String, maxlength: 5000 }, notes: { type: String, maxlength: 5000 }, performedBy: { type: id, required: true },
  nextRecommendedDate: Date, documentIds: [id], evidence: [evidence],
}, [[{ taskId: 1 }, { unique: true }], [{ organizationId: 1, performedAt: -1 }], [{ ownerId: 1, performedAt: -1 }]], true);
const Audit = model("ScheduleAudit", { actorId: id, action: { type: String, required: true }, targetId: { type: id, required: true }, changes: Schema.Types.Mixed }, [], true);
const Command = model("ScheduleNotificationCommand", {
  key: { type: String, required: true }, taskId: { type: id, required: true }, scheduleId: { type: id, required: true },
  recipientId: { type: id, required: true }, recipientRole: { type: String, required: true }, kind: { type: String, enum: ["reminder", "due", "overdue"], required: true },
  status: { type: String, enum: ["queued", "delivered", "blocked", "obsolete"], default: "queued" }, attempts: { type: Number, default: 0 }, nextAttemptAt: Date,
  leaseToken: String, leaseUntil: Date, error: String,
}, [[{ key: 1 }, { unique: true }], [{ status: 1, nextAttemptAt: 1, leaseUntil: 1 }]]);
const Notice = model("ScheduleNotice", {
  key: { type: String, required: true }, taskId: { type: id, required: true }, scheduleId: { type: id, required: true }, recipientId: { type: id, required: true }, recipientRole: String,
  title: String, content: String, type: { type: String, default: "maintenance" }, priority: { type: String, default: "medium" }, publishedAt: Date, readAt: Date,
}, [[{ key: 1 }, { unique: true }], [{ recipientId: 1, publishedAt: -1 }]]);
function contextOf(resource) { return Object.fromEntries(Object.keys(context).map(key => [key, resource[key] || null])); }
module.exports = { Schedule, ScheduleTask, ScheduleRun, Vendor, Record, Audit, Command, Notice, contextOf };
