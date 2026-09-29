"use strict";

const cron = require("node-cron");
const { syncAllActiveChannels } = require("./icalSync");

function parseCronExpression(value) {
  if (!value || typeof value !== "string") {
    return "*/30 * * * *";
  }
  return value;
}

async function setupIcalSyncCronJobs() {
  const isEnabled = String(process.env.ENABLE_ICAL_SYNC || "false") === "true";
  if (!isEnabled) {
    console.log(
      "ℹ️ iCal sync cron disabled (set ENABLE_ICAL_SYNC=true to enable)"
    );
    return;
  }

  const schedule = parseCronExpression(process.env.ICAL_SYNC_CRON);
  const timezone = process.env.ICAL_SYNC_TIMEZONE || "America/Santo_Domingo";

  if (!cron.validate(schedule)) {
    throw new Error(`Invalid ICAL_SYNC_CRON expression: ${schedule}`);
  }

  cron.schedule(
    schedule,
    async () => {
      try {
        const summary = await syncAllActiveChannels();
        console.log("✅ iCal sync cron completed", summary);
      } catch (error) {
        console.error("❌ iCal sync cron failed:", error.message);
      }
    },
    {
      timezone,
      scheduled: true,
    }
  );

  console.log(
    `✅ iCal sync cron configured with schedule '${schedule}' (${timezone})`
  );
}

module.exports = {
  setupIcalSyncCronJobs,
};
