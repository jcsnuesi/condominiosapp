"use strict";

const { IoTReconciliationService } = require("./iotReconciliationService");

function startIoTReconciliationJob({
  reconciler = new IoTReconciliationService(),
  intervalMs = Number(process.env.IOT_RECONCILIATION_INTERVAL_MS || 60_000),
  enabled = process.env.DISABLE_SCHEDULED_JOBS !== "true",
  schedule = setInterval,
} = {}) {
  if (!enabled) return null;
  let running = false;
  const timer = schedule(async () => {
    if (running) return;
    running = true;
    try {
      await reconciler.reconcilePending();
    } catch (error) {
      process.stderr.write(
        `IoT reconciliation failed: ${
          error.code || "IOT_RECONCILIATION_FAILED"
        }\n`
      );
    } finally {
      running = false;
    }
  }, Math.max(10_000, intervalMs));
  timer.unref?.();
  return timer;
}

module.exports = { startIoTReconciliationJob };
