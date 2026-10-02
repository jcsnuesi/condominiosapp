"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const {
  IoTService,
  cleanMetadata,
  scopeFilter,
} = require("../service/iotService");
const { MockIoTProvider } = require("../service/iotProvider");

function makeHarness({ reserveError = null } = {}) {
  const devices = new Map();
  const audit = [];
  let awsCalls = 0;
  const DeviceModel = {
    create: async ([device]) => {
      devices.set(String(device._id), { ...device, createdAt: new Date() });
      return [devices.get(String(device._id))];
    },
    findById: (id) => ({ lean: async () => devices.get(String(id)) || null }),
    findOne: () => ({ lean: async () => null }),
    updateOne: async ({ _id }, update) => {
      const device = devices.get(String(_id));
      if (!device) return { modifiedCount: 0 };
      Object.assign(device, update.$set || {});
      return { modifiedCount: 1 };
    },
  };
  const provider = {
    async createThing(input) {
      awsCalls += 1;
      return { thingName: input.thingName };
    },
    async deleteThing() {
      return { deleted: true };
    },
  };
  const service = new IoTService({
    DeviceModel,
    AuditModel: {
      create: async ([event]) => {
        audit.push(event);
        return [event];
      },
    },
    authorization: {
      canCreateDevice: async (requestActor, scope) => ({
        scopeType: "PERSONAL_RESIDENCE",
        ownerId: requestActor.account._id,
        residenceId: scope.residenceId,
      }),
      canViewDevice: async () => true,
    },
    subscriptions: {
      reserveDevice: async () => {
        if (reserveError) throw reserveError;
      },
      releaseDevice: async () => true,
    },
    provider,
    mongo: {
      Types: mongoose.Types,
      startSession: async () => ({
        withTransaction: async (callback) => callback(),
        endSession: async () => {},
      }),
    },
  });
  return {
    service,
    devices,
    audit,
    get awsCalls() {
      return awsCalls;
    },
  };
}

const actor = {
  role: "OWNER",
  account: { _id: new mongoose.Types.ObjectId() },
};
const scope = {
  scopeType: "PERSONAL_RESIDENCE",
  residenceId: new mongoose.Types.ObjectId(),
};

test("device service filters scopes explicitly and rejects unapproved metadata", () => {
  assert.deepEqual(
    scopeFilter({
      scopeType: "PERSONAL_RESIDENCE",
      ownerId: "owner",
      residenceId: "home",
    }),
    {
      scopeType: "PERSONAL_RESIDENCE",
      ownerId: "owner",
      residenceId: "home",
    }
  );
  assert.deepEqual(cleanMetadata({ model: "sensor-a" }), { model: "sensor-a" });
  assert.throws(() => cleanMetadata({ address: "private" }), {
    code: "IOT_METADATA_INVALID",
  });
});

test("device creation reserves entitlement before provider call and stores only server-owned scope", async () => {
  const harness = makeHarness();
  const device = await harness.service.createDevice(actor, scope, {
    displayName: "Water sensor",
    deviceType: "WATER_SENSOR",
    location: "Kitchen",
    metadata: { model: "sensor-v2" },
  });

  assert.equal(device.status, "ACTIVE");
  assert.equal(device.scopeType, "PERSONAL_RESIDENCE");
  assert.equal(String(device.ownerId), String(actor.account._id));
  assert.equal(String(device.residenceId), String(scope.residenceId));
  assert.equal(device.organizationId == null, true);
  assert.match(device.awsThingName, /^iot-[0-9a-f-]{36}$/i);
  assert.deepEqual(device.capabilities, ["waterDetected", "battery"]);
  assert.equal(harness.awsCalls, 1);
  assert.equal(harness.audit[0].action, "DEVICE_CREATED");
  assert.equal(harness.audit[0].success, true);
});

test("missing entitlement prevents both local device creation and AWS calls", async () => {
  const harness = makeHarness({
    reserveError: Object.assign(new Error("No plan"), {
      code: "IOT_SUBSCRIPTION_REQUIRED",
      statusCode: 403,
    }),
  });
  await assert.rejects(
    harness.service.createDevice(actor, scope, {
      displayName: "Water sensor",
      deviceType: "WATER_SENSOR",
    }),
    { code: "IOT_SUBSCRIPTION_REQUIRED" }
  );
  assert.equal(harness.devices.size, 0);
  assert.equal(harness.awsCalls, 0);
});

test("Shadow refresh sanitizes reported fields and creates typed alert events", async () => {
  const device = {
    _id: new mongoose.Types.ObjectId(),
    scopeType: "PERSONAL_RESIDENCE",
    ownerId: actor.account._id,
    residenceId: scope.residenceId,
    createdBy: actor.account._id,
    awsThingName: "iot-shadow-test",
    deviceType: "WATER_SENSOR",
    status: "ACTIVE",
    connectivity: "UNKNOWN",
    enabled: true,
    capabilities: ["waterDetected", "battery"],
    shadow: {
      reported: { waterDetected: false, battery: 60 },
      desired: {},
      delta: {},
    },
    metadata: {},
  };
  let persistedUpdate;
  let createdEvents = [];
  const timestamp = new Date("2026-10-01T00:00:00.000Z");
  const service = new IoTService({
    DeviceModel: {
      findById: () => ({ lean: async () => device }),
      updateOne: async (_filter, update) => {
        persistedUpdate = update.$set;
        return { modifiedCount: 1 };
      },
    },
    EventModel: {
      insertMany: async (events) => {
        createdEvents = events;
      },
    },
    AuditModel: { create: async () => [] },
    authorization: { canViewDevice: async () => true },
    subscriptions: {},
    provider: {
      getShadow: async () => ({
        timestamp,
        version: 3,
        state: {
          reported: {
            waterDetected: true,
            battery: 12,
            privateKey: "never-return",
          },
          desired: { privateKey: "never-return" },
          delta: {},
        },
      }),
    },
    now: () => timestamp,
  });

  const state = await service.getDeviceState(actor, String(device._id));
  assert.deepEqual(state.reported, { waterDetected: true, battery: 12 });
  assert.deepEqual(state.desired, {});
  assert.equal(persistedUpdate.connectivity, "ONLINE");
  assert.ok(
    createdEvents.some((event) => event.eventType === "water.detected")
  );
  assert.equal(JSON.stringify(state).includes("privateKey"), false);
});
