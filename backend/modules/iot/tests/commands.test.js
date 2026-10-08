"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { IoTCommandService, validateTarget } = require("../application/commandService");
const { IoTCommandDispatcher } = require("../application/commandDispatcher");

test("command service and dispatcher are disabled without activating network transports", async () => {
  await assert.rejects(new IoTCommandService({ enabled: () => false }).requestCommand({}, {}), { code: "IOT_COMMANDS_DISABLED" });
  assert.equal((await new IoTCommandDispatcher({ enabled: () => false }).dispatchOne()).status, "DISABLED");
  await assert.rejects(new IoTCommandDispatcher({ enabled: () => true }).dispatchOne(), { code: "IOT_COMMAND_TRANSPORT_MISSING" });
});

test("persistent command validation rejects transient locks and mismatched gateway bindings", () => {
  const scope = { scopeType: "COMMON_AREA", organizationId: "org", condominiumId: "condo" };
  const gateway = { ...scope, _id: "gateway", status: "ACTIVE", adapters: ["ZIGBEE"] };
  const profile = { _id: "profile", protocol: "ZIGBEE", version: 1, certification: "SUPPORTED", deviceTypes: ["LIGHT", "SMART_LOCK"],
    commandFields: [{ name: "power", type: "string", values: ["ON", "OFF"] }] };
  const device = { ...scope, gatewayId: "gateway", profileId: "profile", protocol: "ZIGBEE", profileVersion: 1, deviceType: "LIGHT", status: "ACTIVE" };
  assert.deepEqual(validateTarget(device, gateway, profile, { power: "ON" }), { power: "ON" });
  assert.throws(() => validateTarget({ ...device, deviceType: "SMART_LOCK" }, gateway, profile, { lock: "UNLOCK" }), { code: "IOT_COMMAND_UNSUPPORTED" });
  assert.throws(() => validateTarget({ ...device, gatewayId: "other" }, gateway, profile, { power: "ON" }), { code: "IOT_COMMAND_TARGET_INVALID" });
});
