"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { remainingInvoiceBalance } = require("../service/invoiceBalance");
const { allocatePayment, compareReceipt } = require("../service/bankReconciliationRules");
const { refreshInvoice, lateFeeMinor, agingBucket, budgetVariance, csv, isVerifiedMonthly, monthlySourceKey } = require("../service/financeRules");
const controller = require("../controllers/finance");

test("partial cash, discount and credit preserve original amount and separate cash from debt", () => {
  const invoice = { amount: 5000, paidAmount: 2000, adjustmentAmount: 500, creditAppliedAmount: 1000, paymentStatus: "pending" };
  assert.equal(remainingInvoiceBalance(invoice), 1500);
  const result = allocatePayment(invoice, 200000);
  assert.deepEqual(result, { appliedAmount: 1500, creditAmount: 500, remainingBalance: 0, paidAmount: 3500 });
  refreshInvoice({ ...invoice, paidAmount: result.paidAmount });
  assert.equal(invoice.amount, 5000);
});
test("waiver is not cash and a reversal reopens a settled invoice", () => {
  const invoice = { amount: 100, paidAmount: 40, adjustmentAmount: 60, paymentStatus: "pending" };
  refreshInvoice(invoice); assert.equal(invoice.paymentStatus, "completed"); assert.equal(invoice.paidAmount, 40);
  invoice.adjustmentAmount = 0; refreshInvoice(invoice);
  assert.equal(invoice.balancePending, 60); assert.equal(invoice.paymentStatus, "pending");
  assert.throws(() => refreshInvoice({ amount: 100, paidAmount: 90, adjustmentAmount: 20 }), /excede/);
});
test("late fee uses outstanding principal, grace days and effective date without compounding", () => {
  const invoice = { amount: 5000, paidAmount: 2000, chargeType: "monthly", dueDate: new Date("2026-10-05T00:00:00Z") };
  const policy = { enabled: true, mode: "percent", value: 2.5, graceDays: 3, effectiveFrom: "2026-10-01" };
  assert.equal(lateFeeMinor(invoice, policy, "2026-10-08"), 0);
  assert.equal(lateFeeMinor(invoice, policy, "2026-10-09"), 7500);
  assert.equal(lateFeeMinor({ ...invoice, chargeType: "late_fee" }, policy, "2026-10-09"), 0);
  assert.equal(lateFeeMinor(invoice, { ...policy, effectiveFrom: "2026-10-06" }, "2026-10-09"), 0);
  assert.equal(lateFeeMinor(invoice, { ...policy, mode: "fixed", value: 50 }, "2026-10-09"), 5000);
});
test("monthly idempotency excludes owner and status and recognizes only verified legacy origins", () => {
  assert.equal(monthlySourceKey(" A-1 ", "2026-10"), monthlySourceKey("a-1", "2026-10"));
  assert.equal(isVerifiedMonthly({ description: "Monthly maintenance fee - Unit A1 - October 2026" }), true);
  assert.equal(isVerifiedMonthly({ description: "Reparación de ascensor" }), false);
});
test("aging uses calendar-day boundaries and variance has no division by zero", () => {
  assert.equal(agingBucket({ dueDate: "2026-10-01" }, "2026-10-01"), "current");
  assert.equal(agingBucket({ dueDate: "2026-09-01" }, "2026-10-01"), "1-30");
  assert.equal(agingBucket({ dueDate: "2026-08-31" }, "2026-10-01"), "31-60");
  assert.equal(budgetVariance(0, 100).variancePercent, null);
  assert.equal(budgetVariance(10000, 12500).variancePercent, 25);
});
test("CSV escapes formulas and finance-classified bank movements cannot pay invoices", () => {
  assert.match(csv([["=CMD()", 'A"B', 10]]), /"'=CMD\(\)"/);
  assert.match(csv([['A"B']]), /"A""B"/);
  const fields = { amount: "100", date: "2026-10-01", currency: "DOP", reference: "r", bank: "bank" };
  assert.equal(compareReceipt(fields, { ...fields, amountMinor: 10000, direction: "credit", financeEntryId: "classified" }).eligible, false);
});
test("finance write endpoints reject owners before any database access", async () => {
  for (const method of ["charges", "adjustment", "applyCredit", "saveBudget", "createEntry", "reverseApplication", "saveSettings", "reverseEntry", "openingBalance", "runLateFees"]) {
    const req = { user: { role: "OWNER", sub: "owner" }, auth: { organizationId: "org", scope: { mode: "ALL" } }, params: {}, query: {}, body: {} };
    const res = { status(code) { this.code = code; return this; }, send(body) { this.body = body; return this; } };
    await controller[method](req, res); assert.equal(res.code, 403, method);
  }
});
