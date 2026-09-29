"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  GUEST_RETENTION_MS,
  buildExpiredGuestQuery,
  runGuestReservationCleanup,
} = require("../service/reservationCleanupJob");

test("guest cleanup query targets only Guest records at least 24 hours old", () => {
  const now = new Date("2026-08-28T12:00:00.000Z");
  const query = buildExpiredGuestQuery(now);

  assert.equal(GUEST_RETENTION_MS, 24 * 60 * 60 * 1000);
  assert.equal(query.status, "Guest");
  assert.equal(query.createdAt.$lte.toISOString(), "2026-08-27T12:00:00.000Z");
});

test("guest cleanup performs one idempotent deleteMany operation", async () => {
  const queries = [];
  const reserveModel = {
    async deleteMany(query) {
      queries.push(query);
      return { deletedCount: 3 };
    },
  };
  const now = new Date("2026-08-28T12:00:00.000Z");

  const summary = await runGuestReservationCleanup({ now, reserveModel });

  assert.equal(summary.deletedCount, 3);
  assert.equal(summary.cutoff.toISOString(), "2026-08-27T12:00:00.000Z");
  assert.equal(queries.length, 1);
  assert.deepEqual(queries[0], buildExpiredGuestQuery(now));
});
