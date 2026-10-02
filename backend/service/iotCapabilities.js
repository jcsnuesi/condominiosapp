"use strict";

const DEVICE_CAPABILITIES = Object.freeze({
  LIGHT: Object.freeze({ capabilities: ["power"], commands: ["power"] }),
  AIR_CONDITIONER: Object.freeze({
    capabilities: ["power", "temperature"],
    commands: ["power", "temperature"],
  }),
  SMART_LOCK: Object.freeze({ capabilities: ["lock"], commands: ["lock"] }),
  WATER_SENSOR: Object.freeze({
    capabilities: ["waterDetected", "battery"],
    commands: [],
  }),
  ENERGY_METER: Object.freeze({
    capabilities: ["powerConsumption"],
    commands: [],
  }),
  WATER_PUMP: Object.freeze({ capabilities: ["power"], commands: ["power"] }),
});

function commandError(code, message) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = 422;
  return error;
}

function validateDeviceCommand(deviceType, command) {
  const definition = DEVICE_CAPABILITIES[deviceType];
  if (
    !definition ||
    !command ||
    typeof command !== "object" ||
    Array.isArray(command)
  ) {
    throw commandError("IOT_COMMAND_INVALID", "Device command is invalid");
  }

  const keys = Object.keys(command);
  if (keys.length !== 1 || !definition.commands.includes(keys[0])) {
    throw commandError(
      "IOT_COMMAND_UNSUPPORTED",
      "Command is not supported for this device type"
    );
  }

  const [capability] = keys;
  const value = command[capability];
  if (capability === "power" && ["ON", "OFF"].includes(value))
    return { [capability]: value };
  if (capability === "lock" && ["LOCK", "UNLOCK"].includes(value))
    return { [capability]: value };
  if (
    capability === "temperature" &&
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 16 &&
    value <= 30
  ) {
    return { [capability]: value };
  }

  throw commandError(
    "IOT_COMMAND_VALUE_INVALID",
    "Command value is not allowed"
  );
}

function sanitizeDeviceState(deviceType, state = {}) {
  const definition = DEVICE_CAPABILITIES[deviceType];
  if (
    !definition ||
    !state ||
    typeof state !== "object" ||
    Array.isArray(state)
  ) {
    return {};
  }
  const safeState = {};
  for (const capability of definition.capabilities) {
    const value = state[capability];
    if (capability === "power" && ["ON", "OFF"].includes(value)) {
      safeState[capability] = value;
    } else if (
      capability === "lock" &&
      ["LOCKED", "UNLOCKED"].includes(value)
    ) {
      safeState[capability] = value;
    } else if (
      capability === "temperature" &&
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 50
    ) {
      safeState[capability] = value;
    } else if (capability === "waterDetected" && typeof value === "boolean") {
      safeState[capability] = value;
    } else if (
      capability === "battery" &&
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 100
    ) {
      safeState[capability] = value;
    } else if (
      capability === "powerConsumption" &&
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 1_000_000
    ) {
      safeState[capability] = value;
    }
  }
  return safeState;
}

module.exports = {
  DEVICE_CAPABILITIES,
  validateDeviceCommand,
  sanitizeDeviceState,
};
