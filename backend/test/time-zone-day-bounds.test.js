"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  getTimeZoneDayBounds,
} = require("../service/timeZoneDayBounds");

test("uses the Santo Domingo calendar day across the UTC date boundary", () => {
  const bounds = getTimeZoneDayBounds(
    new Date("2026-08-24T02:30:00.000Z"),
    "America/Santo_Domingo"
  );

  assert.equal(bounds.start.toISOString(), "2026-08-23T04:00:00.000Z");
  assert.equal(bounds.end.toISOString(), "2026-08-24T04:00:00.000Z");
});

test("computes variable-length days for time zones with daylight saving", () => {
  const bounds = getTimeZoneDayBounds(
    new Date("2026-03-08T16:00:00.000Z"),
    "America/New_York"
  );

  assert.equal(bounds.start.toISOString(), "2026-03-08T05:00:00.000Z");
  assert.equal(bounds.end.toISOString(), "2026-03-09T04:00:00.000Z");
});
