"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { MotionRecorder } = require("../motion-recorder");
const { RecordingUploader } = require("../recording-uploader");
const { GatewaySpoolCapacity } = require("../../../gateway-agent/spool-capacity");

async function fixture(t) {
  const root = path.resolve(os.tmpdir()), stateDirectory = await fs.mkdtemp(path.join(root, "comunard-motion-test-"));
  t.after(async () => {
    const target = path.resolve(stateDirectory);
    if (path.dirname(target) !== root || !path.basename(target).startsWith("comunard-motion-test-")) throw new Error("Unsafe cleanup");
    await fs.rm(target, { recursive: true, force: true });
  });
  const cameraId = "012345678901234567890123";
  let time = new Date(), captures = 0;
  const config = { stateDirectory, cameras: { [cameraId]: { enabled: true } }, now: () => time,
    maxClipBytes: 1024, storage: { maxBytes: 2 * (65536 + 1024), diskFree: async () => 1000000000n },
    capture: async (_camera, output, options) => { captures++; assert.equal(options.seconds, 30); await fs.writeFile(output, "synthetic-video"); return { durationSeconds: 30 }; } };
  const motion = { schemaVersion: 1, cameraId, sourceEventId: "motion-1", occurredAt: time.toISOString() };
  const directory = path.join(stateDirectory, "recordings", createHash("sha256").update(`${cameraId}:motion-1`).digest("hex"));
  return { config, motion, directory, captures: () => captures, advance: (ms) => { time = new Date(time.getTime() + ms); }, now: () => time };
}

test("motion captures only the next 30 seconds and dedup survives restarts without recapture", async (t) => {
  const h = await fixture(t);
  const first = await new MotionRecorder(h.config).onMotion(h.motion);
  assert.equal(first.status, "CAPTURED"); assert.equal(first.manifest.durationSeconds, 30);
  h.advance(86400000);
  assert.equal((await new MotionRecorder(h.config).onMotion(h.motion)).duplicate, true);
  assert.equal(h.captures(), 1);
  await assert.rejects(new MotionRecorder(h.config).onMotion({ ...h.motion, sourceEventId: "old-new-event" }), { code: "CAMERA_MOTION_STALE" });
  await fs.unlink(path.join(h.directory, "result.json"));
  assert.equal((await new MotionRecorder(h.config).onMotion(h.motion)).status, "REQUIRES_RECONCILIATION");
  assert.equal(h.captures(), 1);
});

test("uncertain upload retains local clip, retries stable event/manifest and releases only confirmed storage", async (t) => {
  const h = await fixture(t);
  await new MotionRecorder(h.config).onMotion(h.motion);
  let failUpload = true, uploads = 0, events = [], confirmations = 0;
  const transport = {
    ingestEvent: async (event) => { events.push(event); return { eventId: "event-1" }; },
    planRecording: async () => ({ recordingId: "recording-1", status: "PENDING" }),
    uploadPermission: async () => ({ url: "https://simulated.invalid/recording" }),
    uploadFile: async () => { uploads++; if (failUpload) throw new Error("connection lost"); },
    confirmUpload: async () => { confirmations++; return { status: "AVAILABLE" }; },
  };
  const upload = () => new RecordingUploader({ stateDirectory: h.config.stateDirectory, transport, now: h.now }).uploadPending();
  assert.equal((await upload()).failed, 1); assert.equal(confirmations, 0);
  await fs.stat(path.join(h.directory, "clip.mp4"));
  assert.equal((await upload()).deferred, 1);
  h.advance(2000); failUpload = false;
  assert.equal((await upload()).available, 1);
  assert.deepEqual(events[0], events[1]); assert.equal(uploads, 2); assert.equal(h.captures(), 1);
  await assert.rejects(fs.stat(path.join(h.directory, "clip.mp4")), { code: "ENOENT" });
  assert.equal((await upload()).attempted, 0);
  assert.equal((await new MotionRecorder(h.config).onMotion(h.motion)).duplicate, true);
  const capacity = new GatewaySpoolCapacity({ ...h.config.storage, stateDirectory: h.config.stateDirectory, directoryName: "recordings", reservationBytes: 65536 + 1024 });
  assert.ok((await capacity.inspect()).accountedBytes < 65536 + 1024);
});

test("corrupt clip is never uploaded or marked available and remains for reconciliation", async (t) => {
  const h = await fixture(t);
  await new MotionRecorder(h.config).onMotion(h.motion);
  await fs.writeFile(path.join(h.directory, "clip.mp4"), "changed-video");
  let calls = 0;
  const transport = Object.fromEntries(["ingestEvent", "planRecording", "uploadPermission", "uploadFile", "confirmUpload"].map((name) => [name, async () => { calls++; throw new Error("must not call"); }]));
  const result = await new RecordingUploader({ stateDirectory: h.config.stateDirectory, transport, now: h.now }).uploadPending();
  assert.equal(result.failed, 1); assert.equal(calls, 0);
  assert.equal(await fs.readFile(path.join(h.directory, "clip.mp4"), "utf8"), "changed-video");
});
