"use strict";
const mongoose = require("mongoose");
const { createHash } = require("node:crypto");
const Camera = require("../../../models/camera");
const Gateway = require("../../../models/iotGateway");
const Mapping = require("../../../models/iotIntegrationMapping");
const Event = require("../../../models/cameraEvent");
const Recording = require("../../../models/cameraRecording");
const { exactObject, objectId } = require("../../iot/application/inventoryService");
const { contextIsActive } = require("../../iot/application/ingestionContext");
const { sameContext } = require("../../iot/domain/context");
const { scopeFilter, apiError } = require("../../../service/iotService");

class CameraEventService {
  constructor({ CameraModel = Camera, GatewayModel = Gateway, MappingModel = Mapping, EventModel = Event,
    RecordingModel = Recording, mongo = mongoose, activeContext = contextIsActive, storage,
    retentionDays = 7, now = () => new Date(), enabled = () => process.env.CAMERAS_ENABLED === "true" } = {}) {
    Object.assign(this, { CameraModel, GatewayModel, MappingModel, EventModel, RecordingModel, mongo, activeContext, storage, retentionDays, now, enabled });
  }

  async target(identity, cameraId, session) {
    if (!this.enabled()) throw apiError("CAMERAS_DISABLED", "Camera integration disabled", 503);
    if (typeof identity?.authenticatedThingName !== "string" || !/^[A-Za-z0-9:_-]{1,128}$/.test(identity.authenticatedThingName))
      throw apiError("CAMERA_IDENTITY_INVALID", "Authenticated gateway identity required", 403);
    const camera = await this.CameraModel.findById(objectId(cameraId)).session(session).lean();
    const gateway = await this.GatewayModel.findOne({ awsThingName: identity.authenticatedThingName, status: "ACTIVE" }).session(session).lean();
    if (!camera || camera.status !== "ACTIVE" || !gateway || String(camera.gatewayId) !== String(gateway._id) || !sameContext(camera, gateway) ||
      !(await this.activeContext(camera, session))) throw apiError("CAMERA_BINDING_INVALID", "Camera binding or context is inactive", 403);
    const mapping = await this.MappingModel.findOne({ resourceType: "GATEWAY", resourceId: gateway._id,
      integration: "AWS", status: "SYNCED", externalId: identity.authenticatedThingName }).session(session).lean();
    if (!mapping || !sameContext(mapping, gateway)) throw apiError("CAMERA_BINDING_INVALID", "Gateway mapping is inactive", 403);
    const active = await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE" }, { $inc: { ingestionRevision: 1 } }, { session });
    const current = await this.CameraModel.updateOne({ _id: camera._id, status: "ACTIVE", revision: camera.revision }, { $inc: { revision: 1 } }, { session });
    if (active.modifiedCount !== 1 || current.modifiedCount !== 1) throw apiError("CAMERA_INGESTION_CONFLICT", "Camera changed; retry event", 409);
    return camera;
  }

  async ingestEvent(identity, input) {
    exactObject(input, ["schemaVersion", "cameraId", "sourceEventId", "source", "eventType", "occurredAt"]);
    if (input.schemaVersion !== 1 || typeof input.sourceEventId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(input.sourceEventId) ||
      !["CAMERA", "FRIGATE"].includes(input.source) || !["camera.motion", "camera.person", "camera.vehicle"].includes(input.eventType))
      throw apiError("CAMERA_EVENT_INVALID", "Unsupported camera event", 422);
    const occurredAt = new Date(input.occurredAt), receivedAt = this.now();
    if (typeof input.occurredAt !== "string" || !Number.isFinite(occurredAt.getTime()) || occurredAt.toISOString() !== input.occurredAt || occurredAt > receivedAt)
      throw apiError("CAMERA_EVENT_INVALID", "Invalid camera event timestamp", 422);
    const contentHash = createHash("sha256").update(JSON.stringify({ schemaVersion: 1, cameraId: input.cameraId,
      sourceEventId: input.sourceEventId, source: input.source, eventType: input.eventType, occurredAt: input.occurredAt })).digest("hex");
    const session = await this.mongo.startSession();
    let result;
    try {
      await session.withTransaction(async () => {
        const camera = await this.target(identity, input.cameraId, session);
        const previous = await this.EventModel.findOne({ gatewayId: camera.gatewayId, sourceEventId: input.sourceEventId }).session(session).lean();
        if (previous) {
          if (previous.contentHash !== contentHash) throw apiError("CAMERA_EVENT_CONFLICT", "Event identifier reused", 409);
          result = { eventId: String(previous._id), duplicate: true }; return;
        }
        // Motion is retained evidence, not a live actuator trigger. Outage uploads may arrive within retention.
        if (receivedAt - occurredAt >= this.retentionDays * 86400000) throw apiError("CAMERA_EVENT_STALE", "Camera event retention expired", 422);
        const [event] = await this.EventModel.create([{ ...scopeFilter(camera), cameraId: camera._id, gatewayId: camera.gatewayId,
          sourceEventId: input.sourceEventId, source: input.source, eventType: input.eventType, occurredAt, receivedAt, contentHash }], { session });
        if (input.eventType === "camera.motion") await this.CameraModel.updateOne({ _id: camera._id },
          { $set: { motionStatus: "CONFIRMED" } }, { session });
        result = { eventId: String(event._id), duplicate: false };
      });
      return result;
    } catch (error) {
      if (error.code === 11000) throw apiError("CAMERA_INGESTION_CONFLICT", "Concurrent event; retry original", 409);
      throw error;
    } finally { await session.endSession(); }
  }

  async planRecording(identity, input) {
    exactObject(input, ["cameraId", "eventId", "kind", "checksum", "sizeBytes", "durationSeconds"]);
    if (!Number.isInteger(this.retentionDays) || this.retentionDays < 1 || this.retentionDays > 30)
      throw apiError("CAMERA_RETENTION_UNCONFIGURED", "Pilot retention must be selected", 503);
    if (!["CLIP", "SNAPSHOT"].includes(input.kind) || !/^[a-f0-9]{64}$/.test(input.checksum || "") ||
      !Number.isSafeInteger(input.sizeBytes) || input.sizeBytes < 1 || input.sizeBytes > 100 * 1024 * 1024 ||
      !Number.isFinite(input.durationSeconds) || input.durationSeconds < 0 || input.durationSeconds > 30 ||
      (input.kind === "SNAPSHOT" && input.durationSeconds !== 0))
      throw apiError("CAMERA_RECORDING_INVALID", "Invalid recording manifest", 422);
    const session = await this.mongo.startSession();
    let recording;
    try {
      await session.withTransaction(async () => {
        const camera = await this.target(identity, input.cameraId, session);
        if (camera.recordingMode === "NONE") throw apiError("CAMERA_RECORDING_DISABLED", "Camera recording disabled", 409);
        const event = await this.EventModel.findById(objectId(input.eventId)).session(session).lean();
        if (!event || String(event.cameraId) !== String(camera._id) || !sameContext(camera, event))
          throw apiError("CAMERA_BINDING_INVALID", "Recording event does not belong to camera", 403);
        if (event.eventType !== "camera.motion") throw apiError("CAMERA_RECORDING_INVALID", "Only motion events generate recordings", 422);
        const previous = await this.RecordingModel.findOne({ eventId: event._id, kind: input.kind }).session(session).select("+objectKey").lean();
        if (previous) {
          if (previous.checksum !== input.checksum || previous.sizeBytes !== input.sizeBytes || previous.durationSeconds !== input.durationSeconds)
            throw apiError("CAMERA_RECORDING_CONFLICT", "Manifest differs from original", 409);
          recording = previous; return;
        }
        const expiresAt = new Date(event.occurredAt.getTime() + this.retentionDays * 86400000);
        if (expiresAt <= this.now()) throw apiError("CAMERA_RECORDING_EXPIRED", "Event retention expired", 409);
        const _id = new mongoose.Types.ObjectId();
        const [created] = await this.RecordingModel.create([{ ...scopeFilter(camera), _id, cameraId: camera._id, eventId: event._id,
          objectKey: `camera/${camera._id}/${event._id}/${_id}`, checksum: input.checksum, sizeBytes: input.sizeBytes,
          kind: input.kind, durationSeconds: input.durationSeconds, occurredAt: event.occurredAt, expiresAt }], { session });
        recording = created.toObject();
      });
      return recording;
    } catch (error) {
      if (error.code === 11000) throw apiError("CAMERA_INGESTION_CONFLICT", "Concurrent manifest; retry original", 409);
      throw error;
    } finally { await session.endSession(); }
  }

  async confirmUpload(identity, cameraId, recordingId) {
    if (!this.storage?.inspectObject) throw apiError("CAMERA_STORAGE_UNCONFIGURED", "Storage verifier required", 503);
    const recording = await this.RecordingModel.findById(objectId(recordingId)).select("+objectKey").lean();
    if (!recording || String(recording.cameraId) !== objectId(cameraId)) throw apiError("CAMERA_BINDING_INVALID", "Recording target mismatch", 403);
    // Validate identity before external inspection; this read never makes an asset AVAILABLE.
    const preflight = await this.mongo.startSession();
    try { await preflight.withTransaction(async () => { await this.target(identity, cameraId, preflight); }); }
    finally { await preflight.endSession(); }
    if (recording.expiresAt <= this.now()) throw apiError("CAMERA_RECORDING_EXPIRED", "Recording retention expired", 409);
    if (recording.status === "AVAILABLE") return { recordingId, status: "AVAILABLE" };
    if (recording.status !== "PENDING") throw apiError("CAMERA_RECORDING_UNAVAILABLE", "Recording is unavailable", 409);
    const stored = await this.storage.inspectObject(recording.objectKey);
    if (!stored || stored.sizeBytes !== recording.sizeBytes || stored.sha256 !== recording.checksum)
      throw apiError("CAMERA_UPLOAD_UNVERIFIED", "Stored object size or checksum differs", 409);
    const session = await this.mongo.startSession();
    try {
      await session.withTransaction(async () => {
        const camera = await this.target(identity, cameraId, session);
        if (!sameContext(camera, recording) || recording.expiresAt <= this.now()) throw apiError("CAMERA_RECORDING_EXPIRED", "Recording unavailable", 409);
        const changed = await this.RecordingModel.updateOne({ _id: recording._id, status: "PENDING", expiresAt: { $gt: this.now() } },
          { $set: { status: "AVAILABLE", availableAt: this.now() } }, { session, runValidators: true });
        if (!changed.modifiedCount && recording.status !== "AVAILABLE") throw apiError("CAMERA_RECORDING_CONFLICT", "Recording changed", 409);
      });
      return { recordingId, status: "AVAILABLE" };
    } finally { await session.endSession(); }
  }

  async uploadPermission(identity, cameraId, recordingId) {
    if (!this.storage?.presignWrite) throw apiError("CAMERA_STORAGE_UNCONFIGURED", "Storage uploader is not configured", 503);
    const session = await this.mongo.startSession();
    let recording;
    try {
      await session.withTransaction(async () => {
        const camera = await this.target(identity, cameraId, session);
        recording = await this.RecordingModel.findById(objectId(recordingId)).session(session).select("+objectKey").lean();
        if (!recording || String(recording.cameraId) !== String(camera._id) || !sameContext(camera, recording) ||
          recording.status !== "PENDING" || recording.expiresAt <= this.now())
          throw apiError("CAMERA_RECORDING_UNAVAILABLE", "Recording is not eligible for upload", 409);
      });
      return this.storage.presignWrite(recording);
    } finally { await session.endSession(); }
  }
}
module.exports = { CameraEventService };
