"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { buildDeviceEvents } = require("../service/iotEventRules");
const IoTDeviceEvent = require("../models/iotDeviceEvent");

test("Shadow transitions generate typed alerts only for configured capabilities and thresholds", () => {
  const device = {
    _id: new mongoose.Types.ObjectId(),
    deviceType: "WATER_SENSOR",
    connectivity: "OFFLINE",
    metadata: { energyThresholdW: 800 },
    shadow: {
      reported: {
        waterDetected: false,
        battery: 60,
        temperature: 22,
        powerConsumption: 700,
        lock: "LOCKED",
      },
    },
  };
  const events = buildDeviceEvents(
    device,
    {
      waterDetected: true,
      battery: 12,
      temperature: 31,
      powerConsumption: 950,
      lock: "UNLOCKED",
    },
    "ONLINE",
    17,
    new Date("2026-10-01T12:00:00.000Z")
  );

  assert.deepEqual(events.map((event) => event.eventType).sort(), [
    "battery.low",
    "device.online",
    "energy.threshold",
    "lock.open",
    "temperature.high",
    "water.detected",
  ]);
  assert.equal(
    events.find((event) => event.eventType === "water.detected").severity,
    "CRITICAL"
  );
  assert.ok(events.every((event) => event.eventKey.includes(":17")));
});

test("Shadow events do not repeat when values stay below alert transition thresholds", () => {
  const device = {
    _id: new mongoose.Types.ObjectId(),
    connectivity: "ONLINE",
    metadata: {},
    shadow: {
      reported: {
        waterDetected: true,
        battery: 10,
        temperature: 30,
        lock: "UNLOCKED",
      },
    },
  };
  const events = buildDeviceEvents(
    device,
    { waterDetected: true, battery: 9, temperature: 32, lock: "UNLOCKED" },
    "ONLINE",
    18
  );

  assert.deepEqual(events, []);
});

test("energy threshold alerts are disabled until an explicit threshold exists", () => {
  const device = {
    _id: new mongoose.Types.ObjectId(),
    connectivity: "ONLINE",
    metadata: {},
    shadow: { reported: { powerConsumption: 900 } },
  };
  const events = buildDeviceEvents(
    device,
    { powerConsumption: 1200 },
    "ONLINE",
    19
  );
  assert.equal(
    events.some((event) => event.eventType === "energy.threshold"),
    false
  );
});

test("IoT event model rejects cross-scope references", async () => {
  const event = new IoTDeviceEvent({
    scopeType: "PERSONAL_RESIDENCE",
    organizationId: new mongoose.Types.ObjectId(),
    ownerId: new mongoose.Types.ObjectId(),
    residenceId: new mongoose.Types.ObjectId(),
    deviceId: new mongoose.Types.ObjectId(),
    eventType: "water.detected",
    severity: "CRITICAL",
    eventKey: "event-test-1",
  });

  await assert.rejects(event.validate(), (error) =>
    Boolean(error.errors.scopeType)
  );
});
