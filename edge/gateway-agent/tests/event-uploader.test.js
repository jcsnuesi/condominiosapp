"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { GatewayCommandHandler } = require("../command-handler");
const { GatewayEventUploader } = require("../event-uploader");

async function fixture(t) {
  const root = path.resolve(os.tmpdir());
  const stateDirectory = await fs.mkdtemp(path.join(root, "comunard-upload-test-"));
  t.after(async () => {
    const target = path.resolve(stateDirectory);
    if (!target.startsWith(`${root}${path.sep}`) || !path.basename(target).startsWith("comunard-upload-test-"))
      throw new Error("Unsafe test cleanup");
    await fs.rm(target, { recursive: true, force: true });
  });
  let time = new Date(), executions = 0;
  const config = { gatewayId: "gateway-1", stateDirectory, now: () => time };
  const command = { schemaVersion: 1, gatewayId: "gateway-1", commandId: "cmd-1", resourceId: "device-1",
    profileVersion: 1, expiresAt: new Date(time.getTime() + 30000).toISOString(), payload: { power: "ON" } };
  const handler = new GatewayCommandHandler({ ...config,
    resources: { "device-1": { deviceType: "LIGHT", profileVersion: 1, feedbackEnabled: true } },
    execute: async () => { executions++; return { sourceEventId: "report-1", observedAt: time.toISOString(), reported: { power: "ON" } }; } });
  const result = await handler.handle(command);
  const key = createHash("sha256").update(command.commandId).digest("hex");
  return { config, result, directory: path.join(stateDirectory, "commands", key),
    advance: (ms) => { time = new Date(time.getTime() + ms); }, executions: () => executions };
}

test("durable upload survives restart, preserves event order and never reruns the actuator", async (t) => {
  const h = await fixture(t), delivered = [];
  const transport = { publishEvent: async (event) => {
    delivered.push(event); return { accepted: true, messageId: event.messageId };
  } };
  assert.deepEqual(await new GatewayEventUploader({ ...h.config, transport }).uploadPending({ limit: 1 }),
    { attempted: 1, accepted: 1, deferred: 0, invalid: 0 });
  assert.deepEqual(await new GatewayEventUploader({ ...h.config, transport }).uploadPending(),
    { attempted: 1, accepted: 1, deferred: 0, invalid: 0 });
  assert.deepEqual(delivered, h.result.events);
  assert.equal((await new GatewayEventUploader({ ...h.config, transport }).uploadPending()).attempted, 0);
  assert.equal(h.executions(), 1);
});

test("uncertain cloud receipt and broker ACK retry identical messages with durable backoff", async (t) => {
  const h = await fixture(t), delivered = [];
  let response = "lost";
  const transport = { publishEvent: async (event) => {
    delivered.push(event);
    if (response === "lost") throw new Error("receipt lost after cloud commit");
    if (response === "broker") return { puback: true };
    return { accepted: true, messageId: event.messageId };
  } };
  const upload = () => new GatewayEventUploader({ ...h.config, transport }).uploadPending();
  assert.equal((await upload()).accepted, 0);
  assert.equal((await upload()).deferred, 1);
  h.advance(2000); response = "broker";
  assert.equal((await upload()).accepted, 0);
  h.advance(4000); response = "application";
  assert.equal((await upload()).accepted, 2);
  assert.deepEqual(delivered[0], delivered[1]);
  assert.deepEqual(delivered[1], delivered[2]);
  // Simulate cloud acceptance followed by a crash before retaining its local receipt.
  await fs.unlink(path.join(h.directory, "delivery-result.json"));
  assert.equal((await upload()).accepted, 1);
  assert.deepEqual(delivered.at(-1), h.result.events[1]);
  assert.equal(h.executions(), 1);
});

test("missing result sends only the durable ACK; corrupt spool is retained and isolated", async (t) => {
  const h = await fixture(t), delivered = [];
  const transport = { publishEvent: async (event) => {
    delivered.push(event); return { accepted: true, messageId: event.messageId };
  } };
  await fs.unlink(path.join(h.directory, "result.json"));
  assert.equal((await new GatewayEventUploader({ ...h.config, transport }).uploadPending()).accepted, 1);
  assert.equal(delivered.length, 1);
  await fs.writeFile(path.join(h.directory, "ack.json"), "corrupt");
  assert.equal((await new GatewayEventUploader({ ...h.config, transport }).uploadPending()).invalid, 1);
  assert.equal(await fs.readFile(path.join(h.directory, "ack.json"), "utf8"), "corrupt");
  assert.equal(h.executions(), 1);
});

test("uploader excludes foreign gateway data and skips overlapping runs", async (t) => {
  const h = await fixture(t);
  const foreign = new GatewayEventUploader({ ...h.config, gatewayId: "other-gateway",
    transport: { publishEvent: async () => { throw new Error("must not publish"); } } });
  assert.equal((await foreign.uploadPending()).invalid, 1);
  let finish;
  const uploader = new GatewayEventUploader({ ...h.config, transport: {
    publishEvent: async (event) => { await new Promise((resolve) => { finish = () => resolve({ accepted: true, messageId: event.messageId }); });
      return { accepted: true, messageId: event.messageId }; },
  } });
  const first = uploader.uploadPending({ limit: 1 });
  // Wait for disk IO to reach the simulated transport, without polling AWS.
  for (let i = 0; i < 100 && !finish; i++) await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(typeof finish, "function");
  assert.deepEqual(await uploader.uploadPending(), { status: "BUSY" });
  finish(); await first;
  await assert.rejects(uploader.uploadPending({ limit: 501 }), { code: "IOT_EDGE_UPLOADER_CONFIG_INVALID" });
});
