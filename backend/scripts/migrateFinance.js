"use strict";
// Default: read-only review. --apply adds verified metadata and replaces only the obsolete invoice index.
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const { TransferReceipt, OwnerCredit } = require("../models/bankReconciliation");
const { isVerifiedMonthly, monthlySourceKey } = require("../service/financeRules");

async function review() {
  const updates = [], monthly = new Map(), collisions = [], creditUpdates = [], unresolvedCredits = [];
  for await (const invoice of Invoice.find().lean().cursor()) {
    const set = {};
    if (isVerifiedMonthly(invoice) && invoice.unitNumber && invoice.issueDate) {
      const period = new Date(invoice.issueDate).toISOString().slice(0, 7);
      const sourceKey = monthlySourceKey(invoice.unitNumber, period);
      const key = `${invoice.organizationId}:${invoice.condominiumId}:${sourceKey}`;
      if (monthly.has(key)) collisions.push({ invoiceIds: [monthly.get(key), String(invoice._id)], unitNumber: invoice.unitNumber, period });
      else monthly.set(key, String(invoice._id));
      if (invoice.chargeType !== "monthly") set.chargeType = "monthly";
      if (!invoice.period) set.period = period;
      if (!invoice.sourceKey) set.sourceKey = sourceKey;
    } else if (!invoice.chargeType) set.chargeType = "legacy";
    if (Object.keys(set).length) updates.push({ updateOne: { filter: { _id: invoice._id }, update: { $set: set } } });
  }
  for await (const credit of OwnerCredit.find({ unitNumber: { $exists: false } }).lean().cursor()) {
    const receipt = await TransferReceipt.findOne({ _id: credit.receiptId, organizationId: credit.organizationId, condominiumId: credit.condominiumId, ownerId: credit.ownerId }).select("invoiceId").lean();
    const invoice = receipt && await Invoice.findOne({ _id: receipt.invoiceId, organizationId: credit.organizationId, condominiumId: credit.condominiumId, ownerId: credit.ownerId }).select("unitNumber unitId").lean();
    if (!invoice?.unitNumber) { unresolvedCredits.push(String(credit._id)); continue; }
    creditUpdates.push({ updateOne: { filter: { _id: credit._id, unitNumber: { $exists: false } }, update: { $set: { invoiceId: invoice._id, unitNumber: invoice.unitNumber, ...(invoice.unitId ? { unitId: invoice.unitId } : {}) } } } });
  }
  return { updates, creditUpdates, collisions, unresolvedCredits };
}
async function apply(result) {
  if (result.collisions.length) throw new Error("Monthly duplicates need manual review; no changes applied");
  // New unique source index is installed before any source metadata is populated.
  await Invoice.createIndexes();
  if (result.updates.length) await Invoice.bulkWrite(result.updates, { ordered: true });
  if (result.creditUpdates.length) await OwnerCredit.bulkWrite(result.creditUpdates, { ordered: true });
  const indexes = await Invoice.collection.indexes();
  if (indexes.some(index => index.name === "unique_monthly_unit_invoice")) await Invoice.collection.dropIndex("unique_monthly_unit_invoice");
}
async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: false, serverSelectionTimeoutMS: 10000 });
  try {
    const result = await review();
    console.log(JSON.stringify({ mode: process.argv.includes("--apply") ? "apply" : "review", invoicesToUpdate: result.updates.length, creditsToUpdate: result.creditUpdates.length, collisions: result.collisions, unresolvedCredits: result.unresolvedCredits }, null, 2));
    if (process.argv.includes("--apply")) { await apply(result); console.log("Finance migration completed"); }
  } finally { await mongoose.disconnect(); }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { review, apply };
