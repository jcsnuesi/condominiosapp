"use strict";

const FREQUENCIES = ["ONCE", "DAY", "WEEK", "MONTH", "YEAR"];
const OPEN = ["SCHEDULED", "PENDING", "IN_PROGRESS", "OVERDUE"];
const CLOSED = ["COMPLETED", "CANCELLED", "SKIPPED"];
function fail(message, status = 400) {
  const error = new Error(message); error.statusCode = status; throw error;
}
function date(value, name = "date") {
  if (typeof value === "string" && !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value)) fail(`${name} requires an ISO timestamp with timezone`);
  const result = new Date(value);
  if (!value || !Number.isFinite(result.getTime())) fail(`Invalid ${name}`);
  return result;
}
function timezone(value = "America/Santo_Domingo") {
  try { new Intl.DateTimeFormat("en", { timeZone: value }).format(); } catch { fail("Invalid timezone"); }
  return value;
}
function parts(value, zone) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })
    .formatToParts(value).reduce((out, p) => { if (p.type !== "literal") out[p.type] = Number(p.value); return out; }, {});
}
function wallUtc(p) { return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second); }
function fromParts(p, zone) {
  const target = wallUtc(p); let candidate = target;
  // Resolve offsets without assuming every local day is 24 hours. For a DST gap,
  // move forward by the gap; for an overlap choose the earlier instant.
  const offsets = [...new Set([-36, 0, 36].map(h => {
    const t = target + h * 3600000; return wallUtc(parts(new Date(t), zone)) - t;
  }))];
  const candidates = offsets.map(offset => target - offset).sort((a, b) => a - b);
  const exact = candidates.find(t => wallUtc(parts(new Date(t), zone)) === target);
  if (exact !== undefined) return new Date(exact);
  const forward = candidates.filter(t => wallUtc(parts(new Date(t), zone)) > target);
  if (forward.length) candidate = Math.min(...forward);
  return new Date(candidate);
}
function nextDate(base, type, interval, zone = "America/Santo_Domingo") {
  if (!FREQUENCIES.includes(type) || !Number.isInteger(interval) || interval < 1 || interval > 10000) fail("Invalid frequency");
  if (type === "ONCE") return null;
  const original = date(base); const p = parts(original, timezone(zone));
  if (type === "DAY" || type === "WEEK") {
    const d = new Date(Date.UTC(p.year, p.month - 1, p.day + interval * (type === "WEEK" ? 7 : 1)));
    Object.assign(p, { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() });
  } else {
    const d = new Date(Date.UTC(p.year, p.month - 1 + (type === "MONTH" ? interval : 12 * interval), 1));
    const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    Object.assign(p, { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: Math.min(p.day, last) });
  }
  const result = fromParts(p, zone); result.setUTCMilliseconds(original.getUTCMilliseconds()); return result;
}
function reminderDate(due, days, zone) { return days ? subtractDays(due, days, zone) : date(due); }
function subtractDays(due, days, zone) {
  const p = parts(date(due), timezone(zone)); const d = new Date(Date.UTC(p.year, p.month - 1, p.day - days));
  return fromParts({ ...p, year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }, zone);
}
function transition(current, target) {
  if (!OPEN.includes(current)) fail("Task is already closed", 409);
  const allowed = { SCHEDULED: ["IN_PROGRESS", "CANCELLED", "SKIPPED"], PENDING: ["IN_PROGRESS", "CANCELLED", "SKIPPED"], IN_PROGRESS: ["CANCELLED", "SKIPPED"], OVERDUE: ["IN_PROGRESS", "CANCELLED", "SKIPPED"] };
  if (!allowed[current]?.includes(target)) fail("Invalid task transition", 409);
}
function ownership(value) {
  return Boolean(value.organizationId) !== Boolean(value.ownerId);
}
function text(value, max, required = false) {
  if (typeof value !== "string" || value.trim().length > max || (required && !value.trim())) fail("Invalid text field");
  return value.trim();
}
module.exports = { FREQUENCIES, OPEN, CLOSED, fail, date, timezone, nextDate, reminderDate, transition, ownership, text };
