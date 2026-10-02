"use strict";

// Legacy completed invoices predate paidAmount; they still have no debt.
function remainingInvoiceBalance(invoice) {
  if (invoice?.paymentStatus === "completed") return 0;
  const total = Math.round(Number(invoice?.amount || 0) * 100);
  const paid = Math.round(Number(invoice?.paidAmount || 0) * 100);
  if (!Number.isSafeInteger(total) || !Number.isSafeInteger(paid)) return 0;
  return Math.max(0, total - Math.max(0, paid)) / 100;
}

function remainingBalanceExpression() {
  return {
    $cond: [
      { $eq: ["$paymentStatus", "completed"] },
      0,
      { $max: [0, { $round: [{ $subtract: ["$amount", { $ifNull: ["$paidAmount", 0] }] }, 2] }] },
    ],
  };
}

module.exports = { remainingInvoiceBalance, remainingBalanceExpression };
