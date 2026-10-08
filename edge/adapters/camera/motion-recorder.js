"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { createReadStream } = require("node:fs");
const { GatewaySpoolCapacity } = require("../../gateway-agent/spool-capacity");
const { writeDurable } = require("../../gateway-agent/durable-storage");
const fail = (code) => Object.assign(new Error(code), { code });
async function checksumFile(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

class MotionRecorder {
  constructor({ stateDirectory, cameras, capture, now = () => new Date(), maxClipBytes = 32 * 1024 * 1024, storage = {} }) {
    if (!path.isAbsolute(stateDirectory || "") || !cameras || typeof capture !== "function" ||
      !Number.isSafeInteger(maxClipBytes) || maxClipBytes < 1024 || maxClipBytes > 100 * 1024 * 1024)
      throw fail("CAMERA_RECORDER_CONFIG_INVALID");
    Object.assign(this, { stateDirectory, cameras, capture, now, maxClipBytes });
    this.capacity = new GatewaySpoolCapacity({ maxBytes: 512 * 1024 * 1024, ...storage, stateDirectory,
      reservationBytes: maxClipBytes + 65536, directoryName: "recordings" });
    this.activeCameras = new Set();
  }
  async onMotion(input) {
    if (!input || Object.getPrototypeOf(input) !== Object.prototype ||
      Object.keys(input).some((key) => !["schemaVersion", "cameraId", "sourceEventId", "occurredAt"].includes(key)) ||
      input.schemaVersion !== 1 || typeof input.cameraId !== "string" || !/^[a-f0-9]{24}$/.test(input.cameraId) ||
      typeof input.sourceEventId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(input.sourceEventId)) throw fail("CAMERA_MOTION_INVALID");
    const camera = Object.hasOwn(this.cameras, input.cameraId) ? this.cameras[input.cameraId] : null;
    if (!camera || camera.enabled !== true) throw fail("CAMERA_MOTION_UNAUTHORIZED");
    const occurredAt = new Date(input.occurredAt);
    if (typeof input.occurredAt !== "string" || !Number.isFinite(occurredAt.getTime()) || occurredAt.toISOString() !== input.occurredAt || occurredAt > this.now())
      throw fail("CAMERA_MOTION_INVALID");
    const canonical = { schemaVersion: 1, cameraId: input.cameraId, sourceEventId: input.sourceEventId, occurredAt: input.occurredAt };
    const contentHash = createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
    const key = createHash("sha256").update(`${input.cameraId}:${input.sourceEventId}`).digest("hex");
    const directory = path.join(this.stateDirectory, "recordings", key);
    try {
      const intent = JSON.parse(await fs.readFile(path.join(directory, "intent.json"), "utf8"));
      if (intent.contentHash !== contentHash) throw fail("CAMERA_MOTION_CONFLICT");
      try { return { ...JSON.parse(await fs.readFile(path.join(directory, "result.json"), "utf8")), duplicate: true }; }
      catch { return { status: "REQUIRES_RECONCILIATION", duplicate: true }; }
    } catch (error) { if (error.code !== "ENOENT") throw error; }
    if (this.now() - occurredAt > 5000) throw fail("CAMERA_MOTION_STALE");
    if (this.activeCameras.has(input.cameraId)) return { status: "IGNORED_DURING_CAPTURE" };
    this.activeCameras.add(input.cameraId);
    try {
      if (!(await this.capacity.claim(key))) return { status: "REQUIRES_RECONCILIATION", duplicate: true };
      await writeDurable(path.join(directory, "intent.json"), { contentHash, motion: canonical });
      let result;
      try {
        // The trusted detector calls this immediately at movement, never on reconnect replay.
        if (this.now() - occurredAt > 5000) throw fail("CAMERA_MOTION_STALE");
        const file = path.join(directory, "clip.mp4");
        const captured = await this.capture(camera, file, { seconds: 30, maxBytes: this.maxClipBytes });
        const info = await fs.lstat(file);
        if (!info.isFile() || info.isSymbolicLink() || info.size < 1 || info.size > this.maxClipBytes ||
          !Number.isFinite(captured?.durationSeconds) || captured.durationSeconds < 29 || captured.durationSeconds > 30.1)
          throw fail("CAMERA_CAPTURE_INVALID");
        const handle = await fs.open(file, "r+");
        try { await handle.sync(); } finally { await handle.close(); }
        result = { status: "CAPTURED", duplicate: false, motion: canonical,
          manifest: { kind: "CLIP", checksum: await checksumFile(file), sizeBytes: info.size, durationSeconds: Math.min(30, captured.durationSeconds) } };
      } catch { result = { status: "FAILED", duplicate: false, reason: "CAMERA_CAPTURE_UNCONFIRMED" }; }
      await writeDurable(path.join(directory, "result.json"), result);
      return result;
    } finally { this.activeCameras.delete(input.cameraId); }
  }
}
module.exports = { MotionRecorder, checksumFile };
