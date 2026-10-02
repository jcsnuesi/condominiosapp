"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  IoTAutomationService,
  evaluateAutomationCondition,
} = require("../service/iotAutomationService");

function createService(source, target) {
  let savedRule;
  const service = new IoTAutomationService({
    DeviceModel: {
      findById(id) {
        return {
          lean: async () => (String(id) === "source" ? source : target),
        };
      },
    },
    RuleModel: {
      async create(rule) {
        savedRule = rule;
        return rule;
      },
    },
    authorization: {
      canViewHistory: async () => true,
      canControlDevice: async () => true,
    },
  });
  return {
    service,
    get savedRule() {
      return savedRule;
    },
  };
}

const sourceDevice = {
  _id: "source",
  scopeType: "PERSONAL_RESIDENCE",
  ownerId: "owner-1",
  residenceId: "home-1",
  deviceType: "WATER_SENSOR",
  capabilities: ["waterDetected"],
  status: "ACTIVE",
};
const targetDevice = {
  _id: "target",
  scopeType: "PERSONAL_RESIDENCE",
  ownerId: "owner-1",
  residenceId: "home-1",
  deviceType: "WATER_PUMP",
  capabilities: ["power"],
  status: "ACTIVE",
};

test("automation condition evaluator uses only fixed comparisons", () => {
  assert.equal(evaluateAutomationCondition(29, "GT", 28), true);
  assert.equal(evaluateAutomationCondition(28, "GT", 28), false);
  assert.equal(evaluateAutomationCondition("true", "EQ", true), false);
  assert.equal(evaluateAutomationCondition(5, "EXEC", 1), false);
});

test("automation draft validates same-scope devices and remains disabled", async () => {
  const harness = createService(sourceDevice, targetDevice);
  const rule = await harness.service.createDraft(
    { account: { _id: "owner-1" } },
    {
      name: "Stop pump on water",
      sourceDeviceId: "source",
      targetDeviceId: "target",
      eventType: "water.detected",
      condition: { capability: "waterDetected", operator: "EQ", value: true },
      command: { power: "OFF" },
    }
  );

  assert.equal(rule.enabled, false);
  assert.equal(rule.status, "DRAFT");
  assert.deepEqual(rule.command, { power: "OFF" });
});

test("automation draft rejects cross-scope targets", async () => {
  const otherHomeTarget = { ...targetDevice, residenceId: "home-2" };
  const harness = createService(sourceDevice, otherHomeTarget);
  await assert.rejects(
    harness.service.createDraft(
      { account: { _id: "owner-1" } },
      {
        name: "Cross home action",
        sourceDeviceId: "source",
        targetDeviceId: "target",
        eventType: "water.detected",
        condition: { capability: "waterDetected", operator: "EQ", value: true },
        command: { power: "OFF" },
      }
    ),
    { code: "IOT_RULE_CROSS_SCOPE" }
  );
});
