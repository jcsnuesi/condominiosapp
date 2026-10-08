"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { ZigbeeStateAdapter } = require("../state-adapter");
const now = new Date("2026-10-07T12:00:00.000Z");
const binding = () => ({ ieeeAddress: "0x00158d00018255df", friendlyName: "water-a", resourceId: "device-a",
  profileVersion: 1, deviceType: "WATER_SENSOR", fields: { water_leak: "waterDetected", battery: "battery" },
  profile: { protocol: "ZIGBEE", version: 1, certification: "EXPERIMENTAL", deviceTypes: ["WATER_SENSOR"],
    stateFields: [{ name: "waterDetected", type: "boolean" }, { name: "battery", type: "number", min: 0, max: 100 }] } });
const create = (bindings = [binding()]) => new ZigbeeStateAdapter({ gatewayId: "gateway-a", bindings, now: () => now });
const sample = (overrides = {}) => JSON.stringify({ last_seen: now.toISOString(), water_leak: true, battery: 90, ...overrides });
const observe = (adapter, data = sample(), retain = false) => adapter.observe("zigbee2mqtt/water-a", data, { retain });

test("mapped physical report conforms to profile, preserves sample time and isolates configuration", () => {
  const config = binding(); const adapter = create([config]); config.resourceId = "foreign";
  const result = observe(adapter, sample({ organizationId: "foreign", commandId: "fake", state: "ON" }));
  assert.deepEqual(result, { status: "OBSERVED", observation: { gatewayId: "gateway-a", resourceId: "device-a",
    profileVersion: 1, occurredAt: now.toISOString(), payload: { waterDetected: true, battery: 90 } } });
  result.observation.payload.battery = 0;
  assert.equal(observe(adapter).observation.payload.battery, 90);
  assert.deepEqual(observe(adapter, JSON.stringify({ last_seen: now.toISOString(), battery: 50 })).observation.payload, { battery: 50 });
});
test("retained state, discovery, availability and commands cannot establish presence", () => {
  const adapter = create();
  assert.equal(observe(adapter, "not-json", true).status, "IGNORED_RETAINED");
  for (const suffix of ["bridge/devices", "bridge/state", "water-a/availability", "water-a/set", "unknown"])
    assert.equal(adapter.observe(`zigbee2mqtt/${suffix}`, sample(), { retain: false }).status, "IGNORED_TOPIC");
  assert.throws(() => adapter.observe("zigbee2mqtt/water-a", sample(), {}), { code: "IOT_ZIGBEE_PACKET_INVALID" });
  assert.equal(observe(adapter, JSON.stringify({ last_seen: now.toISOString(), linkquality: 80 })).status, "IGNORED_NO_STATE");
});
test("stale/future/missing timestamps and malformed or out-of-profile fields fail closed", () => {
  const adapter = create();
  for (const last_seen of [undefined, 1791374400, "2026-10-07T11:54:59Z", "2026-10-07T12:00:01Z", "2026-02-30T12:00:00Z"])
    assert.throws(() => observe(adapter, sample({ last_seen })), { code: "IOT_EVENT_STALE" });
  for (const data of ["null", "[]", "{", " ".repeat(16385), '{"__proto__":{}}'])
    assert.throws(() => observe(adapter, data), { code: "IOT_ZIGBEE_PAYLOAD_INVALID" });
  for (const values of [{ battery: 101 }, { battery: "90" }, { water_leak: 1 }])
    assert.throws(() => observe(adapter, sample(values)), { code: "IOT_PROFILE_PAYLOAD_INVALID" });
});
test("duplicate/unsupported bindings cannot be silently adopted from discovery", () => {
  for (const bindings of [[binding(), binding()], [{ ...binding(), friendlyName: "bridge" }],
    [{ ...binding(), friendlyName: "floor/water" }], [{ ...binding(), profileVersion: 2 }],
    [{ ...binding(), profile: { ...binding().profile, certification: "UNSUPPORTED" } }],
    [{ ...binding(), fields: { battery: "battery", other: "battery" } }]])
    assert.throws(() => create(bindings), { code: "IOT_ZIGBEE_CONFIG_INVALID" });
});
