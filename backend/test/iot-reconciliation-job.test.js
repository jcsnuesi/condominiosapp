"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  startIoTReconciliationJob,
} = require("../service/iotReconciliationJob");

test("reconciliation job remains disabled with the scheduled-jobs switch", () => {
  let scheduled = false;
  const result = startIoTReconciliationJob({
    enabled: false,
    schedule: () => {
      scheduled = true;
    },
  });
  assert.equal(result, null);
  assert.equal(scheduled, false);
});

test("reconciliation job schedules one non-overlapping worker callback", async () => {
  let callback;
  let runs = 0;
  let unrefCalled = false;
  const timer = {
    unref() {
      unrefCalled = true;
    },
  };
  startIoTReconciliationJob({
    enabled: true,
    intervalMs: 1000,
    reconciler: {
      reconcilePending: async () => {
        runs += 1;
      },
    },
    schedule(fn, interval) {
      callback = fn;
      assert.equal(interval, 10_000);
      return timer;
    },
  });
  await callback();
  assert.equal(runs, 1);
  assert.equal(unrefCalled, true);
});
