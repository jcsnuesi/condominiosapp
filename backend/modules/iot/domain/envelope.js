"use strict";

const { sameContext } = require("./context");
const FIELDS = new Set(["schemaVersion", "messageId", "resourceId", "gatewayId", "occurredAt", "sequence", "profileVersion", "payload"]);
const TOKEN = /^[A-Za-z0-9_-]{1,128}$/;

function invalid(code = "IOT_ENVELOPE_INVALID") {
  return Object.assign(new Error("Invalid IoT message or persisted binding"), { code, statusCode: 422 });
}

// binding is resolved by the trusted consumer using its authenticated identity,
// never by reading an organization or certificate identifier from the message.
function validateMessageEnvelope(input, { now = new Date(), maxAgeMs = 300000 } = {}) {
  if (!input || Object.getPrototypeOf(input) !== Object.prototype ||
      Object.keys(input).some((key) => !FIELDS.has(key)) || input.schemaVersion !== 1 ||
      ![input.messageId, input.resourceId, input.gatewayId].every((value) => typeof value === "string" && TOKEN.test(value)) ||
      !Number.isSafeInteger(input.sequence) || input.sequence < 0 ||
      !Number.isSafeInteger(input.profileVersion) || input.profileVersion < 1 ||
      typeof input.occurredAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(input.occurredAt) ||
      !input.payload || Object.getPrototypeOf(input.payload) !== Object.prototype) throw invalid();
  let payload;
  try { payload = JSON.stringify(input.payload); } catch { throw invalid(); }
  if (Buffer.byteLength(payload) > 16384 || /"(?:__proto__|constructor|prototype)"\s*:/.test(payload)) throw invalid();
  const occurredAt = new Date(input.occurredAt);
  if (!Number.isFinite(occurredAt.getTime()) || occurredAt > now || now - occurredAt > maxAgeMs) throw invalid("IOT_EVENT_STALE");
  return { ...input, payload: JSON.parse(payload), receivedAt: now.toISOString() };
}

function validateEnvelope(input, { gateway, device, authenticatedGatewayId, now = new Date(), maxAgeMs = 300000 } = {}) {
  const envelope = validateMessageEnvelope(input, { now, maxAgeMs });
  if (!gateway || !device || !authenticatedGatewayId ||
      String(gateway._id) !== String(authenticatedGatewayId) ||
      input.gatewayId !== String(gateway._id) || input.resourceId !== String(device._id) ||
      String(device.gatewayId) !== String(gateway._id) || !sameContext(gateway, device) ||
      gateway.status !== "ACTIVE" || device.status !== "ACTIVE" || device.enabled === false ||
      device.profileVersion !== input.profileVersion) throw invalid("IOT_BINDING_MISMATCH");
  return envelope;
}

module.exports = { validateEnvelope, validateMessageEnvelope };
