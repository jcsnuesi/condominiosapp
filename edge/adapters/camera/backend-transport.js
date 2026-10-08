"use strict";
const { createReadStream } = require("node:fs");
const fs = require("node:fs/promises");
class CameraBackendTransport {
  constructor({ apiOrigin, serviceKey, bucket, fetchImpl = fetch }) {
    const url = new URL(apiOrigin);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
      typeof serviceKey !== "string" || serviceKey.length < 32 || (bucket !== undefined && !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket)))
      throw new Error("CAMERA_TRANSPORT_CONFIG_INVALID");
    Object.assign(this, { serviceKey, bucket, fetchImpl }); this.apiOrigin = url.href.replace(/\/$/, "");
  }
  async request(path, body) {
    const response = await this.fetchImpl(`${this.apiOrigin}${path}`, { method: "POST", redirect: "error",
      headers: { "content-type": "application/json", "x-comunard-camera-key": this.serviceKey },
      body: JSON.stringify(body), signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("CAMERA_BACKEND_REQUEST_FAILED");
    const value = await response.json();
    if (value.success !== true || !value.data) throw new Error("CAMERA_BACKEND_REQUEST_FAILED");
    return value.data;
  }
  ingestEvent(event) { return this.request("/internal/cameras/events", event); }
  configuration(after) { return this.request("/internal/cameras/configuration", after ? { after } : {}); }
  planRecording(manifest) { return this.request("/internal/cameras/recordings", manifest); }
  uploadPermission(cameraId, recordingId) { return this.request(`/internal/cameras/${encodeURIComponent(cameraId)}/recordings/${encodeURIComponent(recordingId)}/upload`, {}); }
  confirmUpload(cameraId, recordingId) { return this.request(`/internal/cameras/${encodeURIComponent(cameraId)}/recordings/${encodeURIComponent(recordingId)}/confirm`, {}); }
  async uploadFile(permission, file) {
    const url = new URL(permission.url);
    if (url.protocol !== "https:" || url.hostname !== `${this.bucket}.s3.us-east-1.amazonaws.com` || url.username || url.password ||
      !/^\/camera\/[a-f0-9]{24}\/[a-f0-9]{24}\/[a-f0-9]{24}$/.test(url.pathname)) throw new Error("CAMERA_UPLOAD_TARGET_INVALID");
    const info = await fs.lstat(file);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error("CAMERA_UPLOAD_FILE_INVALID");
    const response = await this.fetchImpl(url, { method: "PUT", redirect: "error", headers: { ...permission.headers, "content-length": String(info.size) },
      body: createReadStream(file), duplex: "half", signal: AbortSignal.timeout(90000) });
    // A lost success receipt can lead to a conditional-write conflict. Backend HEAD verifies the original bytes next.
    if (!response.ok && response.status !== 412) throw new Error("CAMERA_UPLOAD_FAILED");
  }
}
module.exports = { CameraBackendTransport };
