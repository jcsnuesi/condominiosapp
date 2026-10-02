"use strict";

function buildDeviceEvents(
  device,
  reported,
  connectivity,
  shadowVersion,
  occurredAt = new Date()
) {
  const previous = device.shadow?.reported || {};
  const candidates = [];
  const add = (eventType, severity, observedValue) => {
    candidates.push({
      eventType,
      severity,
      observedValue,
      eventKey: `${device._id}:${eventType}:${shadowVersion}`,
      occurredAt,
    });
  };

  if (connectivity !== "UNKNOWN" && device.connectivity !== connectivity) {
    add(
      connectivity === "ONLINE" ? "device.online" : "device.offline",
      "INFO",
      connectivity
    );
  }
  if (reported.waterDetected === true && previous.waterDetected !== true) {
    add("water.detected", "CRITICAL", true);
  }
  if (
    typeof reported.battery === "number" &&
    reported.battery < 20 &&
    (typeof previous.battery !== "number" || previous.battery >= 20)
  ) {
    add("battery.low", "WARNING", reported.battery);
  }
  if (
    typeof reported.temperature === "number" &&
    reported.temperature > 28 &&
    (typeof previous.temperature !== "number" || previous.temperature <= 28)
  ) {
    add("temperature.high", "WARNING", reported.temperature);
  }
  if (reported.lock === "UNLOCKED" && previous.lock !== "UNLOCKED") {
    add("lock.open", "INFO", "UNLOCKED");
  }
  const energyThreshold = Number(device.metadata?.energyThresholdW);
  if (
    Number.isFinite(energyThreshold) &&
    energyThreshold > 0 &&
    typeof reported.powerConsumption === "number" &&
    reported.powerConsumption > energyThreshold &&
    (typeof previous.powerConsumption !== "number" ||
      previous.powerConsumption <= energyThreshold)
  ) {
    add("energy.threshold", "WARNING", reported.powerConsumption);
  }
  return candidates;
}

module.exports = { buildDeviceEvents };
