"use strict";
const { Schema, model } = require("mongoose");
const ticket = new Schema({ subjectType: { type: String, enum: ["ORGANIZATION", "PERSONAL_OWNER"], required: true }, subjectId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true, maxlength: 150 }, description: { type: String, required: true, maxlength: 2000 },
  state: { type: String, enum: ["OPEN", "IN_PROGRESS", "RESOLVED"], default: "OPEN" }, assigneeId: { type: Schema.Types.ObjectId, ref: "PlatformUser", default: null }, createdBy: { type: Schema.Types.ObjectId, required: true } }, { timestamps: true });
ticket.index({ subjectType: 1, subjectId: 1, createdAt: -1 });
const notice = new Schema({ title: { type: String, required: true, maxlength: 150 }, body: { type: String, required: true, maxlength: 2000 },
  audience: { type: Schema.Types.Mixed, required: true }, cutoff: { type: Date, required: true }, expiresAt: { type: Date, required: true },
  state: { type: String, enum: ["QUEUED", "PUBLISHED", "ERROR"], default: "QUEUED" }, createdBy: { type: Schema.Types.ObjectId, required: true }, recipientCount: { type: Number, default: 0 } }, { timestamps: true });
const delivery = new Schema({ noticeId: { type: Schema.Types.ObjectId, ref: "PlatformNotice", required: true }, subjectType: { type: String, required: true }, subjectId: { type: Schema.Types.ObjectId, required: true } }, { timestamps: true });
delivery.index({ noticeId: 1, subjectType: 1, subjectId: 1 }, { unique: true });
delivery.index({ subjectType: 1, subjectId: 1, createdAt: -1 });
const config = new Schema({ key: { type: String, unique: true, default: "global" }, retentionDays: { type: Number, min: 7, max: 3650, default: 90 }, supportEmail: { type: String, default: "", maxlength: 254 }, maintenanceMessage: { type: String, default: "", maxlength: 2000 } }, { timestamps: true });
const lifecycle = new Schema({ organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true }, state: { type: String, enum: ["REQUESTED", "CLOSED", "CANCELLED", "DELETION_REQUESTED", "DELETED"], default: "REQUESTED" }, reason: { type: String, required: true, maxlength: 500 }, requestedBy: { type: Schema.Types.ObjectId, required: true }, reviewedBy: { type: Schema.Types.ObjectId, default: null }, eligibleAfter: Date }, { timestamps: true });
const exportJob = new Schema({ organizationId: { type: Schema.Types.ObjectId, required: true }, createdBy: { type: Schema.Types.ObjectId, required: true }, state: { type: String, enum: ["QUEUED", "RUNNING", "READY", "FAILED", "EXPIRED"], default: "QUEUED" }, expiresAt: { type: Date, required: true }, recordCount: { type: Number, default: 0 } }, { timestamps: true });
lifecycle.index({ organizationId: 1 }, { unique: true, partialFilterExpression: { state: { $in: ["REQUESTED", "CLOSED", "DELETION_REQUESTED"] } } });
module.exports = { Ticket: model("PlatformTicket", ticket), Notice: model("PlatformNotice", notice), Delivery: model("PlatformNoticeDelivery", delivery), Config: model("PlatformConfiguration", config), Lifecycle: model("PlatformLifecycle", lifecycle), Export: model("PlatformExport", exportJob) };
