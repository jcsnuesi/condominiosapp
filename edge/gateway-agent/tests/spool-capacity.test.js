"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { GatewayCommandHandler } = require("../command-handler");
const { GatewaySpoolCapacity, RESERVATION_BYTES } = require("../spool-capacity");

async function fixture(t, storage = {}) {
  const root = path.resolve(os.tmpdir());
  const stateDirectory = await fs.mkdtemp(path.join(root, "comunard-capacity-test-"));
  t.after(async () => {
    const target = path.resolve(stateDirectory);
    if (!target.startsWith(`${root}${path.sep}`) || !path.basename(target).startsWith("comunard-capacity-test-"))
      throw new Error("Unsafe capacity test cleanup");
    await fs.rm(target, { recursive: true, force: true });
  });
  const now = new Date();
  let executions = 0;
  const config = { gatewayId: "gateway-1", stateDirectory, now: () => now,
    storage: { diskFree: async () => 1024n * 1024n * 1024n, ...storage },
    resources: { "device-1": { deviceType: "LIGHT", profileVersion: 1, feedbackEnabled: true } },
    execute: async () => { executions++; return { sourceEventId: "report-1", observedAt: now.toISOString(), reported: { power: "ON" } }; } };
  const message = { schemaVersion: 1, gatewayId: "gateway-1", commandId: "command-1", resourceId: "device-1",
    profileVersion: 1, expiresAt: new Date(now.getTime() + 30000).toISOString(), payload: { power: "ON" } };
  return { config, message, executions: () => executions,
    directory: path.join(stateDirectory, "commands", createHash("sha256").update(message.commandId).digest("hex")) };
}

test("command count and reserved bytes deny new actions but retain durable replay at capacity", async (t) => {
  for (const storage of [{ maxCommands: 1 }, { maxBytes: RESERVATION_BYTES }]) {
    const h = await fixture(t, storage);
    const first = await new GatewayCommandHandler(h.config).handle(h.message);
    assert.equal(first.status, "EXECUTED");
    await assert.rejects(new GatewayCommandHandler(h.config).handle({ ...h.message, commandId: "command-2" }),
      { code: "IOT_EDGE_STORAGE_FULL" });
    const duplicate = await new GatewayCommandHandler(h.config).handle(h.message);
    assert.deepEqual(duplicate.events, first.events);
    assert.equal(h.executions(), 1);
    assert.equal((await fs.readdir(path.join(h.config.stateDirectory, "commands"))).length, 1);
  }
});

test("low disk headroom blocks acceptance before intent, ACK or actuator execution", async (t) => {
  const h = await fixture(t, { minFreeBytes: 1000, diskFree: async () => BigInt(RESERVATION_BYTES + 999) });
  await assert.rejects(new GatewayCommandHandler(h.config).handle(h.message), { code: "IOT_EDGE_STORAGE_FULL" });
  assert.equal(h.executions(), 0);
  assert.deepEqual(await fs.readdir(path.join(h.config.stateDirectory, "commands")), []);
  await assert.rejects(fs.stat(path.join(h.config.stateDirectory, "command-admission.lock")), { code: "ENOENT" });
});

test("uncertain intent remains reserved and cannot be deleted to admit a new command", async (t) => {
  const h = await fixture(t, { maxCommands: 1 });
  await new GatewayCommandHandler(h.config).handle(h.message);
  await fs.unlink(path.join(h.directory, "result.json"));
  assert.equal((await new GatewayCommandHandler(h.config).handle(h.message)).status, "REQUIRES_RECONCILIATION");
  await assert.rejects(new GatewayCommandHandler(h.config).handle({ ...h.message, commandId: "command-2" }),
    { code: "IOT_EDGE_STORAGE_FULL" });
  assert.equal(h.executions(), 1);
  assert.equal(JSON.parse(await fs.readFile(path.join(h.directory, "reservation.json"), "utf8")).bytes, RESERVATION_BYTES);
});

test("cross-instance admission lock prevents capacity races and stale lock requires recovery", async (t) => {
  const h = await fixture(t, { maxCommands: 1 });
  let entered, release;
  const started = new Promise((resolve) => { entered = resolve; });
  const storage = { ...h.config.storage, diskFree: async () => {
    entered(); await new Promise((resolve) => { release = resolve; }); return 1024n * 1024n * 1024n;
  } };
  const first = new GatewayCommandHandler({ ...h.config, storage }).handle(h.message);
  await started;
  await assert.rejects(new GatewayCommandHandler(h.config).handle({ ...h.message, commandId: "command-2" }),
    { code: "IOT_EDGE_STORAGE_BUSY" });
  release(); await first;
  await fs.writeFile(path.join(h.config.stateDirectory, "command-admission.lock"), '{"pid":999999}');
  await assert.rejects(new GatewayCommandHandler(h.config).handle({ ...h.message, commandId: "command-3" }),
    { code: "IOT_EDGE_STORAGE_BUSY" });
  assert.equal((await new GatewayCommandHandler(h.config).handle(h.message)).duplicate, true);
  assert.equal(h.executions(), 1);
});

test("capacity validates policy and accounts legacy directories and oversized files", async (t) => {
  const h = await fixture(t);
  assert.throws(() => new GatewaySpoolCapacity({ stateDirectory: h.config.stateDirectory, maxBytes: 1 }),
    { code: "IOT_EDGE_STORAGE_CONFIG_INVALID" });
  await new GatewayCommandHandler(h.config).handle(h.message);
  await fs.unlink(path.join(h.directory, "reservation.json"));
  const capacity = new GatewaySpoolCapacity({ stateDirectory: h.config.stateDirectory });
  assert.deepEqual(await capacity.inspect(), { commands: 1, accountedBytes: RESERVATION_BYTES });
  await fs.writeFile(path.join(h.directory, "unexpected.bin"), Buffer.alloc(RESERVATION_BYTES + 1));
  assert.ok((await capacity.inspect()).accountedBytes > RESERVATION_BYTES);
  await fs.mkdir(path.join(h.directory, "unexpected-directory"));
  await assert.rejects(capacity.inspect(), { code: "IOT_EDGE_STORAGE_REQUIRES_RECONCILIATION" });
});
