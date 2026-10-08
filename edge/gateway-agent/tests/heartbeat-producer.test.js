"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { GatewayHeartbeatProducer } = require("../heartbeat-producer");
const { GatewaySpoolCapacity } = require("../spool-capacity");
const { validateHeartbeat } = require("../../../backend/modules/iot/domain/heartbeat");
const gatewayId = "012345678901234567890123";
async function fixture(t) {
  const root = path.resolve(os.tmpdir()), stateDirectory = await fs.mkdtemp(path.join(root, "comunard-heartbeat-test-"));
  t.after(async () => {
    const target = path.resolve(stateDirectory);
    if (!target.startsWith(`${root}${path.sep}`) || !path.basename(target).startsWith("comunard-heartbeat-test-")) throw new Error("Unsafe heartbeat cleanup");
    await fs.rm(target, { recursive: true, force: true });
  });
  let clock = new Date("2026-10-07T12:00:00.000Z"), sampled = 0;
  const config = { gatewayId, stateDirectory, agentVersion: "1.0.0", now: () => clock, uptime: () => 42.8,
    sample: async () => { sampled++; return { configurationVersion: 1, spoolCommandCount: 0, spoolAccountedBytes: 0, spoolCapacityBytes: 65536, storageBlocked: false }; } };
  return { config, advance: (ms) => { clock = new Date(clock.getTime() + ms); }, sampled: () => sampled,
    read: async () => JSON.parse(await fs.readFile(path.join(stateDirectory, "heartbeat-state.json"), "utf8")) };
}
test("heartbeat persists before publication, retries exact content across restart and advances sequence only for a fresh sample", async (t) => {
  const h = await fixture(t), delivered = [];
  let lose = true;
  const transport = { publishHeartbeat: async (event) => {
    const state = await h.read(); assert.deepEqual(state.pending.event, event);
    validateHeartbeat(event, { gateway: { _id: gatewayId, status: "ACTIVE" }, now: h.config.now() });
    delivered.push(event);
    if (lose) { lose = false; throw new Error("lost application receipt"); }
    return { accepted: true, messageId: event.messageId };
  } };
  const first = await new GatewayHeartbeatProducer({ ...h.config, transport }).tick();
  assert.equal(first.status, "PENDING"); assert.equal(first.sequence, 1);
  const restarted = new GatewayHeartbeatProducer({ ...h.config, transport, uptime: () => 1 });
  assert.equal((await restarted.tick()).status, "DEFERRED");
  h.advance(2000); assert.equal((await restarted.tick()).status, "ACCEPTED");
  assert.deepEqual(delivered[0], delivered[1]); assert.equal(h.sampled(), 1);
  assert.equal((await restarted.tick()).status, "NOT_DUE");
  h.advance(58000); assert.equal((await restarted.tick()).sequence, 2);
  assert.equal(delivered[2].payload.uptimeSeconds, 1); assert.notEqual(delivered[0].messageId, delivered[2].messageId);
});
test("broker ACK and wrong receipts retain health, while an explicit stale rejection permits a new sample without rewriting history", async (t) => {
  const h = await fixture(t), delivered = []; let mode = "broker";
  const transport = { publishHeartbeat: async (event) => {
    delivered.push(event);
    if (mode === "broker") return { puback: true };
    if (mode === "wrong") return { accepted: true, messageId: "foreign" };
    if (mode === "stale") return { rejected: true, code: "IOT_EVENT_STALE", messageId: event.messageId };
    return { accepted: true, messageId: event.messageId };
  } };
  const producer = new GatewayHeartbeatProducer({ ...h.config, transport });
  assert.equal((await producer.tick()).status, "PENDING");
  mode = "wrong"; h.advance(2000); assert.equal((await producer.tick()).status, "PENDING");
  mode = "stale"; h.advance(4000); assert.equal((await producer.tick()).status, "PENDING");
  h.advance(300001); assert.equal((await producer.tick()).status, "REJECTED_STALE");
  assert.equal((await h.read()).lastDelivery.status, "REJECTED_STALE");
  for (const event of delivered) assert.deepEqual(event, delivered[0]);
  mode = "accept"; assert.equal((await producer.tick()).sequence, 2);
  assert.notEqual(delivered.at(-1).occurredAt, delivered[0].occurredAt); assert.equal(h.sampled(), 2);
});
test("heartbeat lock serializes processes and damaged or foreign persisted state never publishes", async (t) => {
  const h = await fixture(t); let release, calls = 0;
  const transport = { publishHeartbeat: async () => { calls++; await new Promise((resolve) => { release = resolve; }); return {}; } };
  const producer = new GatewayHeartbeatProducer({ ...h.config, transport });
  const pending = producer.tick();
  while (!release) await new Promise((resolve) => setImmediate(resolve));
  assert.equal((await producer.tick()).status, "BUSY");
  assert.equal((await new GatewayHeartbeatProducer({ ...h.config, transport }).tick()).status, "BUSY");
  release(); await pending;
  await assert.rejects(new GatewayHeartbeatProducer({ ...h.config, gatewayId: "foreign-gateway", transport }).tick(), { code: "IOT_EDGE_HEARTBEAT_STATE_INVALID" });
  await fs.writeFile(path.join(h.config.stateDirectory, "heartbeat-state.json"), "{broken");
  await assert.rejects(producer.tick(), { code: "IOT_EDGE_HEARTBEAT_STATE_INVALID" }); assert.equal(calls, 1);
  await fs.writeFile(path.join(h.config.stateDirectory, "heartbeat.lock"), "stale lock retained");
  assert.equal((await producer.tick()).status, "BUSY");
});
test("capacity health is read-only, reports count/headroom correctly and producer rejects invented fields or clock rollback", async (t) => {
  const h = await fixture(t); let free = 999999n;
  const capacity = new GatewaySpoolCapacity({ stateDirectory: h.config.stateDirectory, maxBytes: 65536, minFreeBytes: 0, diskFree: async () => free });
  assert.deepEqual(await capacity.health(1), { configurationVersion: 1, spoolCommandCount: 0, spoolAccountedBytes: 0, spoolCapacityBytes: 65536, storageBlocked: false });
  assert.deepEqual(await fs.readdir(h.config.stateDirectory), []);
  free = 1n; assert.equal((await capacity.health(1)).storageBlocked, true);
  free = 999999n; await capacity.claim("a".repeat(64));
  assert.equal((await capacity.health(1)).spoolCommandCount, 1); assert.equal((await capacity.health(1)).storageBlocked, true);
  const transport = { publishHeartbeat: async (event) => ({ accepted: true, messageId: event.messageId }) };
  await assert.rejects(new GatewayHeartbeatProducer({ ...h.config, transport, sample: async () => ({ ...(await h.config.sample()), deviceOnline: true }) }).tick(),
    { code: "IOT_EDGE_HEARTBEAT_SAMPLE_INVALID" });
  const producer = new GatewayHeartbeatProducer({ ...h.config, transport }); await producer.tick();
  h.advance(-1); assert.equal((await producer.tick()).status, "CLOCK_SKEW");
});
