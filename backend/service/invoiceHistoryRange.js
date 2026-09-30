"use strict";

const INVOICE_HISTORY_MONTHS = 12;
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function startOfUtcMonth(date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0)
  );
}

function addUtcMonths(date, months) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1, 0, 0, 0, 0)
  );
}

function invoiceHistoryRange(month = "all", now = new Date()) {
  const retentionStart = addUtcMonths(startOfUtcMonth(now), -(INVOICE_HISTORY_MONTHS - 1));
  const retentionEnd = addUtcMonths(startOfUtcMonth(now), 1);
  const normalizedMonth = String(month || "all").toLowerCase();

  if (normalizedMonth === "all") {
    return {
      start: retentionStart,
      end: retentionEnd,
      selectedMonth: "all",
    };
  }

  if (!MONTH_PATTERN.test(normalizedMonth)) {
    const error = new Error("Month must use the YYYY-MM format or be 'all'");
    error.statusCode = 400;
    throw error;
  }

  const [year, monthNumber] = normalizedMonth.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = addUtcMonths(start, 1);

  if (start < retentionStart || start >= retentionEnd) {
    const error = new Error("The selected month is outside the 12-month invoice history");
    error.statusCode = 400;
    throw error;
  }

  return { start, end, selectedMonth: normalizedMonth };
}

module.exports = {
  INVOICE_HISTORY_MONTHS,
  invoiceHistoryRange,
};
