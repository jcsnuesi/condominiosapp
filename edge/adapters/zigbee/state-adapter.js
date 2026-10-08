"use strict";
const { validateProfilePayload } = require("../../../backend/modules/iot/domain/profilePayload");
const { sanitizeDeviceState } = require("../../../backend/service/iotCapabilities");
const fail = (code) => { throw Object.assign(new Error(code), { code }); };
const plain = (value) => value && Object.getPrototypeOf(value) === Object.prototype;
const token = (value) => typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);
const field = (value) => typeof value === "string" && /^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(value) &&
  !["constructor", "prototype"].includes(value);

// Configuration comes from the trusted gateway binding, never bridge/devices.
// This boundary produces observations, not envelopes, acknowledgements or commands.
class ZigbeeStateAdapter {
  constructor({ gatewayId, baseTopic = "zigbee2mqtt", bindings, now = () => new Date() }) {
    if (!token(gatewayId) || !token(baseTopic) || !Array.isArray(bindings) ||
        bindings.length > 256 || typeof now !== "function") fail("IOT_ZIGBEE_CONFIG_INVALID");
    this.gatewayId = gatewayId;
    this.now = now;
    this.bindings = new Map();
    const resources = new Set();
    for (const input of bindings) {
      if (!plain(input) || !/^0x[a-f0-9]{16}$/.test(input.ieeeAddress || "") ||
          !token(input.resourceId) || resources.has(input.resourceId) ||
          typeof input.friendlyName !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(input.friendlyName) ||
          input.friendlyName === "bridge" || !Number.isSafeInteger(input.profileVersion) || input.profileVersion < 1 ||
          !plain(input.fields) || !Object.keys(input.fields).length || Object.keys(input.fields).length > 32 ||
          !plain(input.profile) || input.profile.protocol !== "ZIGBEE" ||
          input.profile.version !== input.profileVersion ||
          !["CERTIFIED", "SUPPORTED", "EXPERIMENTAL"].includes(input.profile.certification) ||
          !input.profile.deviceTypes?.includes(input.deviceType)) fail("IOT_ZIGBEE_CONFIG_INVALID");
      const targets = Object.values(input.fields);
      if (Object.keys(input.fields).some((key) => !field(key)) || targets.some((key) => !field(key)) ||
          new Set(targets).size !== targets.length || targets.some((key) => !input.profile.stateFields?.some((f) => f.name === key)))
        fail("IOT_ZIGBEE_CONFIG_INVALID");
      const topic = `${baseTopic}/${input.friendlyName}`;
      if (this.bindings.has(topic) || [...this.bindings.values()].some((b) => b.ieeeAddress === input.ieeeAddress))
        fail("IOT_ZIGBEE_CONFIG_INVALID");
      this.bindings.set(topic, JSON.parse(JSON.stringify(input)));
      resources.add(input.resourceId);
    }
  }

  observe(topic, bytes, packet) {
    // A retained cache, bridge availability, /set or discovery is never presence.
    const binding = this.bindings.get(topic);
    if (!binding) return { status: "IGNORED_TOPIC" };
    if (!plain(packet) || typeof packet.retain !== "boolean") fail("IOT_ZIGBEE_PACKET_INVALID");
    if (packet.retain) return { status: "IGNORED_RETAINED" };
    if (!(typeof bytes === "string" || Buffer.isBuffer(bytes)) || Buffer.byteLength(bytes) > 16384)
      fail("IOT_ZIGBEE_PAYLOAD_INVALID");
    let input;
    try { input = JSON.parse(bytes.toString()); } catch { fail("IOT_ZIGBEE_PAYLOAD_INVALID"); }
    if (!plain(input) || Object.keys(input).some((key) => ["__proto__", "constructor", "prototype"].includes(key)))
      fail("IOT_ZIGBEE_PAYLOAD_INVALID");
    // Require Zigbee2MQTT last_seen: ISO_8601. Receive time cannot freshen cached state.
    const time = typeof input.last_seen === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(input.last_seen)
      ? new Date(input.last_seen) : null;
    const now = this.now();
    if (!(now instanceof Date) || !Number.isFinite(now.getTime())) fail("IOT_ZIGBEE_CLOCK_INVALID");
    if (!time || !Number.isFinite(time.getTime()) || time.toISOString().replace(".000Z", "Z") !== input.last_seen.replace(".000Z", "Z") ||
        time > now || now - time > 300000) fail("IOT_EVENT_STALE");
    const payload = {};
    for (const [source, target] of Object.entries(binding.fields)) {
      if (Object.hasOwn(input, source)) payload[target] = input[source];
    }
    if (!Object.keys(payload).length) return { status: "IGNORED_NO_STATE" };
    validateProfilePayload(binding.profile, "state", payload);
    const safe = sanitizeDeviceState(binding.deviceType, payload);
    if (Object.keys(payload).some((key) => safe[key] !== payload[key])) fail("IOT_PROFILE_PAYLOAD_INVALID");
    return { status: "OBSERVED", observation: {
      gatewayId: this.gatewayId, resourceId: binding.resourceId, profileVersion: binding.profileVersion,
      occurredAt: time.toISOString(), payload,
    } };
  }
}
module.exports = { ZigbeeStateAdapter };
