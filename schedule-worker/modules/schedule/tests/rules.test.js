"use strict";
const test = require("node:test"); const assert = require("node:assert/strict");
const rules = require("../domain/rules");
test("calendar recurrence clamps month ends and leap years", () => {
  assert.equal(rules.nextDate("2026-01-31T13:00:00Z", "MONTH", 1).toISOString(), "2026-02-28T13:00:00.000Z");
  assert.equal(rules.nextDate("2024-02-29T13:00:00Z", "YEAR", 1).toISOString(), "2025-02-28T13:00:00.000Z");
  assert.equal(rules.nextDate("2026-06-05T13:00:00Z", "MONTH", 4).toISOString(), "2026-10-05T13:00:00.000Z");
  assert.equal(rules.nextDate("2026-06-05T13:00:00Z", "ONCE", 1), null);
});
test("days and weeks preserve wall clock across daylight saving", () => {
  assert.equal(rules.nextDate("2026-03-07T14:00:00Z", "DAY", 1, "America/New_York").toISOString(), "2026-03-08T13:00:00.000Z");
  assert.equal(rules.nextDate("2026-03-01T14:00:00Z", "WEEK", 1, "America/New_York").toISOString(), "2026-03-08T13:00:00.000Z");
  assert.equal(rules.reminderDate("2026-03-08T13:00:00Z", 1, "America/New_York").toISOString(), "2026-03-07T14:00:00.000Z");
  assert.equal(rules.nextDate("2026-03-07T07:30:00Z", "DAY", 1, "America/New_York").toISOString(), "2026-03-08T07:30:00.000Z");
});
test("ownership is exclusive and transitions cannot reopen closed work", () => {
  assert.equal(rules.ownership({ ownerId: "owner" }), true);
  assert.equal(rules.ownership({ organizationId: "org" }), true);
  assert.equal(rules.ownership({ organizationId: "org", ownerId: "owner" }), false);
  assert.equal(rules.ownership({}), false);
  rules.transition("OVERDUE", "IN_PROGRESS");
  for (const status of rules.CLOSED) assert.throws(() => rules.transition(status, "PENDING"));
  assert.throws(() => rules.transition("PENDING", "COMPLETED"));
  assert.throws(() => rules.nextDate(new Date(), "MONTH", 0));
  assert.throws(() => rules.timezone("invalid"));
  assert.throws(() => rules.date("2026-01-01"));
});
