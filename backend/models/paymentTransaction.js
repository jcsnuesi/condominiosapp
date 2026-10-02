"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentTransactionSchema = Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    condominiumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Condominium",
      required: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 80,
    },
    bankName: { type: String, trim: true, maxlength: 120 },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "DOP",
      uppercase: true,
      trim: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
    },
    providerTransactionId: {
      type: String,
      trim: true,
      maxlength: 128,
    },
    providerReference: {
      type: String,
      trim: true,
      maxlength: 128,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "processing", "succeeded", "failed", "cancelled"],
    },
    reconciliationStatus: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "matched", "mismatched", "manual_review"],
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    failureCode: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    failureMessage: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

PaymentTransactionSchema.index(
  { provider: 1, idempotencyKey: 1 },
  { unique: true, name: "payment_tx_provider_idempotency_unique" }
);
PaymentTransactionSchema.index({ organizationId: 1, condominiumId: 1, attemptedAt: -1 });
PaymentTransactionSchema.index(
  { condominiumId: 1, status: 1, attemptedAt: -1 },
  { name: "payment_tx_condo_status_lookup" }
);
PaymentTransactionSchema.index(
  { invoiceId: 1, status: 1 },
  { name: "payment_tx_invoice_status_lookup" }
);
PaymentTransactionSchema.index(
  { provider: 1, providerTransactionId: 1 },
  {
    name: "payment_tx_provider_transaction_lookup",
    partialFilterExpression: {
      providerTransactionId: { $exists: true, $type: "string" },
    },
  }
);

module.exports = mongoose.model("PaymentTransaction", PaymentTransactionSchema);
