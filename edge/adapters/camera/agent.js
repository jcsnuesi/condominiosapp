"use strict";
const fs = require("node:fs/promises");
const http = require("node:http");
const { timingSafeEqual } = require("node:crypto");
const { MotionRecorder } = require("./motion-recorder");
const { RecordingUploader } = require("./recording-uploader");
const { CameraBackendTransport } = require("./backend-transport");
const { captureWithFfmpeg } = require("./ffmpeg-capture");
const { CameraConfigurationSync } = require("./configuration-sync");

async function startCameraAgent(config) {
  if (typeof config.motionSourceKey !== "string" || config.motionSourceKey.length < 32 || !config.channels || !config.cameras)
    throw new Error("CAMERA_AGENT_CONFIG_INVALID");
  const recorder = new MotionRecorder({ stateDirectory: config.stateDirectory, cameras: config.cameras, capture: captureWithFfmpeg, storage: config.storage });
  const transport = new CameraBackendTransport(config.backend);
  const uploader = new RecordingUploader({ stateDirectory: config.stateDirectory, transport });
  const synchronizer = config.mediaControl ? new CameraConfigurationSync({ ...config.mediaControl, transport, recorder, channels: config.channels }) : undefined;
  const server = http.createServer(async (req, res) => {
    const key = req.headers["x-comunard-motion-key"];
    if (req.method !== "POST" || req.url !== "/motion" || typeof key !== "string" ||
      Buffer.byteLength(key) !== Buffer.byteLength(config.motionSourceKey) ||
      !timingSafeEqual(Buffer.from(key), Buffer.from(config.motionSourceKey))) { res.writeHead(403); res.end(); return; }
    try {
      let bytes = 0, body = "";
      for await (const chunk of req) { bytes += chunk.length; if (bytes > 4096) throw new Error("CAMERA_EVENT_TOO_LARGE"); body += chunk; }
      const value = JSON.parse(body);
      if (!value || Object.keys(value).some((name) => !["channel", "sourceEventId", "occurredAt"].includes(name)) ||
        typeof value.channel !== "string" || !Object.hasOwn(config.channels, value.channel)) throw new Error("CAMERA_CHANNEL_INVALID");
      const result = await recorder.onMotion({ schemaVersion: 1, cameraId: config.channels[value.channel], sourceEventId: value.sourceEventId, occurredAt: value.occurredAt });
      res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify({ status: result.status }));
    } catch { res.writeHead(422); res.end(JSON.stringify({ code: "CAMERA_MOTION_REJECTED" })); }
  });
  server.requestTimeout = 5000;
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(8079, "127.0.0.1", resolve); });
  const timer = setInterval(() => { void uploader.uploadPending({ limit: 3 }).catch(() => process.stderr.write("CAMERA_UPLOAD_SWEEP_FAILED\n")); }, 5000);
  const sync = () => { void synchronizer?.sync().catch(() => process.stderr.write("CAMERA_CONFIGURATION_SYNC_FAILED\n")); };
  const configurationTimer = synchronizer ? setInterval(sync, 15000) : undefined;
  sync();
  return { close: async () => { clearInterval(timer); if (configurationTimer) clearInterval(configurationTimer); await new Promise((resolve) => server.close(resolve)); } };
}
if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    if (args.length !== 2 || args[0] !== "--config") throw new Error("CAMERA_CONFIG_FILE_REQUIRED");
    const info = await fs.lstat(args[1]);
    if (!info.isFile() || info.isSymbolicLink() || info.size > 65536) throw new Error("CAMERA_CONFIG_FILE_INVALID");
    const agent = await startCameraAgent(JSON.parse(await fs.readFile(args[1], "utf8")));
    for (const signal of ["SIGTERM", "SIGINT"]) process.once(signal, () => { void agent.close().then(() => { process.exitCode = 0; }); });
  })().catch(() => { process.stderr.write("CAMERA_AGENT_START_FAILED\n"); process.exitCode = 1; });
}
module.exports = { startCameraAgent };
