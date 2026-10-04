"use strict";
const { problem, moneyMinor, dateOnly, bounded } = require("./bankReconciliationRules");
const { remainingInvoiceBalance } = require("./invoiceBalance");

function unitKey(value) {
  const unit = bounded(value, 80).normalize("NFKC").toLowerCase();
  if (!unit) throw problem("Seleccione una unidad");
  return unit;
}
function operationKey(value) {
  const key = bounded(value, 128);
  if (!/^[A-Za-z0-9:_-]{8,128}$/.test(key)) throw problem("Indique una clave de operación válida");
  return key;
}
function signedMinor(value) {
  const text = String(value ?? "").trim();
  if (text === "0" || /^0\.0{1,2}$/.test(text)) return 0;
  return text.startsWith("-") ? -moneyMinor(text.slice(1)) : moneyMinor(text);
}
function periodOf(value) {
  return dateOnly(value).slice(0, 7);
}
function monthlySourceKey(unit, period) { return `monthly:${unitKey(unit)}:${period}`; }
function isVerifiedMonthly(invoice) {
  return invoice.chargeType === "monthly" || (!invoice.chargeType && /^Monthly maintenance fee(?: - Unit .+)? - [A-Za-z]+ \d{4}$/.test(invoice.description || ""));
}
function balanceMinor(invoice) { return Math.round(remainingInvoiceBalance(invoice) * 100); }
function refreshInvoice(invoice, now = new Date()) {
  // Preserve inferred cash on old completed invoices before changing their status.
  if (invoice.paidAmount == null && invoice.paymentStatus === "completed") invoice.paidAmount = Number(invoice.amount);
  const debt = Math.round(Number(invoice.amount) * 100) - Math.round(Number(invoice.paidAmount || 0) * 100) - Math.round(Number(invoice.adjustmentAmount || 0) * 100) - Math.round(Number(invoice.creditAppliedAmount || 0) * 100);
  if (!Number.isSafeInteger(debt) || debt < 0) throw problem("La operación excede el saldo disponible", 409);
  invoice.balancePending = debt / 100;
  invoice.paymentStatus = debt === 0 ? "completed" : "pending";
  invoice.status = debt === 0 ? "completed" : invoice.dueDate && invoice.dueDate < now ? "overdue" : "active";
  invoice.invoice_paid_date = debt === 0 ? now : null;
  return invoice;
}
function agingBucket(invoice, asOf) {
  const due = invoice.dueDate ? new Date(invoice.dueDate).toISOString().slice(0, 10) : null;
  const days = due ? Math.floor((Date.parse(asOf) - Date.parse(due)) / 86400000) : 0;
  return days <= 0 ? "current" : days <= 30 ? "1-30" : days <= 60 ? "31-60" : days <= 90 ? "61-90" : "90+";
}
function lateFeeMinor(invoice, policy, today) {
  if (!policy?.enabled || !policy.effectiveFrom || ["late_fee", "legacy"].includes(invoice.chargeType) || !invoice.dueDate || balanceMinor(invoice) <= 0) return 0;
  const due = new Date(invoice.dueDate).toISOString().slice(0, 10);
  if (due < policy.effectiveFrom || today <= due) return 0;
  const days = Math.floor((Date.parse(today) - Date.parse(due)) / 86400000);
  if (days <= policy.graceDays) return 0;
  const result = policy.mode === "percent" ? Math.round(balanceMinor(invoice) * policy.value / 100) : Math.round(policy.value * 100);
  if (!Number.isSafeInteger(result) || result < 0) throw problem("Política de mora inválida");
  return result;
}
function budgetVariance(plannedMinor, actualMinor) {
  return { plannedMinor, actualMinor, varianceMinor: actualMinor - plannedMinor, variancePercent: plannedMinor ? Math.round((actualMinor - plannedMinor) / plannedMinor * 10000) / 100 : null };
}
function csv(rows) {
  return "\uFEFF" + rows.map(row => row.map(value => {
    let text = String(value ?? "");
    if (typeof value === "string" && /^[\s]*[=+\-@]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }).join(",")).join("\r\n");
}
module.exports = { unitKey, operationKey, signedMinor, periodOf, monthlySourceKey, isVerifiedMonthly, balanceMinor, refreshInvoice, agingBucket, lateFeeMinor, budgetVariance, csv };
