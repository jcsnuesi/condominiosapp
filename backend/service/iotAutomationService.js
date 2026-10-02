"use strict";

const IoTDevice = require("../models/iotDevice");
const IoTAutomationRule = require("../models/iotAutomationRule");
const { IoTAuthorizationService, notFound } = require("./iotAuthorization");
const { validateDeviceCommand } = require("./iotCapabilities");

const EVENT_CAPABILITY = Object.freeze({
  "water.detected": "waterDetected",
  "battery.low": "battery",
  "temperature.high": "temperature",
  "lock.open": "lock",
  "energy.threshold": "powerConsumption",
});

function ruleError(code, message, statusCode = 422) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function sameScope(left, right) {
  if (left.scopeType !== right.scopeType) return false;
  if (left.scopeType === "PERSONAL_RESIDENCE") {
    return (
      String(left.ownerId) === String(right.ownerId) &&
      String(left.residenceId) === String(right.residenceId)
    );
  }
  if (left.scopeType === "CONDOMINIUM_UNIT") {
    return (
      String(left.organizationId) === String(right.organizationId) &&
      String(left.condominiumId) === String(right.condominiumId) &&
      String(left.unitId) === String(right.unitId)
    );
  }
  return (
    String(left.organizationId) === String(right.organizationId) &&
    String(left.condominiumId) === String(right.condominiumId)
  );
}

function evaluateAutomationCondition(actual, operator, expected) {
  switch (operator) {
    case "EQ":
      return actual === expected;
    case "NE":
      return actual !== expected;
    case "GT":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual > expected
      );
    case "GTE":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual >= expected
      );
    case "LT":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual < expected
      );
    case "LTE":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual <= expected
      );
    default:
      return false;
  }
}

class IoTAutomationService {
  constructor({
    DeviceModel = IoTDevice,
    RuleModel = IoTAutomationRule,
    authorization = new IoTAuthorizationService(),
  } = {}) {
    this.DeviceModel = DeviceModel;
    this.RuleModel = RuleModel;
    this.authorization = authorization;
  }

  async createDraft(actor, input) {
    const sourceDevice = await this.DeviceModel.findById(
      input.sourceDeviceId
    ).lean();
    const targetDevice = await this.DeviceModel.findById(
      input.targetDeviceId
    ).lean();
    if (
      !sourceDevice ||
      !targetDevice ||
      sourceDevice.status !== "ACTIVE" ||
      targetDevice.status !== "ACTIVE"
    )
      throw notFound();

    await this.authorization.canViewHistory(actor, sourceDevice);
    await this.authorization.canControlDevice(actor, targetDevice);
    if (!sameScope(sourceDevice, targetDevice)) {
      throw ruleError(
        "IOT_RULE_CROSS_SCOPE",
        "Automation source and target must belong to the same context",
        403
      );
    }
    if (EVENT_CAPABILITY[input.eventType] !== input.condition?.capability) {
      throw ruleError(
        "IOT_RULE_TRIGGER_MISMATCH",
        "Condition capability does not match the selected event"
      );
    }
    if (!sourceDevice.capabilities.includes(input.condition.capability)) {
      throw ruleError(
        "IOT_RULE_CAPABILITY_UNSUPPORTED",
        "Source device does not report this capability"
      );
    }
    const command = validateDeviceCommand(
      targetDevice.deviceType,
      input.command
    );
    const name = String(input.name || "").trim();
    if (!name || name.length > 100)
      throw ruleError("IOT_RULE_NAME_INVALID", "Rule name is required");

    const rule = await this.RuleModel.create({
      name,
      scopeType: sourceDevice.scopeType,
      organizationId: sourceDevice.organizationId || null,
      condominiumId: sourceDevice.condominiumId || null,
      unitId: sourceDevice.unitId || null,
      ownerId: sourceDevice.ownerId || null,
      residenceId: sourceDevice.residenceId || null,
      sourceDeviceId: sourceDevice._id,
      eventType: input.eventType,
      condition: input.condition,
      targetDeviceId: targetDevice._id,
      command,
      enabled: false,
      status: "DRAFT",
      createdBy: actor.account._id,
    });
    return rule;
  }
}

module.exports = {
  IoTAutomationService,
  evaluateAutomationCondition,
  sameScope,
  EVENT_CAPABILITY,
};
