"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ============ INQUIRY RESPONSE SCHEMA ============
const InquiryResponseSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "respondedByModel",
    },
    respondedByModel: {
      type: String,
      required: true,
      enum: ["User", "Owner"],
    },
    respondedByName: {
      type: String,
      required: true,
    },
    respondedByRole: {
      type: String,
      required: true,
      enum: ["ADMIN", "OWNER", "STAFF"],
    },
    isAdminResponse: {
      type: Boolean,
      default: function () {
        return ["ADMIN", "STAFF_ADMIN"].includes(this.respondedByRole);
      },
    },
  },
  {
    timestamps: true,
  }
);

// ============ MAIN INQUIRY SCHEMA ============
const InquirySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "maintenance",
        "payment",
        "noise",
        "security",
        "common-areas",
        "parking",
        "other",
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    condominiumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    responses: [InquiryResponseSchema],
    attachments: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============ NOTICE SCHEMA ============

// ============ NOTICE READ STATUS SCHEMA ============
const NoticeReadStatusSchema = new Schema(
  {
    noticeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notice",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ============ INDEXES ============
InquirySchema.index({ ownerId: 1, condominiumId: 1 });
InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ category: 1, priority: 1 });

NoticeSchema.index({ condominiumId: 1, isActive: 1 });
NoticeSchema.index({ publishedAt: -1, expiresAt: 1 });
NoticeSchema.index({ type: 1, priority: 1 });

NoticeReadStatusSchema.index({ ownerId: 1, noticeId: 1 }, { unique: true });

// ============ VIRTUALS ============
InquirySchema.virtual("responseCount").get(function () {
  return this.responses ? this.responses.length : 0;
});

InquirySchema.virtual("hasUnreadAdminResponses").get(function () {
  if (!this.responses || this.responses.length === 0) return false;

  const ownerResponses = this.responses.filter((r) => !r.isAdminResponse);
  const adminResponses = this.responses.filter((r) => r.isAdminResponse);

  if (adminResponses.length === 0) return false;
  if (ownerResponses.length === 0) return true;

  const lastOwnerResponse = ownerResponses[ownerResponses.length - 1];
  const lastAdminResponse = adminResponses[adminResponses.length - 1];

  return lastAdminResponse.createdAt > lastOwnerResponse.createdAt;
});

// ============ MIDDLEWARE ============

// Update status timestamps
InquirySchema.pre("save", function (next) {
  if (this.isModified("status")) {
    const now = new Date();

    if (this.status === "resolved" && !this.resolvedAt) {
      this.resolvedAt = now;
    } else if (this.status === "closed" && !this.closedAt) {
      this.closedAt = now;
    }
  }
  next();
});

// ============ METHODS ============
InquirySchema.methods.addResponse = function (responseData) {
  this.responses.push(responseData);
  return this.save();
};

InquirySchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;
  return this.save();
};

NoticeSchema.methods.markAsRead = async function (ownerId) {
  const NoticeReadStatus = mongoose.model("NoticeReadStatus");

  return await NoticeReadStatus.findOneAndUpdate(
    { noticeId: this._id, ownerId: ownerId },
    { noticeId: this._id, ownerId: ownerId, readAt: new Date() },
    { upsert: true, new: true }
  );
};

// ============ STATICS ============
InquirySchema.statics.getStatistics = function (condominiumId) {
  return this.aggregate([
    { $match: { condominiumId: mongoose.Types.ObjectId(condominiumId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        open: { $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] } },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
        },
        resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
      },
    },
  ]);
};

NoticeSchema.statics.getActiveNotices = function (
  condominiumId,
  targetAudience = "all"
) {
  return this.find({
    condominiumId: condominiumId,
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
    $or: [{ targetAudience: "all" }, { targetAudience: targetAudience }],
  }).sort({ publishedAt: -1 });
};

// ============ MODEL EXPORTS ============
const Inquiry = mongoose.model("Inquiry", InquirySchema);
const Notice = mongoose.model("Notice", NoticeSchema);
const NoticeReadStatus = mongoose.model(
  "NoticeReadStatus",
  NoticeReadStatusSchema
);

module.exports = {
  Inquiry,
  Notice,
  NoticeReadStatus,
};
