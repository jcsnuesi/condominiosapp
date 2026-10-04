"use strict";

const mongoose = require("mongoose");
const PaymentTransaction = require("../models/paymentTransaction");
const Owner = require("../models/owners");
const Condominium = require("../models/condominio");

// Aggregations do not apply Mongoose's query casting.
const objectId = (value) => new mongoose.Types.ObjectId(String(value));

function paymentMonitorPipeline(req, filters, page, limit) {
  const invoiceFilter = { organizationId: objectId(req.auth.organizationId) };
  if (filters.ownerId) invoiceFilter.ownerId = filters.ownerId;
  if (filters.invoiceId) invoiceFilter._id = filters.invoiceId;
  if (filters.condominiumId) {
    invoiceFilter.condominiumId = filters.condominiumId;
  } else if (req.auth.scope?.mode !== "ALL") {
    invoiceFilter.condominiumId = {
      $in: (req.auth.scope?.condominiumIds || []).map(objectId),
    };
  }
  if (req.query.unitNumber) invoiceFilter.unitNumber = String(req.query.unitNumber);

  const rowFilter = {};
  for (const key of ["provider", "bankName", "status", "reconciliationStatus", "idempotencyKey", "providerTransactionId"]) {
    if (filters[key]) rowFilter[key] = filters[key];
  }
  if (filters.attemptedAt) rowFilter.activityAt = filters.attemptedAt;

  return [
    { $match: invoiceFilter },
    {
      $lookup: {
        from: PaymentTransaction.collection.name,
        let: { invoice: "$_id", organization: "$organizationId", condominium: "$condominiumId", owner: "$ownerId" },
        pipeline: [{ $match: { $expr: { $and: [
          { $eq: ["$invoiceId", "$$invoice"] },
          { $eq: ["$organizationId", "$$organization"] },
          { $eq: ["$condominiumId", "$$condominium"] },
          { $eq: ["$ownerId", "$$owner"] },
        ] } } }],
        as: "transaction",
      },
    },
    // Preserve invoices without attempts; keep every real attempt for reconciliation.
    { $unwind: { path: "$transaction", preserveNullAndEmptyArrays: true } },
    { $project: {
      _id: { $ifNull: ["$transaction._id", "$_id"] },
      rowType: { $cond: [{ $ifNull: ["$transaction._id", false] }, "transaction", "invoice"] },
      invoiceId: "$_id",
      invoiceNumber: "$invoice_number",
      organizationId: 1,
      condominiumId: 1,
      ownerId: 1,
      invoiceAmount: "$amount",
      invoicePaymentStatus: "$paymentStatus",
      condominiumSnapshot: 1,
      unitNumber: 1,
      issueDate: 1,
      dueDate: 1,
      amount: { $ifNull: ["$transaction.amount", "$amount"] },
      currency: { $ifNull: ["$transaction.currency", { $ifNull: ["$currency", "DOP"] }] },
      status: { $ifNull: ["$transaction.status", {
        $switch: {
          branches: [
            { case: { $eq: ["$paymentStatus", "completed"] }, then: "succeeded" },
            { case: { $eq: ["$paymentStatus", "failed"] }, then: "failed" },
          ],
          default: "pending",
        },
      }] },
      provider: { $ifNull: ["$transaction.provider", null] },
      bankName: { $ifNull: ["$transaction.bankName", null] },
      reconciliationStatus: { $ifNull: ["$transaction.reconciliationStatus", "not_started"] },
      providerTransactionId: { $ifNull: ["$transaction.providerTransactionId", null] },
      idempotencyKey: "$transaction.idempotencyKey",
      attemptedAt: { $ifNull: ["$transaction.attemptedAt", null] },
      confirmedAt: { $ifNull: ["$transaction.confirmedAt", null] },
      activityAt: { $ifNull: ["$transaction.attemptedAt", "$issueDate"] },
    } },
    // Apply payment filters after the join so a filtered-out attempt cannot turn
    // into a fictitious unpaid invoice.
    { $match: rowFilter },
    { $facet: {
      docs: [
        { $sort: { activityAt: -1, _id: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $lookup: {
          from: Owner.collection.name,
          let: { owner: "$ownerId", organization: "$organizationId" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ["$_id", "$$owner"] },
              { $eq: ["$organizationId", "$$organization"] },
            ] } } },
            { $project: { _id: 0, name: 1, lastname: 1, phone: 1, email: 1 } },
          ],
          as: "owner",
        } },
        { $lookup: {
          from: Condominium.collection.name,
          let: { condominium: "$condominiumId", organization: "$organizationId" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ["$_id", "$$condominium"] },
              { $eq: ["$organizationId", "$$organization"] },
            ] } } },
            { $project: { _id: 0, alias: 1 } },
          ],
          as: "condominium",
        } },
        { $set: {
          ownerName: { $trim: { input: { $concat: [
            { $ifNull: [{ $arrayElemAt: ["$owner.name", 0] }, ""] },
            " ",
            { $ifNull: [{ $arrayElemAt: ["$owner.lastname", 0] }, ""] },
          ] } } },
          ownerPhone: { $ifNull: [{ $arrayElemAt: ["$owner.phone", 0] }, ""] },
          ownerEmail: { $ifNull: [{ $arrayElemAt: ["$owner.email", 0] }, ""] },
          condominiumAlias: { $ifNull: [{ $arrayElemAt: ["$condominium.alias", 0] }, "$condominiumSnapshot.alias"] },
        } },
        { $unset: ["activityAt", "idempotencyKey", "owner", "condominium", "condominiumSnapshot"] },
      ],
      count: [{ $count: "total" }],
    } },
  ];
}

module.exports = { paymentMonitorPipeline };
