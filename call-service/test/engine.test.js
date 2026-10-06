"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { setTimeout: wait } = require("node:timers/promises");
const { CallEngine } = require("../engine");
function fixture(options = {}) {
  const events = new Map();
  const target = { condominiumId: "condo", staffId: "staff", alias: "Condominio" };
  const authorize = async () => ({ organizationId: "org", condominiumId: "condo", staffId: "staff", residentId: "resident", residentRole: "OWNER", name: "Residente", units: ["A1"], alias: "Condominio" });
  const history = [];
  const engine = new CallEngine({ authorize, history: async (entry) => history.push(entry), ...options });
  function add(id, userId, role, destinations = [target]) {
    events.set(id, []);
    engine.add({ id, emit: (event, payload) => events.get(id).push({ event, payload }) }, { userId, role, destinations }, `token-${id}`);
  }
  add("r", "resident", "OWNER");
  add("s1", "staff", "STAFF");
  engine.availability("s1", true);
  return { engine, events, add, history, target };
}
async function cleanup(engine) { for (const call of [...engine.calls.values()]) { engine.finish(call, "ended"); await call.historyChain; } }

test("call connects only after both endpoints report audio, then releases reservations", async () => {
  const { engine, history } = fixture();
  const { callId } = await engine.start("r", "condo");
  await engine.accept("s1", callId);
  engine.connected("r", callId);
  assert.equal(engine.calls.get(callId).state, "connecting");
  engine.connected("s1", callId);
  assert.equal(engine.calls.get(callId).state, "active");
  const call = engine.calls.get(callId);
  engine.end("r", callId);
  await call.historyChain;
  assert.equal(engine.busy.size, 0);
  assert.deepEqual(history.map((entry) => entry.result), ["ringing", "connecting", "active", "ended"]);
  assert.ok(history.every((entry) => !('sdp' in entry) && !('token' in entry)));
});
test("double start reserves the resident before backend authorization completes", async () => {
  let release;
  const { engine } = fixture({ authorize: () => new Promise((resolve) => { release = resolve; }) });
  const first = engine.start("r", "condo");
  await assert.rejects(engine.start("r", "condo"), { code: "busy" });
  release({ residentId: "resident", staffId: "staff", condominiumId: "condo" });
  await first;
  await cleanup(engine);
});
test("first accepting tab wins even while authorization is pending", async () => {
  const { engine, add, events } = fixture();
  add("s2", "staff", "STAFF");
  engine.availability("s2", true);
  const { callId } = await engine.start("r", "condo");
  assert.ok(events.get("s2").some((entry) => entry.event === "calls:incoming"));
  const acceptance = engine.accept("s1", callId);
  await assert.rejects(engine.accept("s2", callId), { code: "already_answered" });
  await acceptance;
  assert.ok(events.get("s2").some((entry) => entry.event === "calls:answered_elsewhere"));
  await cleanup(engine);
});
test("a second resident cannot reserve busy STAFF", async () => {
  const { engine, add } = fixture();
  await engine.start("r", "condo");
  add("r2", "resident2", "FAMILY");
  engine.authorize = async () => ({ residentId: "resident2", staffId: "staff", condominiumId: "condo" });
  await assert.rejects(engine.start("r2", "condo"), { code: "busy" });
  assert.equal(engine.busy.has("resident2"), false);
  await cleanup(engine);
});
test("offline or nonassigned STAFF cannot receive calls", async () => {
  const { engine } = fixture();
  engine.availability("s1", false);
  await assert.rejects(engine.start("r", "condo"), { code: "offline" });
  engine.availability("s1", true);
  engine.authorize = async () => ({ residentId: "resident", staffId: "another", condominiumId: "condo" });
  await assert.rejects(engine.start("r", "condo"), { code: "offline" });
  assert.equal(engine.busy.size, 0);
});
test("unauthorized condominium, role and signaling are rejected", async () => {
  const { engine, add } = fixture();
  await assert.rejects(engine.start("r", "other"), { code: "unauthorized" });
  await assert.rejects(engine.start("s1", "condo"), { code: "unauthorized" });
  const { callId } = await engine.start("r", "condo");
  add("intruder", "other", "OWNER");
  assert.throws(() => engine.signal("intruder", { callId, description: { type: "offer", sdp: "x" } }), { code: "unauthorized" });
  assert.throws(() => engine.signal("r", { callId, description: { type: "offer", sdp: "x" } }), { code: "invalid_signal" });
  await engine.accept("s1", callId);
  assert.throws(() => engine.signal("s1", { callId, description: { type: "offer", sdp: "x" } }), { code: "invalid_signal" });
  engine.signal("r", { callId, description: { type: "offer", sdp: "x" } });
  await cleanup(engine);
});
test("permission or assignment changes cancel ringing calls", async () => {
  const { engine } = fixture();
  await engine.start("r", "condo");
  engine.refresh("r", { userId: "resident", role: "OWNER", destinations: [] }, "new-token");
  assert.equal(engine.calls.size, 0);
  assert.equal(engine.busy.size, 0);
});
test("assignment changes let an active conversation finish", async () => {
  const { engine } = fixture();
  const { callId } = await engine.start("r", "condo");
  await engine.accept("s1", callId);
  engine.connected("r", callId);
  engine.connected("s1", callId);
  engine.refresh("s1", { userId: "staff", role: "STAFF", destinations: [] }, "new-token");
  assert.equal(engine.calls.get(callId).state, "active");
  await cleanup(engine);
});
test("revocation during acceptance fails closed", async () => {
  const { engine } = fixture();
  const { callId } = await engine.start("r", "condo");
  engine.authorize = async () => { throw Object.assign(new Error(), { code: "unauthorized" }); };
  await assert.rejects(engine.accept("s1", callId), { code: "unauthorized" });
  assert.equal(engine.busy.size, 0);
});
test("revoking condominium membership terminates an active conversation", async () => {
  const { engine } = fixture();
  const { callId } = await engine.start("r", "condo");
  await engine.accept("s1", callId);
  engine.connected("r", callId);
  engine.connected("s1", callId);
  engine.refresh("r", { userId: "resident", role: "OWNER", destinations: [], authorizedCondominiumIds: [] }, "new-token");
  assert.equal(engine.calls.size, 0);
  assert.equal(engine.busy.size, 0);
});
test("ringing and audio connection timeouts release both users", async () => {
  const { engine, events } = fixture({ ringMs: 15, connectMs: 15 });
  await engine.start("r", "condo");
  await wait(30);
  assert.equal(engine.busy.size, 0);
  assert.ok(events.get("r").some((entry) => entry.payload.result === "missed"));
  const { callId } = await engine.start("r", "condo");
  await engine.accept("s1", callId);
  await wait(30);
  assert.ok(events.get("r").some((entry) => entry.payload.result === "failed"));
  assert.equal(engine.busy.size, 0);
});
test("disconnect during authorization cannot leave an orphan call", async () => {
  let release;
  const { engine } = fixture({ authorize: () => new Promise((resolve) => { release = resolve; }) });
  const first = engine.start("r", "condo");
  engine.remove("r");
  release({ residentId: "resident", staffId: "staff" });
  await assert.rejects(first, { code: "disconnected" });
  assert.equal(engine.busy.size, 0);
});
test("one STAFF tab disconnect does not cancel another tab's incoming call", async () => {
  const { engine, add } = fixture();
  add("s2", "staff", "STAFF");
  engine.availability("s2", true);
  const { callId } = await engine.start("r", "condo");
  engine.remove("s1");
  assert.equal(engine.calls.size, 1);
  await engine.accept("s2", callId);
  engine.remove("s2");
  assert.equal(engine.busy.size, 0);
});
