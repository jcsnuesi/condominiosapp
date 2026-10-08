"use strict";
const { IoTCommandExpiryService } = require("../modules/iot/application/commandExpiryService");

function startIoTCommandExpiryJob({ service = new IoTCommandExpiryService(),
  enabled = process.env.IOT_COMMANDS_ENABLED === "true" && process.env.DISABLE_SCHEDULED_JOBS !== "true",
  schedule = setInterval } = {}) {
  if (!enabled) return null;
  let running = false;
  const timer = schedule(async () => {
    if (running) return;
    running = true;
    try { await service.expireCommands(); }
    catch { process.stderr.write("IoT command sweep failed: IOT_COMMAND_EXPIRY_SWEEP_FAILED\n"); }
    finally { running = false; }
  }, 60000);
  timer.unref?.();
  return timer;
}
module.exports = { startIoTCommandExpiryJob };
