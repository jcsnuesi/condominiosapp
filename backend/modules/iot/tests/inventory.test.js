"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { IoTInventoryService, scopeInput, pageInput } = require("../application/inventoryService");
const { IoTAuthorizationService } = require("../../../service/iotAuthorization");
const { enforceAdministrativePermission } = require("../../../middleware/organizationAuth");
const id = () => new mongoose.Types.ObjectId();
const query = (value) => ({ select() { return this; }, session() { return this; }, lean: async () => value });

function harness() {
  const actor = { role: "OWNER", account: { _id: id() }, permissions: ["iot.create", "iot.read", "iot.update"] };
  const scope = { scopeType: "PERSONAL_RESIDENCE", ownerId: actor.account._id, residenceId: id() };
  const input = { scope: { scopeType: scope.scopeType, residenceId: String(scope.residenceId) }, displayName: "Pilot", idempotencyKey: "registration-1" };
  const gateways = [], mappings = [], audits = [];
  let closed = 0, failAudit = false;
  const service = new IoTInventoryService({
    GatewayModel: {
      findOne: () => query(gateways[0] || null),
      create: async ([item]) => { const gateway = { ...item, _id: id() }; gateways.push(gateway); return [gateway]; },
    },
    MappingModel: { create: async ([item]) => { mappings.push(item); return [item]; } },
    AuditModel: { create: async ([item]) => { if (failAudit) throw new Error("audit unavailable"); audits.push(item); return [item]; } },
    authorization: { canCreateDevice: async () => scope },
    mongo: { startSession: async () => ({
      withTransaction: async (callback) => {
        const counts = [gateways.length, mappings.length, audits.length];
        try { await callback(); } catch (error) {
          gateways.length = counts[0]; mappings.length = counts[1]; audits.length = counts[2]; throw error;
        }
      },
      endSession: async () => { closed++; },
    }) },
  });
  return { service, actor, scope, input, gateways, mappings, audits, failAudit: () => { failAudit = true; }, get closed() { return closed; } };
}

test("gateway registration persists pending mapping and audit atomically and retries do not duplicate", async () => {
  const h = harness();
  const gateway = await h.service.createGateway(h.actor, h.input);
  assert.equal(gateway.status, "PROVISIONING");
  assert.match(gateway.awsThingName, /^gateway-/);
  assert.equal(h.mappings[0].status, "PENDING");
  assert.equal(h.audits[0].action, "GATEWAY_REGISTERED");
  const retry = await h.service.createGateway(h.actor, h.input);
  assert.equal(retry._id, gateway._id);
  assert.equal(h.gateways.length, 1);
  assert.equal(h.audits.length, 1);
  await assert.rejects(h.service.createGateway(h.actor, { ...h.input, displayName: "Other" }), { code: "IOT_IDEMPOTENCY_MISMATCH" });
  h.scope.residenceId = id();
  await assert.rejects(h.service.createGateway(h.actor, h.input), { code: "IOT_IDEMPOTENCY_MISMATCH" });
  assert.equal(h.closed, 1);
});

test("audit failure aborts registration and closes the transaction session", async () => {
  const h = harness();
  h.failAudit();
  await assert.rejects(h.service.createGateway(h.actor, h.input), /audit unavailable/);
  assert.equal(h.gateways.length, 0);
  assert.equal(h.mappings.length, 0);
  assert.equal(h.closed, 1);
});

test("public inventory inputs cannot select tenant IDs, cloud status or unbounded pages", async () => {
  const h = harness();
  for (const patch of [{ organizationId: String(id()) }, { awsThingName: "foreign" }, { status: "ACTIVE" }]) {
    await assert.rejects(h.service.createGateway(h.actor, { ...h.input, ...patch }), { code: "IOT_INPUT_INVALID" });
  }
  assert.throws(() => scopeInput({ ...h.input.scope, ownerId: String(id()) }));
  assert.throws(() => scopeInput({ scopeType: "COMMON_AREA", condominiumId: { $ne: null } }));
  assert.throws(() => pageInput({ limit: 10000 }));
  assert.equal(h.gateways.length, 0);
});

test("persisted gateway is hidden from a different personal Owner and administrative ALL", async () => {
  const ownerId = id(), residenceId = id();
  const gateway = { _id: id(), scopeType: "PERSONAL_RESIDENCE", ownerId, residenceId };
  const service = new IoTInventoryService({ GatewayModel: { findById: () => query(gateway) }, authorization: new IoTAuthorizationService() });
  const own = { role: "OWNER", account: { _id: ownerId, propertyDetails: [{ _id: residenceId, contextType: "PERSONAL_RESIDENCE" }] }, permissions: ["iot.read"] };
  assert.equal(await service.getGateway(own, String(gateway._id)), gateway);
  await assert.rejects(service.getGateway({ ...own, account: { ...own.account, _id: id() } }, String(gateway._id)), { code: "IOT_NOT_FOUND" });
  await assert.rejects(service.getGateway({ role: "ADMIN", permissions: ["iot.read"], scope: { mode: "ALL" } }, String(gateway._id)), { code: "IOT_NOT_FOUND" });
});

test("binding rejects a gateway from a different context before writing", async () => {
  const device = { _id: id(), status: "ACTIVE", scopeType: "PERSONAL_RESIDENCE", ownerId: id(), residenceId: id() };
  const gateway = { ...device, _id: id(), residenceId: id() };
  const service = new IoTInventoryService({
    DeviceModel: { findById: () => query(device) }, GatewayModel: { findById: () => query(gateway) },
    authorization: { canUpdateDevice: async () => true, assertDevicePermission: async () => true },
    mongo: { startSession: async () => { throw new Error("must not write"); } },
  });
  await assert.rejects(service.bindDevice({}, String(device._id), { gatewayId: String(gateway._id), profileId: String(id()), bindingAddress: "sensor-1" }), { code: "IOT_BINDING_MISMATCH" });
});

test("command lookup rechecks its device context and never trusts command ownership alone", async () => {
  const device = { _id: id(), status: "ACTIVE", scopeType: "COMMON_AREA", organizationId: id(), condominiumId: id() };
  const command = { ...device, commandId: "cmd-result", deviceId: device._id, condominiumId: id() };
  const service = new IoTInventoryService({ CommandModel: { findOne: () => query(command) }, DeviceModel: { findById: () => query(device) } });
  await assert.rejects(service.getCommand({ permissions: ["iot.history"] }, command.commandId), { code: "IOT_NOT_FOUND" });
});

test("delegated staff routes resolve IoT before condominium names and command lookup requires history", () => {
  function check(path, method, permissions) {
    let allowed = false;
    const response = { status() { return this; }, send() {} };
    enforceAdministrativePermission({ path, method, auth: { role: "STAFF", permissions, scope: { mode: "ALL" } } }, response, () => { allowed = true; });
    return allowed;
  }
  assert.equal(check("/iot/condominiums/abc/common-area/devices", "GET", ["iot.read"]), true);
  assert.equal(check("/iot/commands/cmd-1", "GET", ["iot.history"]), true);
  assert.equal(check("/iot/commands/cmd-1", "GET", ["iot.read"]), false);
});
