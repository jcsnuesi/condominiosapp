"use strict";

// Legacy completed invoices predate paidAmount; they still have no debt.
function remainingInvoiceBalance(invoice) {
  if (invoice?.paymentStatus === "completed") return 0;
  const total = Math.round(Number(invoice?.amount || 0) * 100);
  const paid = Math.round(Number(invoice?.paidAmount || 0) * 100);
  if (!Number.isSafeInteger(total) || !Number.isSafeInteger(paid)) return 0;
  const adjustments = Math.round(Number(invoice?.adjustmentAmount || 0) * 100);
  const credits = Math.round(Number(invoice?.creditAppliedAmount || 0) * 100);
  if (!Number.isSafeInteger(adjustments) || !Number.isSafeInteger(credits)) return 0;
  return Math.max(0, total - Math.max(0, paid) - Math.max(0, adjustments) - Math.max(0, credits)) / 100;
}

function remainingBalanceExpression() {
  return {
    $cond: [
      { $eq: ["$paymentStatus", "completed"] },
      0,
      { $max: [0, { $round: [{ $subtract: ["$amount", { $add: [{ $ifNull: ["$paidAmount", 0] }, { $ifNull: ["$adjustmentAmount", 0] }, { $ifNull: ["$creditAppliedAmount", 0] }] }] }, 2] }] },
    ],
  };
}

module.exports = { remainingInvoiceBalance, remainingBalanceExpression };
