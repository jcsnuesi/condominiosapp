"use strict";
const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const Camera = require("../../../models/camera");
const Gateway = require("../../../models/iotGateway");
const Recording = require("../../../models/cameraRecording");
const Event = require("../../../models/cameraEvent");
const { IoTInventoryService, scopeInput, exactObject, objectId, pageInput } = require("../../iot/application/inventoryService");
const { IoTAuthorizationService, notFound } = require("../../../service/iotAuthorization");
const { sameContext } = require("../../iot/domain/context");
const { contextIsActive } = require("../../iot/application/ingestionContext");
const { scopeFilter, apiError } = require("../../../service/iotService");
const { cameraSetup } = require("../domain/setup");
const { CameraConnectionVault } = require("../infrastructure/connectionVault");

class CameraInventoryService {
  constructor({ CameraModel = Camera, GatewayModel = Gateway, RecordingModel = Recording, EventModel = Event,
    authorization = new IoTAuthorizationService(), audit = new IoTInventoryService(), mongo = mongoose,
    activeContext = contextIsActive, storage, media, vault, now = () => new Date() } = {}) {
    Object.assign(this, { CameraModel, GatewayModel, RecordingModel, EventModel, authorization, audit, mongo, activeContext, storage, media, vault, now });
  }

  async listContexts(actor) {
    const inputs = [];
    if (actor?.role === "OWNER") {
      for (const property of actor.account.propertyDetails || []) {
        if (property.contextType === "PERSONAL_RESIDENCE" && !property.addressId) inputs.push({
          scope: { scopeType: "PERSONAL_RESIDENCE", residenceId: String(property._id) },
          label: property.residenceLabel || "Residencia personal",
        });
        else if (property.addressId && property.unitId) inputs.push({
          scope: { scopeType: "CONDOMINIUM_UNIT", condominiumId: String(property.addressId), unitId: String(property.unitId) },
          label: property.unitLabel || property.unit || "Unidad residencial",
        });
      }
    } else if (["ADMIN", "STAFF_ADMIN", "STAFF"].includes(actor?.role)) {
      const condos = await this.authorization.CondominiumModel.find({ organizationId: actor.organizationId, status: "active",
        ...(actor.scope?.mode === "ALL" ? {} : { _id: { $in: actor.scope?.condominiumIds || [] } }) })
        .select("alias").limit(100).lean();
      for (const condo of condos) inputs.push({ scope: { scopeType: "COMMON_AREA", condominiumId: String(condo._id) },
        label: `${condo.alias || "Condominio"} · Áreas comunes` });
    }
    const contexts = [], seen = new Set();
    for (const input of inputs.slice(0, 100)) {
      const key = JSON.stringify(input.scope);
      if (seen.has(key)) continue;
      try { await this.scope(actor, input.scope, "cameras.read"); contexts.push(input); seen.add(key); }
      catch (error) { if (![403, 404].includes(error.statusCode)) throw error; }
    }
    return contexts;
  }

  async scope(actor, input, permission) {
    const scope = await this.authorization.canCreateDevice(actor, scopeInput(input), permission);
    if (!(await this.activeContext(scope))) throw notFound();
    return scope;
  }

  async getCamera(actor, id, permission = "cameras.read") {
    const camera = await this.CameraModel.findById(objectId(id)).lean();
    if (!camera) throw notFound();
    await this.authorization.assertDevicePermission(actor, camera, permission);
    if (!(await this.activeContext(camera))) throw notFound();
    return camera;
  }

  async listCameras(actor, scope, pagination = {}) {
    const context = await this.scope(actor, scope, "cameras.read"), page = pageInput(pagination);
    const items = await this.CameraModel.find({ ...scopeFilter(context), ...(page.after ? { _id: { $gt: page.after } } : {}) })
      .sort({ _id: 1 }).limit(page.limit + 1).lean();
    return { items: items.slice(0, page.limit), nextCursor: items.length > page.limit ? String(items[page.limit - 1]._id) : null };
  }

  async createCamera(actor, input, request = {}) {
    exactObject(input, ["scope", "displayName", "gatewayId", "protocol", "recordingMode", "idempotencyKey", "setup"]);
    const setup = input.setup === undefined ? undefined : cameraSetup(input.setup);
    const vault = setup ? (this.vault || new CameraConnectionVault()) : undefined;
    const fingerprint = setup ? vault.fingerprint(setup) : undefined;
    const recordingMode = setup?.metadata.motionDeclaration === "NO" ? "NONE" : input.recordingMode || "EVENT";
    if (typeof input.displayName !== "string" || !input.displayName.trim() || input.displayName.trim().length > 120 ||
      typeof input.idempotencyKey !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(input.idempotencyKey) ||
      !["RTSP", "ONVIF"].includes(input.protocol) || !["NONE", "EVENT", "BUFFER"].includes(input.recordingMode || "NONE"))
      throw apiError("CAMERA_INPUT_INVALID", "Invalid camera registration", 422);
    const scope = await this.scope(actor, input.scope, "cameras.manage"), gatewayId = objectId(input.gatewayId);
    const matches = (previous) => {
      if (!sameContext(previous, scope) || String(previous.gatewayId) !== gatewayId || previous.displayName !== input.displayName.trim() ||
        previous.protocol !== input.protocol || previous.recordingMode !== recordingMode || previous.setupFingerprint !== fingerprint)
        throw apiError("CAMERA_IDEMPOTENCY_MISMATCH", "Registration key reused", 409);
      return previous;
    };
    const previous = await this.CameraModel.findOne({ createdBy: actor.account._id, requestKey: input.idempotencyKey }).select("+setupFingerprint").lean();
    if (previous) return matches(previous);
    const session = await this.mongo.startSession();
    let camera;
    try {
      await session.withTransaction(async () => {
        const gateway = await this.GatewayModel.findById(gatewayId).session(session).lean();
        if (!gateway || gateway.status !== "ACTIVE" || !sameContext(gateway, scope) || !(await this.activeContext(scope, session))) throw notFound();
        const active = await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE" }, { $inc: { ingestionRevision: 1 } }, { session });
        if (active.modifiedCount !== 1) throw notFound();
        const _id = new mongoose.Types.ObjectId();
        [camera] = await this.CameraModel.create([{ ...scope, _id, displayName: input.displayName.trim(), gatewayId,
          protocol: input.protocol, recordingMode, streamId: `camera-${randomUUID()}`,
          ...(setup ? { equipment: setup.metadata, sealedConnection: vault.seal(String(_id), setup.rtspSource), setupFingerprint: fingerprint,
            configurationVersion: 1, motionStatus: setup.metadata.motionDeclaration === "NO" ? "UNAVAILABLE" : "UNVERIFIED" } : {}),
          secretRef: `camera/${_id}`, createdBy: actor.account._id, requestKey: input.idempotencyKey }], { session });
        await this.audit.audit(actor, camera, "CAMERA_REGISTERED", { cameraId: String(_id) }, request, session);
      });
      return camera.toObject();
    } catch (error) {
      if (error.code === 11000) {
        const winner = await this.CameraModel.findOne({ createdBy: actor.account._id, requestKey: input.idempotencyKey }).select("+setupFingerprint").lean();
        if (winner) return matches(winner);
      }
      throw error;
    } finally { await session.endSession(); }
  }

  async updateCamera(actor, id, input, request = {}) {
    exactObject(input, ["displayName", "status"]);
    if (!Object.keys(input).length || (input.displayName !== undefined &&
      (typeof input.displayName !== "string" || !input.displayName.trim() || input.displayName.trim().length > 120)) ||
      (input.status !== undefined && !["DISABLED", "REVOKED", "PROVISIONING"].includes(input.status)))
      throw apiError("CAMERA_INPUT_INVALID", "Invalid camera update", 422);
    const camera = await this.getCamera(actor, id, "cameras.manage");
    if (camera.status === "REVOKED") throw apiError("CAMERA_REVOKED", "Revoked camera cannot be changed", 409);
    if (input.status === "PROVISIONING" && (camera.status !== "DISABLED" || !camera.configurationVersion))
      throw apiError("CAMERA_INPUT_INVALID", "Only disabled guided cameras can reconnect", 422);
    const changes = { ...(input.displayName !== undefined ? { displayName: input.displayName.trim() } : {}),
      ...(input.status ? { status: input.status } : {}) };
    const session = await this.mongo.startSession();
    try {
      await session.withTransaction(async () => {
        if (input.status === "PROVISIONING") {
          const gateway = await this.GatewayModel.findById(camera.gatewayId).session(session).lean();
          if (!gateway || gateway.status !== "ACTIVE" || !sameContext(gateway, camera) || !(await this.activeContext(camera, session))) throw notFound();
          await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE" }, { $inc: { ingestionRevision: 1 } }, { session });
        }
        const changed = await this.CameraModel.updateOne({ _id: camera._id, status: camera.status, revision: camera.revision },
          { $set: changes, $inc: { revision: 1 } }, { session, runValidators: true });
        if (changed.modifiedCount !== 1) throw apiError("CAMERA_CONFLICT", "Camera changed concurrently", 409);
        await this.audit.audit(actor, camera, "CAMERA_UPDATED", { cameraId: String(camera._id), ...changes }, request, session);
      });
      return { ...camera, ...changes };
    } finally { await session.endSession(); }
  }

  async configureCamera(actor, id) {
    const camera = await this.getCamera(actor, id, "cameras.manage");
    // Opaque stream path/reference only; credentials are entered on the gateway.
    return { streamId: camera.streamId, gatewayId: String(camera.gatewayId), secretRef: `camera/${camera._id}` };
  }

  async updateSetup(actor, id, input, request = {}) {
    const setup = cameraSetup(input), vault = this.vault || new CameraConnectionVault();
    const camera = await this.getCamera(actor, id, "cameras.manage");
    if (camera.status === "REVOKED") throw apiError("CAMERA_REVOKED", "Revoked camera cannot be configured", 409);
    const session = await this.mongo.startSession();
    try {
      await session.withTransaction(async () => {
        const gateway = await this.GatewayModel.findById(camera.gatewayId).session(session).lean();
        if (!gateway || gateway.status !== "ACTIVE" || !sameContext(gateway, camera) || !(await this.activeContext(camera, session))) throw notFound();
        await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE" }, { $inc: { ingestionRevision: 1 } }, { session });
        const changed = await this.CameraModel.updateOne({ _id: camera._id, revision: camera.revision, status: camera.status }, {
          $set: { equipment: setup.metadata, sealedConnection: vault.seal(String(camera._id), setup.rtspSource), setupFingerprint: vault.fingerprint(setup),
            status: "PROVISIONING", recordingMode: setup.metadata.motionDeclaration === "NO" ? "NONE" : "EVENT",
            motionStatus: setup.metadata.motionDeclaration === "NO" ? "UNAVAILABLE" : "UNVERIFIED" },
          $inc: { revision: 1, configurationVersion: 1 },
        }, { session, runValidators: true });
        if (changed.modifiedCount !== 1) throw apiError("CAMERA_CONFLICT", "Camera changed; retry configuration", 409);
        await this.audit.audit(actor, camera, "CAMERA_CONNECTION_UPDATED", { cameraId: String(camera._id) }, request, session);
      });
      return this.getCamera(actor, id, "cameras.manage");
    } finally { await session.endSession(); }
  }

  async gatewayConfiguration(identity, input) {
    exactObject(input, ["after"]);
    if (typeof identity?.authenticatedThingName !== "string") throw notFound();
    const gateway = await this.GatewayModel.findOne({ awsThingName: identity.authenticatedThingName, status: "ACTIVE" }).lean();
    if (!gateway || !(await this.activeContext(gateway))) throw notFound();
    const after = input.after ? objectId(input.after) : undefined;
    const cameras = await this.CameraModel.find({ gatewayId: gateway._id, ...scopeFilter(gateway),
      configurationVersion: { $gt: 0 }, ...(after ? { _id: { $gt: after } } : {}) }).select("+sealedConnection").sort({ _id: 1 }).limit(51).lean();
    const vault = cameras.some((c) => ["ACTIVE", "PROVISIONING"].includes(c.status)) ? this.vault || new CameraConnectionVault() : undefined;
    return { cameras: cameras.slice(0, 50).map((camera) => ({ cameraId: String(camera._id), streamId: camera.streamId,
      enabled: ["ACTIVE", "PROVISIONING"].includes(camera.status), recordingEnabled: camera.status === "ACTIVE" && camera.recordingMode !== "NONE",
      channel: String(camera.equipment.channel), configurationVersion: camera.configurationVersion,
      ...(["ACTIVE", "PROVISIONING"].includes(camera.status) ? { rtspSource: vault.open(String(camera._id), camera.sealedConnection) } : {}),
    })), nextCursor: cameras.length > 50 ? String(cameras[49]._id) : null };
  }

  async activateCamera(actor, id, request = {}) {
    const camera = await this.getCamera(actor, id, "cameras.manage");
    if (!["PROVISIONING", "DISABLED"].includes(camera.status)) throw apiError("CAMERA_CONFLICT", "Camera cannot be activated from this state", 409);
    if (!this.media?.inspectPath) throw apiError("CAMERA_MEDIA_UNCONFIGURED", "Media gateway is not configured", 503);
    const probe = await this.media.inspectPath(camera);
    if (!probe.ready) throw apiError("CAMERA_NOT_READY", "Connect the camera stream before activation", 409);
    if (probe.videoCodec !== "H264") throw apiError("CAMERA_CODEC_UNSUPPORTED", "Configura el stream del equipo en H.264 y comprueba de nuevo", 422);
    const session = await this.mongo.startSession();
    try {
      await session.withTransaction(async () => {
        const gateway = await this.GatewayModel.findById(camera.gatewayId).session(session).lean();
        if (!gateway || gateway.status !== "ACTIVE" || !sameContext(gateway, camera) || !(await this.activeContext(camera, session))) throw notFound();
        const active = await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE" }, { $inc: { ingestionRevision: 1 } }, { session });
        const changed = await this.CameraModel.updateOne({ _id: camera._id, status: camera.status, revision: camera.revision },
          { $set: { status: "ACTIVE" }, $inc: { revision: 1 } }, { session, runValidators: true });
        if (active.modifiedCount !== 1 || changed.modifiedCount !== 1) throw apiError("CAMERA_CONFLICT", "Camera or gateway changed", 409);
        await this.audit.audit(actor, camera, "CAMERA_ACTIVATED", { cameraId: String(camera._id) }, request, session);
      });
      return { ...camera, status: "ACTIVE" };
    } finally { await session.endSession(); }
  }

  async listTimeline(actor, cameraId, input, kind) {
    exactObject(input, ["from", "to", "limit", "after"]);
    const camera = await this.getCamera(actor, cameraId, "cameras.recordings.read"), page = pageInput(input);
    const from = new Date(input.from), to = new Date(input.to);
    if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from > to || to - from > 31 * 86400000)
      throw apiError("CAMERA_RANGE_INVALID", "A date range of at most 31 days is required", 422);
    const Model = kind === "events" ? this.EventModel : this.RecordingModel;
    const field = "occurredAt";
    const items = await Model.find({ ...scopeFilter(camera), cameraId: camera._id, [field]: { $gte: from, $lte: to },
      ...(page.after ? { _id: { $gt: page.after } } : {}) }).sort({ _id: 1 }).limit(page.limit + 1).lean();
    return { items: items.slice(0, page.limit), nextCursor: items.length > page.limit ? String(items[page.limit - 1]._id) : null };
  }

  async playback(actor, id) {
    const recording = await this.RecordingModel.findById(objectId(id)).select("+objectKey").lean();
    if (!recording) throw notFound();
    const camera = await this.getCamera(actor, String(recording.cameraId), "cameras.recordings.read");
    if (!sameContext(recording, camera)) throw notFound();
    if (recording.status !== "AVAILABLE" || recording.expiresAt <= this.now())
      throw apiError("CAMERA_RECORDING_UNAVAILABLE", "Recording is unavailable or expired", 409);
    if (!this.storage?.presignRead) throw apiError("CAMERA_STORAGE_UNCONFIGURED", "Recording storage is not configured", 503);
    // Trusted provider must sign exactly this persisted object, with a maximum 60-second lifetime.
    const ttlSeconds = Math.min(60, Math.floor((recording.expiresAt - this.now()) / 1000));
    if (ttlSeconds < 1) throw apiError("CAMERA_RECORDING_UNAVAILABLE", "Recording expired", 409);
    const url = await this.storage.presignRead({ objectKey: recording.objectKey, ttlSeconds });
    if (typeof url !== "string" || !url.startsWith("https://")) throw apiError("CAMERA_STORAGE_INVALID", "Invalid recording URL", 502);
    return { url, expiresAt: new Date(this.now().getTime() + ttlSeconds * 1000) };
  }
}
module.exports = { CameraInventoryService };
