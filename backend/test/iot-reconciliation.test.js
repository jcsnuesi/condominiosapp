"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  IoTReconciliationService,
  retryDelayMs,
} = require("../service/iotReconciliationService");

function makeDevice(status = "PROVISIONING") {
  return {
    _id: "device-1",
    scopeType: "PERSONAL_RESIDENCE",
    ownerId: "owner-1",
    residenceId: "home-1",
    createdBy: "owner-1",
    awsThingName: "iot-device-1",
    status,
    reconciliationAttempts: 0,
  };
}

function makeHarness(provider) {
  const updates = [];
  const audits = [];
  const releases = [];
  const service = new IoTReconciliationService({
    DeviceModel: {
      updateOne: async (filter, update) => {
        updates.push({ filter, update });
        return { modifiedCount: 1 };
      },
    },
    AuditModel: { create: async ([event]) => audits.push(event) },
    subscriptions: {
      releaseDevice: async (device) => releases.push(device._id),
    },
    provider,
    mongo: {
      startSession: async () => ({
        withTransaction: async (callback) => callback(),
        endSession: async () => {},
      }),
    },
    now: () => new Date("2026-10-01T00:00:00.000Z"),
  });
  return { service, updates, audits, releases };
}

test("reconciler creates a missing thing with backend-owned attributes", async () => {
  let createInput;
  const provider = {
    describeThing: async () => {
      const error = new Error("missing");
      error.name = "ResourceNotFoundException";
      throw error;
    },
    createThing: async (input) => {
      createInput = input;
    },
  };
  const harness = makeHarness(provider);

  assert.equal(await harness.service.reconcileOne(makeDevice()), "provisioned");
  assert.equal(createInput.attributes.deviceId, "device-1");
  assert.equal(createInput.attributes.scopeType, "PERSONAL_RESIDENCE");
  assert.equal(harness.updates[0].update.$set.status, "ACTIVE");
  assert.equal(harness.audits[0].action, "DEVICE_PROVISIONED");
});

test("reconciler refuses to adopt an AWS thing with a different device id", async () => {
  let createCalled = false;
  const harness = makeHarness({
    describeThing: async () => ({ attributes: { deviceId: "foreign-device" } }),
    createThing: async () => {
      createCalled = true;
    },
  });

  assert.equal(await harness.service.reconcileOne(makeDevice()), "failed");
  assert.equal(createCalled, false);
  assert.equal(
    harness.updates[0].update.$set.lastErrorCode,
    "AWS_IOT_THING_OWNERSHIP_MISMATCH"
  );
});

test("reconciler completes deletion and releases the reserved subscription slot", async () => {
  const harness = makeHarness({ deleteThing: async () => ({ deleted: true }) });
  assert.equal(
    await harness.service.reconcileOne(makeDevice("DELETING")),
    "deleted"
  );
  assert.deepEqual(harness.releases, ["device-1"]);
  assert.equal(harness.updates[0].update.$set.status, "DELETED");
});

test("reconciliation backoff is bounded", () => {
  assert.equal(retryDelayMs(1), 30_000);
  assert.equal(retryDelayMs(8), 60 * 60 * 1000);
});
