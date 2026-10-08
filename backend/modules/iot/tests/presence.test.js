"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { IoTPresenceService } = require("../application/presenceService");
const { startIoTPresenceJob } = require("../../../service/iotPresenceJob");

test("presence sweep expires once independently of UI and uses a conditional last-report write", async () => {
  const device = { _id: "device", gatewayId: "gateway", scopeType: "COMMON_AREA", organizationId: "org", condominiumId: "condo",
    lastReportedAt: new Date("2026-10-07T11:50:00.000Z"), connectivity: "ONLINE" };
  const events = [];
  let filter, closed = 0;
  const service = new IoTPresenceService({
    DeviceModel: {
      find: () => ({ sort() { return this; }, limit() { return this; }, lean: async () => device.connectivity === "ONLINE" ? [device] : [] }),
      updateOne: async (where, { $set }) => { filter = where; device.connectivity = $set.connectivity; return { modifiedCount: 1 }; },
    },
    EventModel: { create: async ([event]) => { events.push(event); } },
    mongo: { startSession: async () => ({ withTransaction: async (callback) => callback(), endSession: async () => { closed++; } }) },
    activeContext: async () => true, now: () => new Date("2026-10-07T12:00:00.000Z"),
  });
  assert.deepEqual(await service.expirePresence(), { scanned: 1, changed: 1 });
  assert.equal(filter.lastReportedAt, device.lastReportedAt);
  assert.equal(events[0].eventType, "device.offline");
  assert.equal(events.length, 1);
  assert.deepEqual(await service.expirePresence(), { scanned: 0, changed: 0 });
  assert.equal(closed, 1);
});

test("a report received after candidate selection prevents an offline event", async () => {
  let eventWrites = 0;
  const service = new IoTPresenceService({
    DeviceModel: { find: () => ({ sort() { return this; }, limit() { return this; }, lean: async () => [{ _id: "device" }] }), updateOne: async () => ({ modifiedCount: 0 }) },
    EventModel: { create: async () => { eventWrites++; } },
    mongo: { startSession: async () => ({ withTransaction: async (callback) => callback(), endSession: async () => {} }) },
    activeContext: async () => true,
  });
  assert.equal((await service.expirePresence()).changed, 0);
  assert.equal(eventWrites, 0);
});

test("presence scheduling is disabled by the flag and overlapping runs are skipped", async () => {
  let callback, resolveRun, runs = 0;
  assert.equal(startIoTPresenceJob({ enabled: false, schedule: () => { throw new Error("must not schedule"); } }), null);
  startIoTPresenceJob({ enabled: true, schedule: (fn, ms) => { callback = fn; assert.equal(ms, 60000); return { unref() {} }; },
    service: { expirePresence: async () => { runs++; await new Promise((resolve) => { resolveRun = resolve; }); } } });
  const first = callback();
  await callback();
  assert.equal(runs, 1);
  resolveRun(); await first;
});
