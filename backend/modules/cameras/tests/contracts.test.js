"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Camera = require("../../../models/camera");
const { cameraResponse, recordingResponse, createCameraRouter } = require("../api");
const { CameraInventoryService } = require("../application/inventoryService");
const { MediaControl } = require("../infrastructure/mediaControl");
const { enforceAdministrativePermission } = require("../../../middleware/organizationAuth");
const express = require("express");
const id = () => new mongoose.Types.ObjectId();

test("camera contexts remain immutable and invalid private bindings fail schema validation", async () => {
  const common = { scopeType: "COMMON_AREA", organizationId: id(), condominiumId: id(), displayName: "Entrada",
    gatewayId: id(), streamId: "opaque-stream", secretRef: "camera/reference", protocol: "RTSP", createdBy: id(), requestKey: "create-1" };
  await new Camera(common).validate();
  await assert.rejects(new Camera({ ...common, unitId: id() }).validate(), /Context references/);
  assert.equal(Camera.schema.path("secretRef").options.select, false);
  assert.equal(Camera.schema.path("gatewayId").options.immutable, true);
});

test("camera and recording DTOs exclude network credentials and internal storage keys", () => {
  const camera = cameraResponse({ _id: "camera", gatewayId: "gateway", secretRef: "private", streamId: "private", password: "private" });
  assert.equal(camera.motionClipSeconds, 30); assert.equal(camera.retentionDays, 7);
  for (const field of ["secretRef", "streamId", "password"]) assert.ok(!Object.hasOwn(camera, field));
  const recording = recordingResponse({ _id: "recording", cameraId: "camera", eventId: "event", objectKey: "private", checksum: "private" });
  assert.ok(!Object.hasOwn(recording, "objectKey")); assert.ok(!Object.hasOwn(recording, "checksum"));
});

test("camera administration maps sensitive actions to explicit delegated permissions", () => {
  for (const [method, path, permission] of [["POST", "/cameras", "cameras.manage"],
    ["POST", "/camera-recordings/id/playback", "cameras.recordings.read"],
    ["DELETE", "/cameras/id/live-session/session", "cameras.live"]]) {
    let passed = false;
    enforceAdministrativePermission({ method, path, auth: { role: "STAFF", permissions: [permission], scope: { mode: "ALL" } } },
      { status() { throw new Error("permission should pass"); } }, () => { passed = true; });
    assert.equal(passed, true);
  }
});

test("playback rejects expired recordings before asking storage for a signed URL", async () => {
  const now = new Date(), camera = { _id: id(), scopeType: "COMMON_AREA", organizationId: id(), condominiumId: id() };
  let signs = 0;
  const recording = { ...camera, cameraId: camera._id, status: "AVAILABLE", expiresAt: new Date(now.getTime() - 1), objectKey: "internal" };
  const service = new CameraInventoryService({ RecordingModel: { findById: () => ({ select() { return this; }, lean: async () => recording }) },
    storage: { presignRead: async () => { signs++; } }, now: () => now });
  service.getCamera = async () => camera;
  await assert.rejects(service.playback({}, String(id())), { code: "CAMERA_RECORDING_UNAVAILABLE" });
  assert.equal(signs, 0);
});

test("MediaControl uses configured gateway only and timeout/404-safe close", async () => {
  let request;
  const gatewayId = String(id()), media = new MediaControl({ gatewayId, whepOrigin: "https://video.example.invalid",
    controlOrigin: "http://127.0.0.1:9997", controlUser: "control", controlPassword: "x".repeat(32),
    fetchImpl: async (url, options) => { request = { url, options }; return { status: 404, ok: false }; } });
  assert.equal(media.endpoint({ gatewayId, streamId: "stream-1" }), "https://video.example.invalid/stream-1/whep");
  assert.throws(() => media.endpoint({ gatewayId: String(id()), streamId: "stream-1" }), { code: "CAMERA_MEDIA_UNCONFIGURED" });
  await media.closeSession({ gatewayId, mediaSessionId: "session-1" });
  assert.ok(request.url.endsWith("/v3/webrtc/sessions/kick/session-1"));
  assert.equal(request.options.method, "POST"); assert.equal(request.options.redirect, "error");
});

test("camera HTTP defaults to disabled and authenticated responses keep secrets private", async (t) => {
  const app = express(); app.use(express.json());
  const authenticate = (req, _res, next) => { req.auth = { permissions: ["cameras.read"], scope: { mode: "ALL" } }; next(); };
  const service = { listCameras: async () => ({ items: [{ _id: "camera", gatewayId: "gateway", secretRef: "secret", streamId: "secret" }], nextCursor: null }) };
  app.use("/off", createCameraRouter({ authenticate, enabled: () => false, service }));
  app.use("/on", createCameraRouter({ authenticate, enabled: () => true, service }));
  const listener = await new Promise((resolve) => { const server = app.listen(0, "127.0.0.1", () => resolve(server)); });
  t.after(() => new Promise((resolve) => { listener.close(resolve); listener.closeAllConnections(); }));
  const base = `http://127.0.0.1:${listener.address().port}`;
  assert.equal((await fetch(`${base}/off/cameras`)).status, 503);
  const response = await fetch(`${base}/on/cameras?scopeType=COMMON_AREA&condominiumId=${id()}`);
  assert.equal(response.status, 200);
  const payload = await response.json(); assert.equal(payload.success, true);
  assert.ok(!JSON.stringify(payload).includes("secret"));
  assert.equal((await fetch(`${base}/on/internal/camera-media/auth`, { method: "POST", headers: { "Content-Type": "application/json" }, body: '{}' })).status, 403);
});
