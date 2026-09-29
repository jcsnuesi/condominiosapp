"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunicationLogSchema = Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    channel: {
      type: String,
      required: true,
      enum: ["whatsapp", "email", "push", "sms"],
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["payment_reminder", "payment_confirmation", "access", "general"],
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["sent", "skipped", "failed"],
      index: true,
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      index: true,
    },
    condominiumId: {
      type: Schema.Types.ObjectId,
      ref: "Condominium",
      index: true,
    },
    recipientPhone: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    providerMessageId: {
      type: String,
      trim: true,
      maxlength: 128,
    },
    message: {
      type: String,
      maxlength: 5000,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

CommunicationLogSchema.index(
  { invoiceId: 1, channel: 1, type: 1, sentAt: -1 },
  { name: "communication_invoice_channel_type_lookup" }
);
CommunicationLogSchema.index({ organizationId: 1, condominiumId: 1, sentAt: -1 });
CommunicationLogSchema.index(
  { condominiumId: 1, channel: 1, type: 1, sentAt: -1 },
  { name: "communication_condo_channel_type_lookup" }
);

module.exports = mongoose.model("CommunicationLog", CommunicationLogSchema);
