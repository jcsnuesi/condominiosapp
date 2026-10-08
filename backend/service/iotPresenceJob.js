"use strict";
const { IoTPresenceService } = require("../modules/iot/application/presenceService");

function startIoTPresenceJob({ service = new IoTPresenceService(),
  enabled = process.env.IOT_INGESTION_ENABLED === "true" && process.env.DISABLE_SCHEDULED_JOBS !== "true",
  schedule = setInterval } = {}) {
  if (!enabled) return null;
  let running = false;
  const timer = schedule(async () => {
    if (running) return;
    running = true;
    try { await service.expirePresence(); }
    catch { process.stderr.write("IoT presence sweep failed: IOT_PRESENCE_SWEEP_FAILED\n"); }
    finally { running = false; }
  }, 60000);
  timer.unref?.();
  return timer;
}

module.exports = { startIoTPresenceJob };
