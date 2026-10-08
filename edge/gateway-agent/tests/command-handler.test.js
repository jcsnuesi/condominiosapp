"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { createHash } = require("node:crypto");
const { GatewayCommandHandler } = require("../command-handler");

async function fixture(t, options = {}) {
  const root = os.tmpdir();
  const stateDirectory = await fs.mkdtemp(path.join(root, "comunard-edge-test-"));
  t.after(async () => {
    const target = path.resolve(stateDirectory);
    if (!target.startsWith(`${path.resolve(root)}${path.sep}`) || !path.basename(target).startsWith("comunard-edge-test-")) throw new Error("Unsafe test cleanup");
    await fs.rm(target, { recursive: true, force: true });
  });
  let runs = 0, time = new Date();
  const config = { gatewayId: "gateway-1", stateDirectory, resources: { "device-1": { deviceType: "LIGHT", profileVersion: 1, feedbackEnabled: true } },
    now: () => time, execute: async () => { runs++; return { sourceEventId: "report-1", observedAt: time.toISOString(), reported: { power: "ON" } }; }, ...options };
  const message = { schemaVersion: 1, commandId: "cmd-1", resourceId: "device-1", gatewayId: "gateway-1", profileVersion: 1,
    expiresAt: new Date(time.getTime() + 30000).toISOString(), payload: { power: "ON" } };
  return { config, message, stateDirectory, get runs() { return runs; }, advance: (ms) => { time = new Date(time.getTime() + ms); } };
}

test("edge dedup survives a new handler instance and expired retries cannot repeat execution", async (t) => {
  const h = await fixture(t);
  const first = await new GatewayCommandHandler(h.config).handle(h.message);
  assert.equal(first.status, "EXECUTED");
  assert.equal(first.events[0].payload.status, "ACKNOWLEDGED");
  assert.equal(first.events[1].payload.status, "EXECUTED");
  h.advance(60000);
  const repeated = await new GatewayCommandHandler(h.config).handle(h.message);
  assert.equal(repeated.duplicate, true);
  assert.equal(h.runs, 1);
  await assert.rejects(new GatewayCommandHandler(h.config).handle({ ...h.message, payload: { power: "OFF" } }), { code: "IOT_EDGE_MESSAGE_CONFLICT" });
});

test("edge crash after intent never retries an uncertain action automatically", async (t) => {
  const h = await fixture(t);
  await new GatewayCommandHandler(h.config).handle(h.message);
  const key = createHash("sha256").update(h.message.commandId).digest("hex");
  await fs.unlink(path.join(h.stateDirectory, "commands", key, "result.json"));
  const retry = await new GatewayCommandHandler(h.config).handle(h.message);
  assert.equal(retry.status, "REQUIRES_RECONCILIATION");
  assert.equal(h.runs, 1);
});

test("edge rejects expired, foreign and transient commands; absent feedback remains unconfirmed", async (t) => {
  const h = await fixture(t);
  await assert.rejects(new GatewayCommandHandler(h.config).handle({ ...h.message, gatewayId: "foreign" }));
  await assert.rejects(new GatewayCommandHandler(h.config).handle({ ...h.message, payload: { open: true } }));
  h.advance(31000);
  assert.equal((await new GatewayCommandHandler(h.config).handle(h.message)).status, "REJECTED_EXPIRED");
  assert.equal(h.runs, 0);
  const uncertain = await fixture(t, { execute: async () => ({}) });
  const response = await new GatewayCommandHandler(uncertain.config).handle(uncertain.message);
  assert.equal(response.confirmed, false);
  assert.equal(response.events.length, 1);
});
