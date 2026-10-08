"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { IoTAuthorizationService } = require("../../../service/iotAuthorization");
const { IoTService } = require("../../../service/iotService");
const { simulate } = require("../simulator");
const id = () => new mongoose.Types.ObjectId();
const query = (value) => ({ select() { return this; }, lean: async () => value });

test("an otherwise valid Owner loses all device access when their persisted unit is revoked", async () => {
  const organizationId = id(), condominiumId = id(), unitId = id();
  const owner = { _id: id(), organizationId, propertyDetails: [{ addressId: condominiumId, unitId, status_property: "active" }] };
  const device = { scopeType: "CONDOMINIUM_UNIT", organizationId, condominiumId, unitId };
  const actor = { role: "OWNER", account: owner, permissions: ["iot.read", "iot.update", "iot.control", "iot.delete", "iot.history"] };
  let unitStatus = "active";
  const authorization = new IoTAuthorizationService({
    OwnerModel: { findOne: () => query(owner) },
    OrganizationModel: { findOne: () => query({ _id: organizationId }) },
    CondominiumModel: { findOne: () => query({ _id: condominiumId, units: [{ _id: unitId, status: unitStatus }] }) },
  });
  assert.equal(await authorization.canViewDevice(actor, device), true);
  unitStatus = "inactive";
  for (const action of ["canViewDevice", "canUpdateDevice", "canControlDevice", "canDeleteDevice", "canViewHistory"]) {
    await assert.rejects(authorization[action](actor, device), { code: "IOT_NOT_FOUND" });
  }
});

test("a fresh desired-only Shadow does not establish device presence", async () => {
  const now = new Date("2026-10-07T12:00:00.000Z");
  const device = { _id: id(), awsThingName: "legacy", scopeType: "PERSONAL_RESIDENCE", ownerId: id(), residenceId: id(), status: "ACTIVE", deviceType: "LIGHT", shadow: {}, connectivity: "UNKNOWN" };
  let update;
  const service = new IoTService({
    DeviceModel: { findById: () => query(device), updateOne: async (_filter, value) => { update = value.$set; } },
    EventModel: { insertMany: async () => {} },
    authorization: { canViewDevice: async () => true },
    provider: { getShadow: async () => ({ timestamp: now, version: 1, state: { desired: { power: true } } }) },
    now: () => now,
  });
  await service.getDeviceState({}, device._id);
  assert.equal(update.connectivity, "UNKNOWN");
  assert.equal(update.lastSeen, null);
  assert.equal(update.shadow.updatedAt, now);
});

test("offline simulator validates both protocols through the same contract", () => {
  assert.deepEqual(simulate().map((item) => item.protocol), ["AWS_SHADOW", "ZIGBEE"]);
});
