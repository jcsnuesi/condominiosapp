"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { IoTIngestionService } = require("../application/ingestionService");
const { IoTService } = require("../../../service/iotService");
const Inbox = require("../../../models/iotIntegrationInbox");
const id = () => new mongoose.Types.ObjectId();
const query = (get) => ({ session() { return this; }, lean: async () => get() });

function harness() {
  let time = new Date("2026-10-07T12:00:00.000Z");
  const context = { scopeType: "COMMON_AREA", organizationId: id(), condominiumId: id() };
  const gateway = { ...context, _id: id(), status: "ACTIVE", awsThingName: "authenticated-gateway", adapters: ["ZIGBEE"], ingestionRevision: 0 };
  const profile = { _id: id(), version: 1, protocol: "ZIGBEE", certification: "SUPPORTED", deviceTypes: ["WATER_SENSOR"], stateFields: [{ name: "waterDetected", type: "boolean" }, { name: "battery", type: "number", min: 0, max: 100 }] };
  const device = { ...context, _id: id(), gatewayId: gateway._id, profileId: profile._id, profileVersion: 1,
    status: "ACTIVE", enabled: true, protocol: "ZIGBEE", deviceType: "WATER_SENSOR", connectivity: "UNKNOWN",
    ingestion: { sequence: null }, shadow: { reported: { waterDetected: false, battery: 80 }, version: 5 } };
  const mapping = { ...context, resourceId: gateway._id, resourceType: "GATEWAY", integration: "AWS", status: "SYNCED", externalId: gateway.awsThingName };
  const receipts = new Map(), events = [];
  let failEvents = false, failCursor = false, activeContext = true, closed = 0;
  const service = new IoTIngestionService({
    GatewayModel: {
      findOne: (where) => query(() => gateway.awsThingName === where.awsThingName && gateway.status === where.status ? gateway : null),
      updateOne: async () => { gateway.ingestionRevision++; return { modifiedCount: 1 }; },
    },
    DeviceModel: { findById: (deviceId) => query(() => String(device._id) === deviceId ? device : null), updateOne: async (_where, { $set }) => {
      if (failCursor) return { modifiedCount: 0 };
      for (const [key, value] of Object.entries($set)) {
        if (key.startsWith("shadow.")) device.shadow[key.slice(7)] = value; else device[key] = value;
      }
      return { modifiedCount: 1 };
    } },
    ProfileModel: { findById: () => query(() => profile) },
    MappingModel: { findOne: () => query(() => mapping.status === "SYNCED" ? mapping : null) },
    InboxModel: { findOne: ({ messageId }) => query(() => receipts.get(messageId) || null), create: async ([receipt]) => {
      if (receipts.has(receipt.messageId)) throw Object.assign(new Error("duplicate"), { code: 11000 });
      receipts.set(receipt.messageId, receipt);
    } },
    EventModel: { insertMany: async (items) => { if (failEvents) throw new Error("events unavailable"); events.push(...items); } },
    mongo: { startSession: async () => ({ withTransaction: async (callback) => {
      const snapshot = structuredClone(device), revision = gateway.ingestionRevision, length = events.length, before = new Map(receipts);
      try { await callback(); } catch (error) {
        // Keep ObjectIds in the fixture intact when rolling back the mutable fields.
        device.shadow = snapshot.shadow; device.ingestion = snapshot.ingestion;
        for (const key of ["lastSeen", "lastReportedAt", "connectivity"]) {
          if (snapshot[key] === undefined) delete device[key]; else device[key] = snapshot[key];
        }
        gateway.ingestionRevision = revision; events.length = length;
        receipts.clear(); for (const [key, value] of before) receipts.set(key, value);
        throw error;
      }
    }, endSession: async () => { closed++; } }) },
    activeContext: async () => activeContext, now: () => time, enabled: () => true,
  });
  const message = (patch = {}) => ({ schemaVersion: 1, messageId: "state-1", gatewayId: String(gateway._id), resourceId: String(device._id),
    sequence: 1, profileVersion: 1, occurredAt: time.toISOString(), payload: { waterDetected: true }, ...patch });
  return { service, device, gateway, mapping, receipts, events, profile, message,
    identity: { authenticatedThingName: gateway.awsThingName }, advance: (ms) => { time = new Date(time.getTime() + ms); },
    failEvents: () => { failEvents = true; }, failCursor: () => { failCursor = true; }, revokeContext: () => { activeContext = false; }, get closed() { return closed; } };
}

test("authenticated state updates summary, preserves partial fields and persists business alerts without UI reads", async () => {
  const h = harness();
  const result = await h.service.ingestState(h.identity, h.message());
  assert.equal(result.status, "APPLIED");
  assert.equal(h.device.shadow.reported.waterDetected, true);
  assert.equal(h.device.shadow.reported.battery, 80);
  assert.equal(h.device.shadow.version, 5);
  assert.equal(h.device.ingestion.sequence, 1);
  assert.equal(h.device.connectivity, "ONLINE");
  assert.ok(h.events.some((item) => item.eventType === "water.detected"));
  const receipt = h.receipts.get("state-1");
  assert.equal("payload" in receipt, false);
  assert.equal(receipt.contentHash.length, 64);
  assert.equal(h.closed, 1);
});

test("same message is idempotent even after freshness timeout; changing its content is a conflict", async () => {
  const h = harness(), message = h.message();
  await h.service.ingestState(h.identity, message);
  const count = h.events.length;
  h.advance(360000);
  assert.equal((await h.service.ingestState(h.identity, message)).duplicate, true);
  assert.equal(h.events.length, count);
  assert.equal(h.gateway.ingestionRevision, 1);
  await assert.rejects(h.service.ingestState(h.identity, { ...message, payload: { waterDetected: false } }), { code: "IOT_MESSAGE_CONFLICT" });
  await assert.rejects(h.service.ingestState(h.identity, { ...message, messageId: "unknown-old" }), { code: "IOT_EVENT_STALE" });
});

test("sequence and timestamp ordering prevent state rollback and repeated physical alarm transitions", async () => {
  const h = harness();
  await h.service.ingestState(h.identity, h.message({ sequence: 3 }));
  const count = h.events.length;
  const older = await h.service.ingestState(h.identity, h.message({ messageId: "state-old", sequence: 2, payload: { waterDetected: false } }));
  assert.equal(older.status, "IGNORED_OUT_OF_ORDER");
  assert.equal(h.device.shadow.reported.waterDetected, true);
  assert.equal(h.events.length, count);
  const backdated = await h.service.ingestState(h.identity, h.message({ messageId: "state-backdated", sequence: 4, occurredAt: "2026-10-07T11:59:59.000Z", payload: { waterDetected: false } }));
  assert.equal(backdated.status, "IGNORED_OUT_OF_ORDER");
  assert.equal(h.device.ingestion.sequence, 3);
});

test("identity, mapping, context, profile and payload failures persist no receipts or events", async () => {
  const cases = [
    (h) => { h.identity.authenticatedThingName = "foreign-gateway"; },
    (h) => { h.mapping.status = "REVOKED"; },
    (h) => { h.mapping.condominiumId = id(); },
    (h) => { h.gateway.status = "REVOKED"; },
    (h) => { h.profile.certification = "UNSUPPORTED"; },
    (h) => { h.revokeContext(); },
    (h) => { h.device.enabled = false; },
  ];
  for (const alter of cases) {
    const h = harness(); alter(h);
    await assert.rejects(h.service.ingestState(h.identity, h.message()));
    assert.equal(h.receipts.size, 0); assert.equal(h.events.length, 0);
  }
  const h = harness();
  for (const patch of [{ payload: { battery: 101 } }, { payload: { secret: "forged" } }, { organizationId: String(id()) }, { payload: {} }]) {
    await assert.rejects(h.service.ingestState(h.identity, h.message(patch)));
  }
  assert.equal(h.receipts.size, 0);
});

test("event failure or conditional-write conflict aborts summary and receipt together", async () => {
  for (const fail of ["failEvents", "failCursor"]) {
    const h = harness(); h[fail]();
    await assert.rejects(h.service.ingestState(h.identity, h.message()));
    assert.equal(h.device.shadow.reported.waterDetected, false);
    assert.equal(h.device.ingestion.sequence, null);
    assert.equal(h.gateway.ingestionRevision, 0);
    assert.equal(h.receipts.size, 0);
    assert.equal(h.closed, 1);
  }
});

test("inbox schema enforces context and provides a durable unique receipt index", async () => {
  const h = harness();
  await h.service.ingestState(h.identity, h.message());
  const receipt = new Inbox(h.receipts.get("state-1"));
  await receipt.validate();
  receipt.ownerId = id();
  await assert.rejects(receipt.validate());
  assert.ok(Inbox.schema.indexes().some(([keys, options]) => keys.gatewayId && keys.messageId && options.unique));
});

test("gateway device reads use persisted state and legacy Shadow control cannot bypass future dispatch", async () => {
  const h = harness();
  const service = new IoTService({ DeviceModel: { findById: () => ({ lean: async () => h.device }) },
    authorization: { canViewDevice: async () => true, canControlDevice: async () => true },
    provider: { getShadow: async () => { throw new Error("must not poll"); }, updateShadow: async () => { throw new Error("must not dispatch"); } },
  });
  assert.equal((await service.getDeviceState({}, String(h.device._id))).reported.battery, 80);
  await assert.rejects(service.controlDevice({}, String(h.device._id), { waterDetected: false }), { code: "IOT_GATEWAY_COMMANDS_UNAVAILABLE" });
});

test("ingestion stays disabled by default", async () => {
  const service = new IoTIngestionService({ enabled: () => false });
  await assert.rejects(service.ingestState({}, {}), { code: "IOT_INGESTION_DISABLED" });
});
