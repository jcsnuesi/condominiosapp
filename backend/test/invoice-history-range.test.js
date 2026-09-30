"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  INVOICE_HISTORY_MONTHS,
  invoiceHistoryRange,
} = require("../service/invoiceHistoryRange");

const referenceDate = new Date("2026-09-29T12:00:00.000Z");

test("invoice history defaults to all invoices in the latest 12 calendar months", () => {
  const range = invoiceHistoryRange(undefined, referenceDate);

  assert.equal(INVOICE_HISTORY_MONTHS, 12);
  assert.equal(range.selectedMonth, "all");
  assert.equal(range.start.toISOString(), "2025-10-01T00:00:00.000Z");
  assert.equal(range.end.toISOString(), "2026-10-01T00:00:00.000Z");
});

test("invoice history resolves a selected month", () => {
  const range = invoiceHistoryRange("2026-02", referenceDate);

  assert.equal(range.selectedMonth, "2026-02");
  assert.equal(range.start.toISOString(), "2026-02-01T00:00:00.000Z");
  assert.equal(range.end.toISOString(), "2026-03-01T00:00:00.000Z");
});

test("invoice history rejects invalid and expired months", () => {
  assert.throws(
    () => invoiceHistoryRange("February", referenceDate),
    /YYYY-MM/
  );
  assert.throws(
    () => invoiceHistoryRange("2025-09", referenceDate),
    /outside the 12-month/
  );
});
