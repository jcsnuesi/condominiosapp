"use strict";
const { validateMessageEnvelope } = require("./envelope");
const FIELDS = ["eventType", "agentVersion", "configurationVersion", "uptimeSeconds",
  "spoolCommandCount", "spoolAccountedBytes", "spoolCapacityBytes", "storageBlocked"];
const invalid = (code = "IOT_HEARTBEAT_INVALID") => Object.assign(new Error("Invalid gateway heartbeat"), { code, statusCode: 422 });

function validateHeartbeat(input, { gateway, now, maxAgeMs } = {}) {
  const envelope = validateMessageEnvelope(input, { now, maxAgeMs });
  if (!gateway || gateway.status !== "ACTIVE" || envelope.gatewayId !== String(gateway._id) ||
    envelope.resourceId !== String(gateway._id)) throw invalid("IOT_BINDING_MISMATCH");
  // Gateway health contract v1 is independent of device profile/configuration versions.
  if (envelope.profileVersion !== 1) throw invalid();
  const payload = envelope.payload;
  if (Object.keys(payload).length !== FIELDS.length || Object.keys(payload).some((key) => !FIELDS.includes(key)) ||
    payload.eventType !== "gateway.heartbeat" || typeof payload.agentVersion !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9._+-]{0,79}$/.test(payload.agentVersion) || typeof payload.storageBlocked !== "boolean") throw invalid();
  for (const field of ["configurationVersion", "uptimeSeconds", "spoolCommandCount", "spoolAccountedBytes", "spoolCapacityBytes"])
    if (!Number.isSafeInteger(payload[field]) || payload[field] < (["configurationVersion", "spoolCapacityBytes"].includes(field) ? 1 : 0)) throw invalid();
  return envelope;
}
module.exports = { validateHeartbeat };
