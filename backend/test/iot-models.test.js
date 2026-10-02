"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const IoTDevice = require("../models/iotDevice");
const IoTSubscription = require("../models/iotSubscription");
const IoTAuditEvent = require("../models/iotAuditEvent");

const id = () => new mongoose.Types.ObjectId();

test("IoT device accepts a personal residence context without organization references", async () => {
  const device = new IoTDevice({
    displayName: "Water sensor",
    awsThingName: "iot-00000000-0000-4000-8000-000000000001",
    deviceType: "WATER_SENSOR",
    scopeType: "PERSONAL_RESIDENCE",
    ownerId: id(),
    residenceId: id(),
    createdBy: id(),
  });

  await device.validate();
  assert.equal(device.organizationId, null);
  assert.equal(device.status, "PROVISIONING");
  assert.equal(device.connectivity, "UNKNOWN");
});

test("IoT device rejects references from another scope", async () => {
  const device = new IoTDevice({
    displayName: "Water sensor",
    awsThingName: "iot-00000000-0000-4000-8000-000000000002",
    deviceType: "WATER_SENSOR",
    scopeType: "PERSONAL_RESIDENCE",
    organizationId: id(),
    ownerId: id(),
    residenceId: id(),
    createdBy: id(),
  });

  await assert.rejects(device.validate(), (error) =>
    Boolean(error.errors.scopeType)
  );
});

test("IoT device accepts a condominium unit only with tenant and stable unit references", async () => {
  const device = new IoTDevice({
    displayName: "Hall light",
    awsThingName: "iot-00000000-0000-4000-8000-000000000003",
    deviceType: "LIGHT",
    scopeType: "CONDOMINIUM_UNIT",
    organizationId: id(),
    condominiumId: id(),
    unitId: id(),
    createdBy: id(),
  });

  await device.validate();
});

test("IoT subscription rejects usage above the configured device limit", async () => {
  const subscription = new IoTSubscription({
    scopeType: "PERSONAL_RESIDENCE",
    ownerId: id(),
    residenceId: id(),
    plan: "BASIC",
    deviceLimit: 2,
    deviceUsage: 3,
    provisionedBy: id(),
  });

  await assert.rejects(subscription.validate(), (error) =>
    Boolean(error.errors.deviceUsage)
  );
});

test("IoT audit events retain an organization-free personal context", async () => {
  const event = new IoTAuditEvent({
    scopeType: "PERSONAL_RESIDENCE",
    ownerId: id(),
    residenceId: id(),
    actorId: id(),
    actorRole: "OWNER",
    action: "DEVICE_CREATED",
    success: true,
  });

  await event.validate();
  assert.equal(event.organizationId, null);
});
