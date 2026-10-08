"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { validateEnvelope } = require("../domain/envelope");
const { validateProfilePayload } = require("../domain/profilePayload");
const { commandTransition } = require("../domain/commandLifecycle");
const { reportedTimestamp, connectivityAt } = require("../domain/freshness");
const { PERMISSIONS, STANDARD_POLICIES, EXPLICIT_PERMISSIONS } = require("../../../service/permissionCatalog");
const Gateway = require("../../../models/iotGateway");
const Profile = require("../../../models/iotDeviceProfile");
const Mapping = require("../../../models/iotIntegrationMapping");
const Command = require("../../../models/iotCommand");
const Device = require("../../../models/iotDevice");
const id = () => new mongoose.Types.ObjectId();
const now = new Date("2026-10-07T12:00:00.000Z");

function fixture(context = { scopeType: "COMMON_AREA", organizationId: id(), condominiumId: id() }) {
  const gateway = { _id: id(), ...context, status: "ACTIVE" };
  const device = { _id: id(), ...context, gatewayId: gateway._id, status: "ACTIVE", profileVersion: 1 };
  const envelope = { schemaVersion: 1, messageId: "event-1", resourceId: String(device._id), gatewayId: String(gateway._id), occurredAt: now.toISOString(), sequence: 1, profileVersion: 1, payload: { power: true } };
  return { gateway, device, envelope, options: { gateway, device, authenticatedGatewayId: gateway._id, now } };
}

test("envelope resolves two organizations, two private units and a personal Owner using persisted bindings", () => {
  const organizationId = id(), condominiumId = id();
  const contexts = [
    { scopeType: "COMMON_AREA", organizationId, condominiumId },
    { scopeType: "COMMON_AREA", organizationId: id(), condominiumId: id() },
    { scopeType: "CONDOMINIUM_UNIT", organizationId, condominiumId, unitId: id() },
    { scopeType: "CONDOMINIUM_UNIT", organizationId, condominiumId, unitId: id() },
    { scopeType: "PERSONAL_RESIDENCE", ownerId: id(), residenceId: id() },
  ];
  for (const context of contexts) {
    const { envelope, options, device } = fixture(context);
    assert.equal(validateEnvelope(envelope, options).receivedAt, now.toISOString());
    for (const foreign of contexts.filter((item) => item !== context)) {
      assert.throws(() => validateEnvelope(envelope, { ...options, device: { ...device, ...Object.fromEntries(["organizationId", "condominiumId", "unitId", "ownerId", "residenceId"].map((key) => [key, null])), ...foreign } }), { code: "IOT_BINDING_MISMATCH" });
    }
  }
});

test("envelope rejects forged identity, tenant fields, stale/future messages and unbounded payloads", () => {
  const { envelope, options } = fixture();
  for (const patch of [
    { organizationId: "forged" }, { gatewayId: String(id()) }, { sequence: -1 },
    { occurredAt: "2026-10-07T11:00:00.000Z" }, { occurredAt: "2026-10-07T12:00:01.000Z" },
    { payload: { data: "x".repeat(17000) } }, { payload: JSON.parse('{"__proto__":{}}') },
  ]) assert.throws(() => validateEnvelope({ ...envelope, ...patch }, options));
  assert.throws(() => validateEnvelope(envelope, { ...options, authenticatedGatewayId: id() }), { code: "IOT_BINDING_MISMATCH" });
  assert.throws(() => validateEnvelope(envelope, { ...options, gateway: { ...options.gateway, status: "REVOKED" } }));
});

test("profile validation allowlists commands and preserves false/zero", () => {
  const profile = { commandFields: [{ name: "power", type: "boolean" }, { name: "level", type: "number", min: 0, max: 100 }], stateFields: [] };
  assert.deepEqual(validateProfilePayload(profile, "command", { power: false, level: 0 }), { power: false, level: 0 });
  for (const payload of [{}, { open: true }, { level: 101 }, { level: NaN }, { power: "true" }]) {
    assert.throws(() => validateProfilePayload(profile, "command", payload), { code: "IOT_PROFILE_PAYLOAD_INVALID" });
  }
});

test("command receipt cannot imply execution and terminal states cannot replay", () => {
  const base = { commandId: "cmd-1", status: "DISPATCHED", expiresAt: new Date(now.getTime() + 1000) };
  assert.equal(commandTransition(base, "ACKNOWLEDGED", { now }).update.$set.status, "ACKNOWLEDGED");
  assert.throws(() => commandTransition(base, "EXECUTED", { now, evidenceRef: "sensor-1" }));
  assert.throws(() => commandTransition({ ...base, status: "ACKNOWLEDGED" }, "EXECUTED", { now }));
  const update = commandTransition({ ...base, status: "ACKNOWLEDGED" }, "EXECUTED", { now, evidenceRef: "sensor-1" });
  assert.equal(update.update.$set.evidenceRef, "sensor-1");
  assert.equal(update.filter.status, "ACKNOWLEDGED");
  assert.throws(() => commandTransition({ ...base, status: "EXECUTED" }, "DISPATCHED", { now }));
  assert.throws(() => commandTransition({ ...base, expiresAt: now }, "ACKNOWLEDGED", { now }));
  assert.equal(commandTransition({ ...base, expiresAt: now }, "EXPIRED", { now }).update.$set.status, "EXPIRED");
});

test("reported freshness excludes invalid/future timestamps and ages without UI polling", () => {
  assert.equal(reportedTimestamp({}, now), null);
  assert.equal(reportedTimestamp({ power: { timestamp: now.getTime() / 1000 + 1 } }, now), null);
  const timestamp = reportedTimestamp({ power: { timestamp: now.getTime() / 1000 } }, now);
  assert.equal(connectivityAt(timestamp, now), "ONLINE");
  assert.equal(connectivityAt(timestamp, new Date(now.getTime() + 300001)), "OFFLINE");
  assert.equal(connectivityAt(null, now), "UNKNOWN");
});

test("new sensitive permissions are excluded from existing standard policies", () => {
  for (const permission of EXPLICIT_PERMISSIONS) {
    assert.ok(PERMISSIONS.includes(permission));
    for (const policy of STANDARD_POLICIES) assert.ok(!policy.permissions.includes(permission));
  }
  assert.ok(STANDARD_POLICIES[0].permissions.includes("iot.control"));
});

test("gateway/mapping/command schemas reject mixed contexts and preserve command audit", async () => {
  const context = { scopeType: "PERSONAL_RESIDENCE", ownerId: id(), residenceId: id() };
  const gateway = new Gateway({ ...context, displayName: "Pilot", createdBy: id(), awsThingName: "pilot-gateway" });
  await gateway.validate();
  gateway.organizationId = id();
  await assert.rejects(gateway.validate());
  const mapping = new Mapping({ ...context, resourceType: "GATEWAY", resourceId: id(), integration: "THINGSBOARD" });
  await mapping.validate();
  const command = new Command({ ...context, commandId: "cmd-schema", deviceId: id(), actorId: id(), actorType: "HUMAN", profileVersion: 1, payload: { power: true }, expiresAt: new Date(Date.now() + 60000), status: "EXECUTED" });
  await assert.rejects(command.validate(), (error) => Boolean(error.errors.evidenceRef));
  assert.ok(Command.schema.indexes().every(([, options]) => options.expireAfterSeconds === undefined));
});

test("legacy AWS devices remain valid without gateway/profile and profiles reject invalid ranges", async () => {
  const device = new Device({ displayName: "Legacy", awsThingName: "legacy-1", deviceType: "LIGHT", scopeType: "COMMON_AREA", organizationId: id(), condominiumId: id(), createdBy: id() });
  await device.validate();
  assert.equal(device.protocol, "AWS_SHADOW");
  assert.equal(device.gatewayId, null);
  const profile = new Profile({ key: "light", version: 1, manufacturer: "Simulator", model: "light", protocol: "ZIGBEE", stateFields: [{ name: "level", type: "number", min: 100, max: 0 }] });
  await assert.rejects(profile.validate());
});
