"use strict";
const crypto = require("crypto");
function problem(message, status = 400, code = "VALIDATION_ERROR") { return Object.assign(new Error(message), { status, code }); }
function moneyMinor(value) {
  const text = String(value ?? "").trim();
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(text)) throw problem("Monto inválido: use decimales con punto, sin separadores de miles");
  const [whole, decimals = ""] = text.split(".");
  const minor = Number(whole) * 100 + Number(decimals.padEnd(2, "0"));
  if (!Number.isSafeInteger(minor) || minor <= 0) throw problem("El monto debe ser mayor que cero");
  return minor;
}
function moneyText(minor) { return (minor / 100).toFixed(2); }
function dateOnly(value) {
  const text = String(value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(Date.parse(text)) || new Date(text).toISOString().slice(0, 10) !== text) throw problem("Fecha inválida: use AAAA-MM-DD");
  return text;
}
function bounded(value, max = 120) {
  if (value != null && typeof value !== "string") throw problem("El campo debe ser texto");
  const text = (value || "").trim();
  if (text.length > max || /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(text)) throw problem("Texto inválido o demasiado largo");
  return text;
}
function currencyCode(value) { const text = bounded(value, 3).toUpperCase(); if (!/^[A-Z]{3}$/.test(text)) throw problem("Indique la moneda de tres letras"); return text; }
function normalizeFields(fields) {
  return { amount: moneyText(moneyMinor(fields.amount)), date: dateOnly(fields.date), currency: currencyCode(fields.currency), reference: bounded(fields.reference), bank: bounded(fields.bank) };
}
function normalizeStatementRows(rows, currency) {
  if (!Array.isArray(rows) || !rows.length || rows.length > 1000) throw problem("Revise entre 1 y 1000 movimientos");
  const seen = new Set();
  return rows.map((row, index) => {
    const fields = normalizeFields(row);
    if (fields.currency !== currency) throw problem(`Moneda distinta a la cuenta en fila ${index + 1}`);
    const direction = bounded(row.direction, 10).toLowerCase();
    if (!["credit", "debit"].includes(direction)) throw problem(`Seleccione crédito o débito en fila ${index + 1}`);
    const result = { ...fields, direction, description: bounded(row.description, 500), amountMinor: moneyMinor(fields.amount), sourceRow: Number(row.sourceRow) || index + 1 };
    result.fingerprint = crypto.createHash("sha256").update(JSON.stringify([result.date, result.amountMinor, result.currency, result.reference.toUpperCase(), result.reference ? "" : result.description, direction])).digest("hex");
    if (seen.has(result.fingerprint)) throw problem("Hay filas indistinguibles. Verifique la referencia o descripción bancaria antes de importar", 409, "AMBIGUOUS_DUPLICATE");
    seen.add(result.fingerprint);
    return result;
  });
}
function compareReceipt(fields, movement) {
  let normalized;
  try { normalized = normalizeFields(fields); } catch (_) { return { eligible: false, reasons: ["incomplete_receipt"], referenceMatches: false }; }
  const reasons = [];
  if (moneyMinor(normalized.amount) !== movement.amountMinor) reasons.push("amount_mismatch");
  if (normalized.currency !== movement.currency) reasons.push("currency_mismatch");
  if (movement.direction !== "credit") reasons.push("not_credit");
  if (movement.allocatedReceiptId || movement.financeEntryId) reasons.push("already_allocated");
  const dayDifference = Math.abs(Date.parse(normalized.date) - Date.parse(movement.date)) / 86400000;
  if (!Number.isFinite(dayDifference) || dayDifference > 5) reasons.push("date_outside_window");
  const referenceMatches = !!normalized.reference && !!movement.reference && normalized.reference.toUpperCase() === movement.reference.trim().toUpperCase();
  return { eligible: reasons.length === 0, reasons: [...reasons, ...(referenceMatches ? ["reference_match"] : ["reference_requires_review"])], referenceMatches, dayDifference };
}
function allocatePayment(invoice, amountMinor) {
  const total = moneyMinor(invoice.amount);
  const reductions = Math.round(Number(invoice.adjustmentAmount || 0) * 100) + Math.round(Number(invoice.creditAppliedAmount || 0) * 100);
  const alreadyPaid = invoice.paymentStatus === "completed" && invoice.paidAmount == null ? total : Math.round(Number(invoice.paidAmount || 0) * 100);
  if (!Number.isSafeInteger(alreadyPaid) || alreadyPaid < 0 || alreadyPaid > total) throw problem("Saldo de factura inconsistente", 409);
  if (!Number.isSafeInteger(reductions) || reductions < 0 || alreadyPaid + reductions > total) throw problem("Ajustes de factura inconsistentes", 409);
  const applied = Math.min(Math.max(total - alreadyPaid - reductions, 0), amountMinor);
  return { appliedAmount: applied / 100, creditAmount: (amountMinor - applied) / 100, remainingBalance: (total - alreadyPaid - reductions - applied) / 100, paidAmount: (alreadyPaid + applied) / 100 };
}
module.exports = { problem, moneyMinor, moneyText, dateOnly, bounded, currencyCode, normalizeFields, normalizeStatementRows, compareReceipt, allocatePayment };
