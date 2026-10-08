"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateHeartbeat } = require("../domain/heartbeat");
const { heartbeatHash, IoTHeartbeatService } = require("../application/heartbeatService");
const { gatewayResponse } = require("../api");
const now = new Date("2026-10-07T12:00:00.000Z");
const gateway = { _id: "012345678901234567890123", status: "ACTIVE" };
function message() {
  return { schemaVersion: 1, messageId: "heartbeat-1", gatewayId: gateway._id, resourceId: gateway._id,
    profileVersion: 1, sequence: 1, occurredAt: now.toISOString(), payload: {
      eventType: "gateway.heartbeat", agentVersion: "0.1.0", configurationVersion: 1,
      uptimeSeconds: 60, spoolCommandCount: 1, spoolAccountedBytes: 65536, spoolCapacityBytes: 67108864,
      storageBlocked: false,
    } };
}
test("heartbeat contract is strict, bounded and tied to the authenticated gateway resource", () => {
  const input = message();
  assert.equal(validateHeartbeat(input, { gateway, now }).payload.uptimeSeconds, 60);
  for (const payload of [{ ...input.payload, token: "secret" }, { ...input.payload, uptimeSeconds: -1 },
    { ...input.payload, configurationVersion: 0 }, { ...input.payload, storageBlocked: "false" },
    { ...input.payload, spoolCommandCount: Number.MAX_SAFE_INTEGER + 1 }])
    assert.throws(() => validateHeartbeat({ ...input, payload }, { gateway, now }), { code: "IOT_HEARTBEAT_INVALID" });
  assert.throws(() => validateHeartbeat({ ...input, resourceId: "other" }, { gateway, now }), { code: "IOT_BINDING_MISMATCH" });
  assert.throws(() => validateHeartbeat(input, { gateway: { ...gateway, status: "REVOKED" }, now }), { code: "IOT_BINDING_MISMATCH" });
  assert.throws(() => validateHeartbeat({ ...input, profileVersion: 2 }, { gateway, now }), { code: "IOT_HEARTBEAT_INVALID" });
});
test("heartbeat freshness and deterministic hash retain original content on replay", () => {
  const input = message();
  assert.throws(() => validateHeartbeat(input, { gateway, now: new Date(now.getTime() + 300001) }), { code: "IOT_EVENT_STALE" });
  assert.throws(() => validateHeartbeat(input, { gateway, now: new Date(now.getTime() - 1) }), { code: "IOT_EVENT_STALE" });
  assert.equal(heartbeatHash(input), heartbeatHash({ ...input, payload: Object.fromEntries(Object.entries(input.payload).reverse()) }));
  assert.notEqual(heartbeatHash(input), heartbeatHash({ ...input, sequence: 2 }));
});
test("heartbeat ingestion is disabled by default and rejects identity before database access", async () => {
  await assert.rejects(new IoTHeartbeatService({ enabled: () => false }).ingestHeartbeat({}, message()), { code: "IOT_INGESTION_DISABLED" });
  await assert.rejects(new IoTHeartbeatService({ enabled: () => true }).ingestHeartbeat({}, message()), { code: "IOT_INGESTION_IDENTITY_INVALID" });
});
test("gateway DTO computes freshness and only exposes allowlisted health", () => {
  const dto = gatewayResponse({ ...gateway, lastHeartbeatAt: new Date(Date.now() - 360000),
    health: { spoolCommandCount: 1, storageBlocked: true, secret: "private" }, awsThingName: "private" });
  assert.equal(dto.connectivity, "OFFLINE");
  assert.equal(dto.health.storageBlocked, true);
  assert.ok(!Object.hasOwn(dto.health, "secret"));
  assert.ok(!Object.hasOwn(dto, "awsThingName"));
  assert.equal(gatewayResponse({ ...gateway }).connectivity, "UNKNOWN");
  assert.equal(gatewayResponse({ ...gateway, status: "REVOKED", lastHeartbeatAt: new Date() }).connectivity, "UNKNOWN");
});
