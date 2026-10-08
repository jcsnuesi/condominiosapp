"use strict";
const { apiError } = require("../../../service/iotService");
class MediaControl {
  constructor({ gatewayId, whepOrigin, controlOrigin, controlUser, controlPassword, fetchImpl = fetch }) {
    const publicUrl = new URL(whepOrigin), control = new URL(controlOrigin);
    if (!/^[a-f0-9]{24}$/i.test(gatewayId || "") || publicUrl.protocol !== "https:" ||
      !["https:", "http:"].includes(control.protocol) || [publicUrl, control].some((url) => url.username || url.password || url.search || url.hash) ||
      typeof controlUser !== "string" || !controlUser || typeof controlPassword !== "string" || controlPassword.length < 32)
      throw apiError("CAMERA_MEDIA_CONFIG_INVALID", "Invalid media gateway configuration", 503);
    Object.assign(this, { gatewayId, fetchImpl, controlUser, controlPassword });
    this.whepOrigin = publicUrl.href.replace(/\/$/, "");
    this.controlOrigin = control.href.replace(/\/$/, "");
  }
  endpoint(camera) {
    if (String(camera.gatewayId) !== this.gatewayId) throw apiError("CAMERA_MEDIA_UNCONFIGURED", "Camera gateway media is not configured", 503);
    return `${this.whepOrigin}/${encodeURIComponent(camera.streamId)}/whep`;
  }
  async closeSession(session) {
    if (String(session.gatewayId) !== this.gatewayId) throw apiError("CAMERA_MEDIA_UNCONFIGURED", "Media gateway mismatch", 503);
    if (!session.mediaSessionId) return;
    const result = await this.fetchImpl(`${this.controlOrigin}/v3/webrtc/sessions/kick/${encodeURIComponent(session.mediaSessionId)}`,
      { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${this.controlUser}:${this.controlPassword}`).toString("base64")}` },
        signal: AbortSignal.timeout(5000), redirect: "error" });
    if (!result.ok && result.status !== 404) throw apiError("CAMERA_MEDIA_CLOSE_FAILED", "Media session close failed", 502);
  }
  async inspectPath(camera) {
    this.endpoint(camera);
    const result = await this.fetchImpl(`${this.controlOrigin}/v3/paths/get/${encodeURIComponent(camera.streamId)}`,
      { headers: { Authorization: `Basic ${Buffer.from(`${this.controlUser}:${this.controlPassword}`).toString("base64")}` },
        signal: AbortSignal.timeout(5000), redirect: "error" });
    if (result.status === 404) return { ready: false };
    if (!result.ok) throw apiError("CAMERA_MEDIA_PROBE_FAILED", "Media path inspection failed", 502);
    const data = await result.json();
    const codecs = (Array.isArray(data.tracks2) ? data.tracks2 : Array.isArray(data.tracks) ? data.tracks : [])
      .map((track) => typeof track === "string" ? track : track?.codec);
    return { ready: data.online === true || data.ready === true,
      videoCodec: codecs.find((codec) => ["H264", "H265", "AV1", "VP8", "VP9", "M-JPEG", "MPEG-4 Video"].includes(codec)) || null };
  }
}
module.exports = { MediaControl };
