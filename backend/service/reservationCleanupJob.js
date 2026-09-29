"use strict";

const cron = require("node-cron");
const Reserves = require("../models/reserves");

const GUEST_RETENTION_MS = 24 * 60 * 60 * 1000;
let scheduledTask = null;
let cleanupInProgress = false;

function buildExpiredGuestQuery(now = new Date()) {
  return {
    status: "Guest",
    createdAt: { $lte: new Date(now.getTime() - GUEST_RETENTION_MS) },
  };
}

async function runGuestReservationCleanup(options = {}) {
  const now = options.now || new Date();
  const reserveModel = options.reserveModel || Reserves;
  const result = await reserveModel.deleteMany(buildExpiredGuestQuery(now));

  return {
    deletedCount: result.deletedCount || 0,
    cutoff: new Date(now.getTime() - GUEST_RETENTION_MS),
  };
}

function setupGuestReservationCleanupJob() {
  if (scheduledTask) {
    return scheduledTask;
  }

  const schedule = process.env.GUEST_RESERVATION_CLEANUP_CRON || "*/5 * * * *";
  const timezone =
    process.env.GUEST_RESERVATION_CLEANUP_TIMEZONE || "America/Santo_Domingo";

  if (!cron.validate(schedule)) {
    throw new Error(
      `Invalid GUEST_RESERVATION_CLEANUP_CRON expression: ${schedule}`
    );
  }

  scheduledTask = cron.schedule(
    schedule,
    async () => {
      // Avoid overlapping executions in the same process. deleteMany itself is
      // idempotent, so concurrent application instances are also safe.
      if (cleanupInProgress) {
        return;
      }

      cleanupInProgress = true;
      try {
        const summary = await runGuestReservationCleanup();
        console.log(
          `Guest reservation cleanup completed: ${summary.deletedCount} deleted`
        );
      } catch (error) {
        console.error("Guest reservation cleanup failed:", error.message);
      } finally {
        cleanupInProgress = false;
      }
    },
    { timezone, scheduled: true }
  );

  console.log(
    `Guest reservation cleanup configured: '${schedule}' (${timezone})`
  );
  return scheduledTask;
}

module.exports = {
  GUEST_RETENTION_MS,
  buildExpiredGuestQuery,
  runGuestReservationCleanup,
  setupGuestReservationCleanupJob,
};
