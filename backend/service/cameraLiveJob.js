"use strict";
function startCameraLiveJob({ enabled = process.env.CAMERAS_ENABLED === "true" && process.env.DISABLE_SCHEDULED_JOBS !== "true",
  service, schedule = setInterval } = {}) {
  if (!enabled) return null;
  service ||= require("../modules/cameras/runtime").cameraRuntime().live;
  let running = false;
  const timer = schedule(async () => {
    if (running) return;
    running = true;
    try {
      const result = await service.sweep();
      if (result?.failed) process.stderr.write("Camera session close retries pending: CAMERA_SESSION_CLOSE_PENDING\n");
    }
    catch { process.stderr.write("Camera session sweep failed: CAMERA_SESSION_SWEEP_FAILED\n"); }
    finally { running = false; }
  }, 5000);
  timer.unref?.();
  return timer;
}
module.exports = { startCameraLiveJob };
