"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { cameraSetup } = require("../domain/setup");
const { CameraConnectionVault } = require("../infrastructure/connectionVault");
const { cameraResponse } = require("../api");
const { CameraInventoryService } = require("../application/inventoryService");
const input = () => ({ manufacturer: "Any vendor", model: "Test model", firmware: "", sourceKind: "DVR_NVR", channel: 2,
  motionDeclaration: "UNKNOWN", connection: { host: "192.168.10.20", port: 554, path: "/channel/2", username: "local", password: "local-only-p@ss" } });
test("guided setup validates local RTSP sources independently of brand and events", () => {
  const setup = cameraSetup(input());
  const url = new URL(setup.rtspSource);
  assert.equal(decodeURIComponent(url.password), input().connection.password);
  assert.equal(setup.metadata.motionDeclaration, "UNKNOWN");
  for (const host of ["127.0.0.1", "169.254.169.254", "8.8.8.8", "camera.example.invalid", "192.168.1.999", "[::1]"])
    assert.throws(() => cameraSetup({ ...input(), connection: { ...input().connection, host } }), { code: "CAMERA_SETUP_INVALID" });
  for (const path of ["//other/path", "/video#fragment", "/user@host", "/new\nline"])
    assert.throws(() => cameraSetup({ ...input(), connection: { ...input().connection, path } }), { code: "CAMERA_SETUP_INVALID" });
  assert.throws(() => cameraSetup({ ...input(), model: "" }), { code: "CAMERA_SETUP_INVALID" });
  assert.throws(() => cameraSetup({ ...input(), motionDeclaration: "CONFIRMED" }), { code: "CAMERA_SETUP_INVALID" });
});
test("connection encryption binds credentials to one camera and never exposes them in its DTO", () => {
  const vault = new CameraConnectionVault(Buffer.alloc(32, 7).toString("base64"));
  const value = cameraSetup(input()), cameraId = "a".repeat(24), sealed = vault.seal(cameraId, value.rtspSource);
  assert.ok(!sealed.includes("local-only")); assert.equal(vault.open(cameraId, sealed), value.rtspSource);
  assert.notEqual(vault.seal(cameraId, value.rtspSource), sealed);
  assert.throws(() => vault.open("b".repeat(24), sealed), { code: "CAMERA_CONNECTION_UNAVAILABLE" });
  assert.throws(() => new CameraConnectionVault("short"), { code: "CAMERA_SETUP_UNCONFIGURED" });
  const dto = cameraResponse({ _id: cameraId, gatewayId: "b".repeat(24), equipment: value.metadata, sealedConnection: sealed,
    setupFingerprint: vault.fingerprint(value), rtspSource: value.rtspSource, password: input().connection.password });
  const serialized = JSON.stringify(dto);
  for (const secret of ["sealedConnection", "setupFingerprint", "rtspSource", "local-only", "192.168.10.20"])
    assert.ok(!serialized.includes(secret));
  assert.equal(dto.equipment.model, "Test model"); assert.equal(dto.motionStatus, "UNVERIFIED");
});
test("an online stream with an unsupported or unknown video codec is not activated", async () => {
  for (const videoCodec of ["H265", null]) {
    const service = new CameraInventoryService({ media: { inspectPath: async () => ({ ready: true, videoCodec }) } });
    service.getCamera = async () => ({ status: "PROVISIONING" });
    await assert.rejects(service.activateCamera({}, "camera"), { code: "CAMERA_CODEC_UNSUPPORTED" });
  }
});
