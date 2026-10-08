"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { IoTInventoryService } = require("../application/inventoryService");
const id = () => new mongoose.Types.ObjectId();
const query = (value) => ({ session() { return this; }, lean: async () => value });

function harness({ existingBinding = false, concurrent = false, duplicate = false, supported = true } = {}) {
  const context = { scopeType: "COMMON_AREA", organizationId: id(), condominiumId: id() };
  const gateway = { ...context, _id: id(), status: "ACTIVE", adapters: ["ZIGBEE"] };
  const device = { ...context, _id: id(), status: "ACTIVE", deviceType: "LIGHT", gatewayId: existingBinding ? gateway._id : null, awsThingName: "keep-legacy-thing" };
  const profile = { _id: id(), protocol: "ZIGBEE", version: 2, certification: "SUPPORTED", deviceTypes: supported ? ["LIGHT"] : ["SMART_LOCK"] };
  const audits = [];
  let filter, changes, closed = false;
  const service = new IoTInventoryService({
    DeviceModel: { findById: () => query(device), updateOne: async (where, update) => {
      filter = where; changes = update.$set;
      if (duplicate) throw Object.assign(new Error("duplicate"), { code: 11000 });
      return { modifiedCount: concurrent ? 0 : 1 };
    } },
    GatewayModel: { findById: () => query(gateway), findOne: () => query(gateway) },
    ProfileModel: { findById: () => query(profile) },
    AuditModel: { create: async ([audit]) => { audits.push(audit); } },
    authorization: { canUpdateDevice: async () => true, assertDevicePermission: async () => true },
    mongo: { startSession: async () => ({ withTransaction: async (callback) => callback(), endSession: async () => { closed = true; } }) },
  });
  return { service, device, gateway, profile, audits, get filter() { return filter; }, get changes() { return changes; }, get closed() { return closed; },
    input: { gatewayId: String(gateway._id), profileId: String(profile._id), bindingAddress: "zigbee-address-1" } };
}

test("binding preserves legacy identity and audits the selected version with a conditional write", async () => {
  const h = harness();
  const result = await h.service.bindDevice({ account: { _id: id() }, role: "ADMIN" }, String(h.device._id), h.input);
  assert.equal(result.awsThingName, "keep-legacy-thing");
  assert.equal(result.profileVersion, 2);
  assert.equal(result.protocol, "ZIGBEE");
  assert.equal(h.filter.gatewayId, null);
  assert.equal("awsThingName" in h.changes, false);
  assert.equal(h.audits[0].action, "DEVICE_BOUND");
  assert.equal(h.closed, true);
});

test("existing, concurrent and duplicate-address bindings do not produce a success audit", async () => {
  for (const options of [{ existingBinding: true }, { concurrent: true }, { duplicate: true }]) {
    const h = harness(options);
    await assert.rejects(h.service.bindDevice({}, String(h.device._id), h.input), { code: "IOT_BINDING_EXISTS" });
    assert.equal(h.audits.length, 0);
  }
});

test("incompatible profile rejects binding before starting a write", async () => {
  const h = harness({ supported: false });
  await assert.rejects(h.service.bindDevice({}, String(h.device._id), h.input), { code: "IOT_PROFILE_INVALID" });
  assert.equal(h.changes, undefined);
});
