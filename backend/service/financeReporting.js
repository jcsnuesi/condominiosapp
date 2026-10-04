"use strict";
const Invoice = require("../models/invoice");
const PaymentTransaction = require("../models/paymentTransaction");
const { BankAccount, BankMovement, OwnerCredit } = require("../models/bankReconciliation");
const { FinanceApplication, FinanceEntry, FinanceBudget } = require("../models/finance");
const { balanceMinor, agingBucket, budgetVariance, unitKey } = require("./financeRules");

function utcDate(value) { return new Date(value).toISOString().slice(0, 10); }
function localDate(value) { return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Santo_Domingo" }).format(new Date(value)); }
function inRange(date, from, to) { return date >= from && date <= to; }
function categoryKey(kind, category, month) { return JSON.stringify([kind, category, month]); }

async function receivables(query, today) {
  const invoices = await Invoice.find(query).sort({ dueDate: 1, _id: 1 }).lean();
  const totals = new Map();
  const docs = invoices.filter(invoice => balanceMinor(invoice) > 0).map(invoice => {
    const pendingMinor = balanceMinor(invoice), bucket = agingBucket(invoice, today), currency = invoice.currency || "DOP";
    if (!totals.has(currency)) totals.set(currency, { currency, amountMinor: 0, buckets: { current: 0, "1-30": 0, "31-60": 0, "61-90": 0, "90+": 0 } });
    const total = totals.get(currency); total.amountMinor += pendingMinor; total.buckets[bucket] += pendingMinor;
    return { ...invoice, balancePending: pendingMinor / 100, pendingMinor, bucket };
  });
  return { docs, totals: [...totals.values()] };
}

async function cashReport(query, from, to, currency) {
  const filtered = { ...query, currency };
  const [payments, entries, budget] = await Promise.all([
    PaymentTransaction.find({ ...filtered, status: "succeeded", confirmedAt: { $gte: new Date(from + "T00:00:00-04:00"), $lt: new Date(Date.parse(to + "T00:00:00-04:00") + 86400000) } }).sort({ confirmedAt: 1, _id: 1 }).lean(),
    FinanceEntry.find({ ...filtered, date: { $gte: from, $lte: to } }).sort({ date: 1, _id: 1 }).lean(),
    FinanceBudget.findOne({ ...filtered, year: Number(from.slice(0, 4)) }).lean(),
  ]);
  const rows = payments.map(payment => ({ id: String(payment._id), source: "payment", date: localDate(payment.confirmedAt), kind: "income", category: "Cobros de cuotas", amountMinor: Math.round(payment.amount * 100), currency, invoiceId: payment.invoiceId, bankAccountId: null, reference: payment.providerReference || payment.providerTransactionId || "" }));
  for (const entry of entries) rows.push({ id: String(entry._id), source: "entry", date: entry.date, kind: entry.kind, category: entry.category, amountMinor: entry.amountMinor * (entry.reversalOf ? -1 : 1), currency, bankAccountId: entry.bankAccountId, reference: entry.reference || "", reason: entry.reason });
  rows.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const incomeMinor = rows.filter(row => row.kind === "income").reduce((sum, row) => sum + row.amountMinor, 0);
  const expenseMinor = rows.filter(row => row.kind === "expense").reduce((sum, row) => sum + row.amountMinor, 0);
  const groups = new Map();
  for (const row of rows.filter(row => row.kind !== "transfer")) {
    const month = Number(row.date.slice(5, 7)), key = categoryKey(row.kind, row.category, month);
    if (!groups.has(key)) groups.set(key, { month, kind: row.kind, category: row.category, plannedMinor: 0, actualMinor: 0 });
    groups.get(key).actualMinor += row.amountMinor;
  }
  for (const line of budget?.lines || []) {
    const monthStart = `${budget.year}-${String(line.month).padStart(2, "0")}-01`;
    const monthEnd = utcDate(new Date(Date.UTC(budget.year, line.month, 0)));
    if (monthStart < from || monthEnd > to) continue; // Full-month budget is never prorated implicitly.
    const key = categoryKey(line.kind, line.category, line.month);
    if (!groups.has(key)) groups.set(key, { month: line.month, kind: line.kind, category: line.category, plannedMinor: 0, actualMinor: 0 });
    groups.get(key).plannedMinor += line.amountMinor;
  }
  const undatedSuccessfulPayments = await PaymentTransaction.countDocuments({ ...filtered, status: "succeeded", confirmedAt: null });
  const legacyPaidWithoutTransactions = await Invoice.aggregate([
    { $match: Invoice.find({ ...filtered, paymentStatus: "completed", paidAmount: { $exists: false } }).cast(Invoice) },
    { $lookup: { from: PaymentTransaction.collection.name, localField: "_id", foreignField: "invoiceId", as: "payments" } },
    { $match: { payments: { $size: 0 } } }, { $count: "count" },
  ]);
  return { currency, from, to, rows, incomeMinor, expenseMinor, netMinor: incomeMinor - expenseMinor, budget: [...groups.values()].map(group => ({ ...group, ...budgetVariance(group.plannedMinor, group.actualMinor) })), warnings: { undatedSuccessfulPayments, legacyPaidWithoutTransactions: legacyPaidWithoutTransactions[0]?.count || 0 } };
}

async function bankSummary(query, to) {
  const accounts = await BankAccount.find(query).lean();
  return Promise.all(accounts.map(async account => {
    const [movements, entries] = await Promise.all([
      BankMovement.find({ ...query, bankAccountId: account._id, date: { $lte: to } }).lean(),
      FinanceEntry.find({ ...query, $or: [{ bankAccountId: account._id }, { destinationAccountId: account._id }], date: { $lte: to } }).lean(),
    ]);
    let delta = 0;
    if (account.openingDate && account.openingDate <= to) {
      for (const movement of movements) if (movement.date >= account.openingDate) delta += movement.amountMinor * (movement.direction === "credit" ? 1 : -1);
      for (const entry of entries) {
        if (entry.date < account.openingDate) continue;
        const destination = String(entry.destinationAccountId) === String(account._id);
        if (destination ? entry.destinationMovementId : entry.movementId) continue;
        const sign = entry.kind === "expense" || (entry.kind === "transfer" && !destination) ? -1 : 1;
        delta += entry.amountMinor * sign * (entry.reversalOf ? -1 : 1);
      }
    }
    return { ...account, calculatedBalanceMinor: account.openingDate && account.openingDate <= to ? account.openingBalanceMinor + delta : null, unclassifiedCount: movements.filter(movement => !movement.allocatedReceiptId && !movement.financeEntryId).length, receiptMatchedCount: movements.filter(movement => movement.allocatedReceiptId).length, classifiedCount: movements.filter(movement => movement.financeEntryId).length };
  }));
}

async function unitHistory(query, { from, to, page, limit, unitNumber, currency }) {
  const escapedUnit = unitNumber.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const invoices = await Invoice.find({ ...query, ...(currency === "DOP" ? { $or: [{ currency }, { currency: { $exists: false } }] } : { currency }), unitNumber: { $regex: `^${escapedUnit}$`, $options: "i" } }).lean();
  const selected = invoices.filter(invoice => invoice.unitNumber && unitKey(invoice.unitNumber) === unitKey(unitNumber));
  const ids = selected.map(invoice => invoice._id);
  const [payments, applications, credits] = await Promise.all([
    PaymentTransaction.find({ organizationId: query.organizationId, invoiceId: { $in: ids }, currency, status: "succeeded" }).lean(),
    FinanceApplication.find({ organizationId: query.organizationId, invoiceId: { $in: ids }, currency }).lean(),
    OwnerCredit.find({ ...query, currency }).lean(),
  ]);
  const events = [];
  const cashByInvoice = new Map();
  for (const invoice of selected) events.push({ id: `invoice:${invoice._id}`, date: utcDate(invoice.issueDate), kind: "charge", invoiceId: invoice._id, invoiceNumber: invoice.invoice_number, description: invoice.description || invoice.chargeType || "Cargo", debitMinor: Math.round(invoice.amount * 100), creditMinor: 0 });
  for (const payment of payments) {
    const applied = payment.metadata?.allocation?.appliedAmount ?? payment.amount;
    cashByInvoice.set(String(payment.invoiceId), (cashByInvoice.get(String(payment.invoiceId)) || 0) + Math.round(applied * 100));
    if (!payment.confirmedAt) continue;
    events.push({ id: `payment:${payment._id}`, date: localDate(payment.confirmedAt), at: new Date(payment.confirmedAt).getTime(), kind: "payment", invoiceId: payment.invoiceId, description: "Pago aplicado", debitMinor: 0, creditMinor: Math.round(applied * 100) });
  }
  for (const invoice of selected) {
    const inferredPaid = invoice.paidAmount ?? (invoice.paymentStatus === "completed" ? invoice.amount : 0);
    const unrepresented = Math.round(inferredPaid * 100) - (cashByInvoice.get(String(invoice._id)) || 0);
    if (unrepresented > 0 && invoice.invoice_paid_date) events.push({ id: `legacy:${invoice._id}`, date: localDate(invoice.invoice_paid_date), at: new Date(invoice.invoice_paid_date).getTime(), kind: "legacy_payment", invoiceId: invoice._id, description: "Pago histórico registrado", debitMinor: 0, creditMinor: unrepresented });
  }
  for (const application of applications) events.push({ id: `application:${application._id}`, applicationId: application._id, reversible: application.kind !== "reversal" && !application.reversedById, date: localDate(application.createdAt), at: new Date(application.createdAt).getTime(), kind: application.kind, invoiceId: application.invoiceId, description: application.reason, debitMinor: application.kind === "reversal" ? application.amountMinor : 0, creditMinor: application.kind === "reversal" ? 0 : application.amountMinor });
  events.sort((a, b) => a.date.localeCompare(b.date) || Number(b.kind === "charge") - Number(a.kind === "charge") || (a.at || 0) - (b.at || 0) || a.id.localeCompare(b.id));
  let openingMinor = 0, running = 0;
  const rows = [];
  for (const event of events) {
    if (event.date > to) continue;
    running += event.debitMinor - event.creditMinor;
    if (event.date < from) openingMinor = running;
    else rows.push({ ...event, balanceMinor: running });
  }
  const currentDate = localDate(new Date());
  const pending = selected.filter(invoice => utcDate(invoice.issueDate) <= currentDate).reduce((sum, invoice) => sum + balanceMinor(invoice), 0);
  const availableCredits = credits.filter(credit => credit.unitNumber && unitKey(credit.unitNumber) === unitKey(unitNumber)).map(credit => ({ ...credit, availableMinor: credit.amountMinor - (credit.consumedMinor || 0) }));
  return { openingMinor, closingMinor: running, currentPendingMinor: pending, currency, docs: rows.slice((page - 1) * limit, page * limit), total: rows.length, page, limit, credits: availableCredits, warnings: { undatedLegacyPayments: selected.filter(invoice => !invoice.invoice_paid_date && (invoice.paidAmount ?? (invoice.paymentStatus === "completed" ? invoice.amount : 0)) > (cashByInvoice.get(String(invoice._id)) || 0) / 100).length, undatedPayments: payments.filter(payment => !payment.confirmedAt).length } };
}
module.exports = { receivables, cashReport, bankSummary, unitHistory, utcDate, inRange };
