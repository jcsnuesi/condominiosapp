"use strict";
const mongoose = require("mongoose");
const { randomBytes, createHash } = require("node:crypto");
const Session = require("../../../models/cameraLiveSession");
const Camera = require("../../../models/camera");
const { CameraInventoryService } = require("./inventoryService");
const { resolveAccessContext } = require("../../../service/authorization");
const { scopeFilter, apiError } = require("../../../service/iotService");
const { sameContext } = require("../../iot/domain/context");
const { objectId } = require("../../iot/application/inventoryService");
const digest = (token) => createHash("sha256").update(token).digest("hex");
const SESSION_MS = 60000;

class CameraLiveService {
  constructor({ SessionModel = Session, CameraModel = Camera, inventory = new CameraInventoryService(),
    mongo = mongoose, media, resolveActor = resolveAccessContext, now = () => new Date() } = {}) {
    Object.assign(this, { SessionModel, CameraModel, inventory, mongo, media, resolveActor, now });
    this.sweepAfter = null;
  }
  async camera(actor, id) {
    const camera = await this.inventory.getCamera(actor, id, "cameras.live");
    if (camera.status !== "ACTIVE") throw apiError("CAMERA_NOT_READY", "Camera is not active", 409);
    const gateway = await this.inventory.GatewayModel.findById(camera.gatewayId).lean();
    if (!gateway || gateway.status !== "ACTIVE" || !sameContext(gateway, camera))
      throw apiError("CAMERA_GATEWAY_INACTIVE", "Camera gateway is inactive", 409);
    if (!this.media?.endpoint || !this.media?.closeSession) throw apiError("CAMERA_MEDIA_UNCONFIGURED", "Media gateway is not configured", 503);
    return camera;
  }
  async create(actor, cameraId) {
    const camera = await this.camera(actor, cameraId), whepUrl = this.media.endpoint(camera);
    const token = randomBytes(32).toString("base64url"), expiresAt = new Date(this.now().getTime() + SESSION_MS);
    const transaction = await this.mongo.startSession();
    let session;
    try {
      await transaction.withTransaction(async () => {
        const slots = await this.SessionModel.find({ actorId: actor.account._id, status: { $in: ["ACTIVE", "CLOSING"] } }).select("slot").session(transaction).lean();
        const slot = [0, 1, 2, 3].find((value) => !slots.some((item) => item.slot === value));
        if (slot === undefined) throw apiError("CAMERA_LIVE_LIMIT", "Close another live view before opening this camera", 409);
        const active = await this.CameraModel.updateOne({ _id: camera._id, status: "ACTIVE", revision: camera.revision },
          { $inc: { revision: 1 } }, { session: transaction });
        if (active.modifiedCount !== 1) throw apiError("CAMERA_CONFLICT", "Camera changed; retry", 409);
        [session] = await this.SessionModel.create([{ ...scopeFilter(camera), cameraId: camera._id, gatewayId: camera.gatewayId,
          actorId: actor.account._id, actorRole: actor.role, slot, tokenHash: digest(token), expiresAt }], { session: transaction });
      });
      return { id: String(session._id), token, whepUrl, expiresAt };
    } catch (error) {
      if (error.code === 11000) throw apiError("CAMERA_LIVE_LIMIT", "Live slot changed; retry", 409);
      throw error;
    } finally { await transaction.endSession(); }
  }
  async owned(actor, cameraId, sessionId) {
    const session = await this.SessionModel.findById(objectId(sessionId)).lean();
    if (!session || String(session.cameraId) !== objectId(cameraId) || String(session.actorId) !== String(actor.account._id))
      throw apiError("CAMERA_SESSION_NOT_FOUND", "Live session not found", 404);
    return session;
  }
  async renew(actor, cameraId, sessionId) {
    const camera = await this.camera(actor, cameraId), session = await this.owned(actor, cameraId, sessionId);
    if (!sameContext(camera, session) || session.status !== "ACTIVE" || session.expiresAt <= this.now() ||
      this.now() - session.createdAt > 600000) throw apiError("CAMERA_SESSION_EXPIRED", "Open a new live session", 409);
    const expiresAt = new Date(this.now().getTime() + SESSION_MS);
    const updated = await this.SessionModel.updateOne({ _id: session._id, status: "ACTIVE", expiresAt: { $gt: this.now() } }, { $set: { expiresAt } });
    if (!updated.modifiedCount) throw apiError("CAMERA_SESSION_EXPIRED", "Live session changed", 409);
    return { id: String(session._id), expiresAt };
  }
  async close(actor, cameraId, sessionId) {
    const session = await this.owned(actor, cameraId, sessionId);
    await this.terminate(session);
    return { id: String(session._id), status: "CLOSED" };
  }
  async terminate(session) {
    if (session.status === "CLOSED") return;
    await this.SessionModel.updateOne({ _id: session._id, status: "ACTIVE" }, { $set: { status: "CLOSING" } });
    const current = await this.SessionModel.findById(session._id).lean();
    if (!current || current.status === "CLOSED") return;
    // Deny further auth first, then retry external disconnect until confirmed/404.
    if (!this.media) throw apiError("CAMERA_MEDIA_UNCONFIGURED", "Media control is unavailable", 503);
    await this.media.closeSession(current);
    await this.SessionModel.updateOne({ _id: session._id, status: "CLOSING" }, { $set: { status: "CLOSED" } });
  }
  async authorizeMedia(input) {
    if (input?.action !== "read" || input.protocol !== "webrtc" || typeof input.token !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(input.token) || typeof input.id !== "string" ||
      !/^[a-f0-9-]{36}$/i.test(input.id)) throw apiError("CAMERA_MEDIA_DENIED", "Media request denied", 403);
    const session = await this.SessionModel.findOne({ tokenHash: digest(input.token), status: "ACTIVE", expiresAt: { $gt: this.now() } }).lean();
    if (!session) throw apiError("CAMERA_MEDIA_DENIED", "Media credential expired or revoked", 403);
    const actor = await this.resolveActor({ sub: String(session.actorId), role: session.actorRole });
    const camera = await this.camera(actor, String(session.cameraId));
    if (!sameContext(camera, session) || input.path !== camera.streamId || (session.mediaSessionId && session.mediaSessionId !== input.id))
      throw apiError("CAMERA_MEDIA_DENIED", "Media path or session mismatch", 403);
    const bound = await this.SessionModel.updateOne({ _id: session._id, status: "ACTIVE", expiresAt: { $gt: this.now() },
      $or: [{ mediaSessionId: null }, { mediaSessionId: input.id }] }, { $set: { mediaSessionId: input.id } });
    if (bound.matchedCount !== 1) throw apiError("CAMERA_MEDIA_DENIED", "Media session changed", 403);
    return true;
  }
  async sweep() {
    const candidates = () => this.SessionModel.find({ status: { $in: ["ACTIVE", "CLOSING"] },
      ...(this.sweepAfter ? { _id: { $gt: this.sweepAfter } } : {}) }).sort({ _id: 1 }).limit(100).lean();
    let sessions = await candidates();
    if (!sessions.length && this.sweepAfter) { this.sweepAfter = null; sessions = await candidates(); }
    let closed = 0, failed = 0;
    for (const session of sessions) {
      try {
      let deny = session.status === "CLOSING" || session.expiresAt <= this.now();
      if (!deny) {
        try {
          const actor = await this.resolveActor({ sub: String(session.actorId), role: session.actorRole });
          const camera = await this.camera(actor, String(session.cameraId));
          deny = !sameContext(camera, session);
        } catch (error) { if (error.statusCode >= 400 && error.statusCode < 500) deny = true; else throw error; }
      }
      if (deny) { await this.terminate(session); closed++; }
      } catch { failed++; }
    }
    this.sweepAfter = sessions.length ? sessions[sessions.length - 1]._id : null;
    return { scanned: sessions.length, closed, failed };
  }
}
module.exports = { CameraLiveService };
