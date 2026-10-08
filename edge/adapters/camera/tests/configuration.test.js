"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { CameraConfigurationSync } = require("../configuration-sync");
const cameraId = "a".repeat(24), streamId = "camera-test", source = "rtsp://local:private@192.168.1.20:554/stream";
const entry = () => ({ cameraId, streamId, rtspSource: source, enabled: true, recordingEnabled: false });
test("gateway config creates paths, reuses them, survives MediaMTX restart and removes disabled cameras", async () => {
  let path, current = entry(); const requests = [], recorder = { cameras: {} }, channels = {};
  const sync = new CameraConfigurationSync({ transport: { configuration: async () => ({ cameras: [current], nextCursor: null }) },
    controlUser: "control", controlPassword: "x".repeat(32), recorder, channels, fetchImpl: async (url, options) => {
      requests.push({ url, options });
      if (options.method === "GET") return { ok: !!path, status: path ? 200 : 404, json: async () => path };
      if (options.method === "DELETE") path = undefined;
      else path = JSON.parse(options.body);
      return { ok: true, status: 200 };
    } });
  await sync.sync(); assert.equal(path.source, source); assert.equal(path.record, false); assert.equal(recorder.cameras[cameraId].enabled, false);
  assert.equal(channels[cameraId], cameraId);
  await sync.sync(); assert.equal(requests.filter((r) => r.options.method === "POST").length, 1);
  path = undefined; await sync.sync(); assert.equal(requests.filter((r) => r.options.method === "POST").length, 2);
  current = { ...entry(), enabled: false }; await sync.sync();
  assert.equal(path, undefined); assert.equal(recorder.cameras[cameraId], undefined);
});
test("gateway config rejects cross-page corruption and unsafe destinations before media calls", async () => {
  let calls = 0;
  for (const bad of [{ ...entry(), rtspSource: "rtsp://169.254.169.254/private" }, { ...entry(), cameraId: "../other" }]) {
    const sync = new CameraConfigurationSync({ transport: { configuration: async () => ({ cameras: [bad], nextCursor: null }) },
      controlUser: "control", controlPassword: "x".repeat(32), recorder: { cameras: {} }, channels: {}, fetchImpl: async () => { calls++; } });
    await assert.rejects(sync.sync(), /CAMERA_CONFIGURATION_SYNC_FAILED/);
  }
  assert.equal(calls, 0);
});
