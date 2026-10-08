"use strict";
const { isIPv4 } = require("node:net");
const { createHash } = require("node:crypto");
const safe = () => new Error("CAMERA_CONFIGURATION_SYNC_FAILED");
function sourceValid(source) {
  try {
    const url = new URL(source), parts = url.hostname.split(".").map(Number);
    return url.protocol === "rtsp:" && isIPv4(url.hostname) && !url.hash &&
      (parts[0] === 10 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168));
  } catch { return false; }
}
class CameraConfigurationSync {
  constructor({ transport, controlOrigin = "http://127.0.0.1:9997", controlUser, controlPassword, recorder, channels, fetchImpl = fetch }) {
    const url = new URL(controlOrigin);
    if (url.origin !== "http://127.0.0.1:9997" || url.pathname !== "/" || url.username || url.password || url.search || url.hash ||
      typeof controlUser !== "string" || !controlUser || typeof controlPassword !== "string" || controlPassword.length < 32) throw safe();
    Object.assign(this, { transport, controlUser, controlPassword, recorder, channels, fetchImpl });
    this.origin = url.origin; this.running = false;
  }
  async request(path, method, body) {
    const result = await this.fetchImpl(`${this.origin}/v3/config/paths/${path}`, { method, redirect: "error",
      headers: { Authorization: `Basic ${Buffer.from(`${this.controlUser}:${this.controlPassword}`).toString("base64")}`, "content-type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(5000) });
    if (!result.ok && result.status !== 404) throw safe();
    return result;
  }
  async sync() {
    if (this.running) return;
    this.running = true;
    try {
      let after, pages = 0; const entries = [], seen = new Set();
      do {
        const page = await this.transport.configuration(after);
        if (!Array.isArray(page.cameras) || page.cameras.length > 50 || ++pages > 100) throw safe();
        for (const camera of page.cameras) {
          if (!/^[a-f0-9]{24}$/.test(camera.cameraId || "") || !/^camera-[A-Za-z0-9_-]{1,100}$/.test(camera.streamId || "") ||
              seen.has(camera.cameraId) || typeof camera.enabled !== "boolean" || typeof camera.recordingEnabled !== "boolean" ||
              (camera.enabled && !sourceValid(camera.rtspSource))) throw safe();
          seen.add(camera.cameraId); entries.push(camera);
        }
        if (page.nextCursor !== null && (!/^[a-f0-9]{24}$/.test(page.nextCursor || "") || page.nextCursor === after)) throw safe();
        after = page.nextCursor;
      } while (after);
      // Fetch and validate the complete snapshot before changing any local source.
      for (const camera of entries) {
        const name = encodeURIComponent(camera.streamId);
        if (!camera.enabled) {
          await this.request(`delete/${name}`, "DELETE");
          delete this.recorder.cameras[camera.cameraId]; delete this.channels[camera.cameraId];
          continue;
        }
        const current = await this.request(`get/${name}`, "GET");
        const desired = { source: camera.rtspSource, rtspTransport: "tcp", sourceOnDemand: false, record: false };
        const existing = current.ok ? await current.json() : undefined;
        if (!existing || createHash("sha256").update(String(existing.source)).digest("hex") !== createHash("sha256").update(camera.rtspSource).digest("hex") ||
            existing.record !== false || existing.rtspTransport !== "tcp" || existing.sourceOnDemand !== false) {
          const result = await this.request(`${current.status === 404 ? "add" : "replace"}/${name}`, "POST", desired);
          if (!result.ok) throw safe();
        }
        this.recorder.cameras[camera.cameraId] = { rtspSource: camera.rtspSource, enabled: camera.recordingEnabled };
        // Camera IDs avoid collisions between channel 1 of different recorders.
        this.channels[camera.cameraId] = camera.cameraId;
      }
      return { applied: entries.length };
    } catch { throw safe(); }
    finally { this.running = false; }
  }
}
module.exports = { CameraConfigurationSync, sourceValid };
