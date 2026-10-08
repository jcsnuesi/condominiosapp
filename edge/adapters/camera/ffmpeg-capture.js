"use strict";
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const execute = promisify(execFile);
const fail = () => Object.assign(new Error("Camera capture failed"), { code: "CAMERA_CAPTURE_FAILED" });

async function captureWithFfmpeg(camera, output, { seconds, maxBytes }) {
  if (seconds !== 30 || typeof camera.rtspSource !== "string" || !/^rtsps?:\/\//.test(camera.rtspSource)) throw fail();
  // URL may contain local credentials. Never propagate child stderr or command arguments to logs.
  try {
    await execute("ffmpeg", ["-nostdin", "-hide_banner", "-loglevel", "error", "-rtsp_transport", "tcp", "-i", camera.rtspSource,
      "-t", "30", "-fs", String(maxBytes), "-map", "0:v:0", "-an", "-c:v", "copy", "-movflags", "+faststart", "-n", output],
    { timeout: 45000, windowsHide: true, maxBuffer: 16384 });
    const { stdout } = await execute("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "json", output],
      { timeout: 5000, windowsHide: true, maxBuffer: 16384 });
    return { durationSeconds: Number(JSON.parse(stdout).format?.duration) };
  } catch { throw fail(); }
}
module.exports = { captureWithFfmpeg };
