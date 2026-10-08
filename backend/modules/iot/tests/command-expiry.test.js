"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { expiryCandidates, COMMAND_FEEDBACK_GRACE_MS } = require("../domain/commandDeadline");
const { IoTCommandExpiryService } = require("../application/commandExpiryService");
const { startIoTCommandExpiryJob } = require("../../../service/iotCommandExpiryJob");

test("command sweep keeps execution and feedback delivery deadlines separate", () => {
  const now = new Date("2026-10-07T12:00:00Z");
  const filter = expiryCandidates(now);
  assert.equal(filter.$or[0].status, "REQUESTED");
  assert.equal(filter.$or[0].expiresAt.$lte, now);
  assert.deepEqual(filter.$or[1].status.$in, ["DISPATCHED", "ACKNOWLEDGED"]);
  assert.equal(filter.$or[1].expiresAt.$lte.getTime(), now.getTime() - COMMAND_FEEDBACK_GRACE_MS);
});

test("disabled expiry makes no database calls and batch size is bounded", async () => {
  const CommandModel = { find: () => { throw new Error("must not query"); } };
  assert.deepEqual(await new IoTCommandExpiryService({ enabled: () => false, CommandModel }).expireCommands(),
    { status: "DISABLED", scanned: 0, changed: 0 });
  const service = new IoTCommandExpiryService({ enabled: () => true, CommandModel });
  for (const limit of [0, 501, 1.5])
    await assert.rejects(service.expireCommands({ limit }), { code: "IOT_COMMAND_EXPIRY_CONFIG_INVALID" });
});

test("expiry scheduling is opt-in and does not overlap sweeps", async () => {
  let callback, finish, runs = 0;
  assert.equal(startIoTCommandExpiryJob({ enabled: false, schedule: () => { throw new Error("must not schedule"); } }), null);
  startIoTCommandExpiryJob({ enabled: true, schedule: (fn, ms) => {
    callback = fn; assert.equal(ms, 60000); return { unref() {} };
  }, service: { expireCommands: async () => { runs++; await new Promise((resolve) => { finish = resolve; }); } } });
  const first = callback(); await callback();
  assert.equal(runs, 1);
  finish(); await first;
});
