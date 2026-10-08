"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { checksumFile } = require("./motion-recorder");
const { replaceDurable, syncDirectory } = require("../../gateway-agent/durable-storage");

class RecordingUploader {
  constructor({ stateDirectory, transport, now = () => new Date() }) {
    if (!path.isAbsolute(stateDirectory || "") || !["ingestEvent", "planRecording", "uploadPermission", "uploadFile", "confirmUpload"].every((key) => typeof transport?.[key] === "function"))
      throw new Error("CAMERA_UPLOADER_CONFIG_INVALID");
    Object.assign(this, { stateDirectory, transport, now }); this.running = false;
  }
  async uploadPending({ limit = 10 } = {}) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error("CAMERA_UPLOADER_CONFIG_INVALID");
    if (this.running) return { status: "BUSY" };
    this.running = true;
    const totals = { attempted: 0, available: 0, deferred: 0, failed: 0 };
    try {
      let entries;
      try { entries = await fs.opendir(path.join(this.stateDirectory, "recordings")); }
      catch (error) { if (error.code === "ENOENT") return totals; throw error; }
      for await (const entry of entries) {
        if (totals.attempted >= limit) break;
        if (!entry.isDirectory() || !/^[a-f0-9]{64}$/.test(entry.name)) continue;
        const directory = path.join(this.stateDirectory, "recordings", entry.name), deliveryFile = path.join(directory, "delivery.json");
        try {
          const resultFile = path.join(directory, "result.json"), resultInfo = await fs.lstat(resultFile);
          if (!resultInfo.isFile() || resultInfo.isSymbolicLink() || resultInfo.size > 16384) throw new Error("CAMERA_SPOOL_INVALID");
          const result = JSON.parse(await fs.readFile(resultFile, "utf8"));
          if (result.status !== "CAPTURED") continue;
          const intent = JSON.parse(await fs.readFile(path.join(directory, "intent.json"), "utf8"));
          if (intent.contentHash !== createHash("sha256").update(JSON.stringify(result.motion)).digest("hex") ||
            createHash("sha256").update(`${result.motion.cameraId}:${result.motion.sourceEventId}`).digest("hex") !== entry.name)
            throw new Error("CAMERA_SPOOL_INVALID");
          let delivery = {};
          try { delivery = JSON.parse(await fs.readFile(deliveryFile, "utf8")); }
          catch (error) { if (error.code !== "ENOENT") throw error; }
          if (delivery.status === "AVAILABLE") { await this.removeDeliveredClip(directory); continue; }
          if (delivery.nextAttemptAt && new Date(delivery.nextAttemptAt) > this.now()) { totals.deferred++; continue; }
          totals.attempted++;
          try {
            const file = path.join(directory, "clip.mp4"), info = await fs.lstat(file);
            if (!info.isFile() || info.isSymbolicLink() || info.size !== result.manifest.sizeBytes || await checksumFile(file) !== result.manifest.checksum)
              throw new Error("CAMERA_LOCAL_CHECKSUM_INVALID");
            const event = await this.transport.ingestEvent({ schemaVersion: 1, cameraId: result.motion.cameraId,
              sourceEventId: result.motion.sourceEventId, source: "CAMERA", eventType: "camera.motion", occurredAt: result.motion.occurredAt });
            const recording = await this.transport.planRecording({ cameraId: result.motion.cameraId, eventId: event.eventId, ...result.manifest });
            if (recording.status !== "AVAILABLE") {
              const permission = await this.transport.uploadPermission(result.motion.cameraId, recording.recordingId);
              await this.transport.uploadFile(permission, file);
            }
            const confirmed = await this.transport.confirmUpload(result.motion.cameraId, recording.recordingId);
            if (confirmed.status !== "AVAILABLE") throw new Error("CAMERA_UPLOAD_UNCONFIRMED");
            await replaceDurable(deliveryFile, { status: "AVAILABLE", recordingId: recording.recordingId, availableAt: this.now().toISOString() });
            totals.available++;
            await this.removeDeliveredClip(directory).catch(() => { totals.failed++; });
          } catch {
            const attempts = (Number.isSafeInteger(delivery.attempts) ? delivery.attempts : 0) + 1;
            await replaceDurable(deliveryFile, { status: "PENDING", attempts,
              nextAttemptAt: new Date(this.now().getTime() + Math.min(60000, 1000 * 2 ** Math.min(attempts, 6))).toISOString() });
            totals.failed++;
          }
        } catch { totals.failed++; }
      }
      return totals;
    } finally { this.running = false; }
  }
  async removeDeliveredClip(directory) {
    // Exact owned clip path only; keep intent/result/receipt for replay. Never delete pending captures.
    const root = path.resolve(this.stateDirectory, "recordings"), target = path.resolve(directory);
    if (path.dirname(target) !== root || !/^[a-f0-9]{64}$/.test(path.basename(target))) throw new Error("CAMERA_SPOOL_INVALID");
    await fs.unlink(path.join(target, "clip.mp4")).catch((error) => { if (error.code !== "ENOENT") throw error; });
    await syncDirectory(target);
  }
}
module.exports = { RecordingUploader };
