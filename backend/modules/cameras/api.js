"use strict";
const express = require("express");
const { authenticated } = require("../../middleware/auth");
const { requirePermission } = require("../../middleware/organizationAuth");
const { exactObject } = require("../iot/application/inventoryService");
const { CameraInventoryService } = require("./application/inventoryService");
const { timingSafeEqual } = require("node:crypto");
const { cameraRuntime } = require("./runtime");

function cameraResponse(camera) {
  return { id: String(camera._id), displayName: camera.displayName, scopeType: camera.scopeType,
    gatewayId: String(camera.gatewayId), protocol: camera.protocol, recordingMode: camera.recordingMode,
    status: camera.status, createdAt: camera.createdAt, motionClipSeconds: 30, retentionDays: 7,
    equipment: camera.equipment ? { manufacturer: camera.equipment.manufacturer, model: camera.equipment.model,
      firmware: camera.equipment.firmware, sourceKind: camera.equipment.sourceKind, channel: camera.equipment.channel,
      motionDeclaration: camera.equipment.motionDeclaration } : null,
    motionStatus: camera.motionStatus || "UNVERIFIED", configurationVersion: camera.configurationVersion || 0 };
}
function recordingResponse(recording) {
  return { id: String(recording._id), cameraId: String(recording.cameraId), eventId: String(recording.eventId),
    status: recording.status, kind: recording.kind, durationSeconds: recording.durationSeconds,
    sizeBytes: recording.sizeBytes, expiresAt: recording.expiresAt, occurredAt: recording.occurredAt, createdAt: recording.createdAt };
}
function eventResponse(event) {
  return { id: String(event._id), cameraId: String(event.cameraId), source: event.source,
    eventType: event.eventType, occurredAt: event.occurredAt };
}
function createCameraRouter({ service = cameraRuntime().inventory, live = cameraRuntime().live, events = cameraRuntime().events, authenticate = authenticated,
  enabled = () => process.env.CAMERAS_ENABLED === "true" } = {}) {
  const router = express.Router();
  function route(method, path, permission, operation, status = 200) {
    router[method](path, authenticate, requirePermission(permission), async (req, res) => {
      if (!enabled()) return res.status(503).send({ success: false, data: null,
        error: { message: "Camera integration disabled" }, code: "CAMERAS_DISABLED" });
      try { res.status(status).send({ success: true, data: await operation(req), error: null, code: status === 201 ? "CREATED" : "OK" }); }
      catch (error) {
        const status = error.statusCode || (["ValidationError", "StrictModeError"].includes(error.name) ? 422 : 500);
        res.status(status).send({ success: false, data: null, error: {
          message: status < 500 ? error.message : "Camera operation could not be completed",
        }, code: typeof error.code === "string" ? error.code : "CAMERA_REQUEST_FAILED" });
      }
    });
  }
  route("get", "/cameras/contexts", "cameras.read", async (req) => ({ contexts: await service.listContexts(req.auth) }));
  route("get", "/cameras", "cameras.read", async (req) => {
    exactObject(req.query, ["scopeType", "condominiumId", "unitId", "residenceId", "limit", "after"]);
    const { limit, after, ...scope } = req.query;
    const page = await service.listCameras(req.auth, scope, { limit, after });
    return { cameras: page.items.map(cameraResponse), nextCursor: page.nextCursor };
  });
  route("post", "/cameras", "cameras.manage", async (req) => ({ camera: cameraResponse(await service.createCamera(req.auth, req.body, req)) }), 201);
  route("get", "/cameras/:id", "cameras.read", async (req) => ({ camera: cameraResponse(await service.getCamera(req.auth, req.params.id)) }));
  route("patch", "/cameras/:id", "cameras.manage", async (req) => ({ camera: cameraResponse(await service.updateCamera(req.auth, req.params.id, req.body, req)) }));
  route("post", "/cameras/:id/setup", "cameras.manage", async (req) => ({ camera: cameraResponse(await service.updateSetup(req.auth, req.params.id, req.body, req)) }));
  route("post", "/cameras/:id/activate", "cameras.manage", async (req) => {
    exactObject(req.body, []); return { camera: cameraResponse(await service.activateCamera(req.auth, req.params.id, req)) };
  });
  route("get", "/cameras/:id/configuration", "cameras.manage", (req) => service.configureCamera(req.auth, req.params.id));
  for (const kind of ["events", "recordings"]) route("get", `/cameras/:id/${kind}`, "cameras.recordings.read", async (req) => {
    const page = await service.listTimeline(req.auth, req.params.id, req.query, kind);
    return { [kind]: page.items.map(kind === "events" ? eventResponse : recordingResponse), nextCursor: page.nextCursor };
  });
  route("post", "/camera-recordings/:id/playback", "cameras.recordings.read", (req) => service.playback(req.auth, req.params.id));
  route("post", "/cameras/:id/live-session", "cameras.live", (req) => live.create(req.auth, req.params.id), 201);
  route("post", "/cameras/:id/live-session/:sessionId/renew", "cameras.live", (req) => live.renew(req.auth, req.params.id, req.params.sessionId));
  route("delete", "/cameras/:id/live-session/:sessionId", "cameras.live", (req) => live.close(req.auth, req.params.id, req.params.sessionId));
  // Private trusted proxy inserts this header. Never expose the service key to the browser.
  router.post("/internal/camera-media/auth", async (req, res) => {
    const expected = process.env.CAMERA_MEDIA_AUTH_SERVICE_KEY, received = req.headers["x-comunard-media-key"];
    if (!enabled() || typeof expected !== "string" || expected.length < 32 || typeof received !== "string" ||
      Buffer.byteLength(expected) !== Buffer.byteLength(received) || !timingSafeEqual(Buffer.from(expected), Buffer.from(received)))
      return res.sendStatus(403);
    try {
      if (req.body?.action === "api") {
        const user = process.env.CAMERA_MEDIA_CONTROL_USER, password = process.env.CAMERA_MEDIA_CONTROL_PASSWORD;
        if (!user || !password || password.length < 32 || req.body.user !== user || typeof req.body.password !== "string" ||
          Buffer.byteLength(password) !== Buffer.byteLength(req.body.password) ||
          !timingSafeEqual(Buffer.from(password), Buffer.from(req.body.password))) return res.sendStatus(403);
      } else await live.authorizeMedia(req.body);
      res.sendStatus(200);
    } catch { res.sendStatus(403); }
  });
  // Initial single-gateway service binding; deploy behind private HTTPS/mTLS.
  function internal(path, operation) {
    router.post(path, async (req, res) => {
      const expected = process.env.CAMERA_INGEST_SERVICE_KEY, received = req.headers["x-comunard-camera-key"];
      const thing = process.env.CAMERA_INGEST_THING_NAME;
      if (!enabled() || typeof expected !== "string" || expected.length < 32 || typeof received !== "string" ||
        Buffer.byteLength(expected) !== Buffer.byteLength(received) || !timingSafeEqual(Buffer.from(expected), Buffer.from(received)) ||
        typeof thing !== "string" || !/^[A-Za-z0-9:_-]{1,128}$/.test(thing)) return res.sendStatus(403);
      try { res.set("Cache-Control", "no-store"); res.send({ success: true, data: await operation({ authenticatedThingName: thing }, req), error: null, code: "OK" }); }
      catch (error) {
        const status = error.statusCode || 500;
        res.status(status).send({ success: false, data: null, error: { message: status < 500 ? error.message : "Camera ingest failed" },
          code: typeof error.code === "string" ? error.code : "CAMERA_INGEST_FAILED" });
      }
    });
  }
  internal("/internal/cameras/events", (identity, req) => events.ingestEvent(identity, req.body));
  internal("/internal/cameras/configuration", (identity, req) => service.gatewayConfiguration(identity, req.body));
  internal("/internal/cameras/recordings", async (identity, req) => {
    const recording = await events.planRecording(identity, req.body);
    return { recordingId: String(recording._id), status: recording.status };
  });
  internal("/internal/cameras/:cameraId/recordings/:recordingId/upload", (identity, req) => {
    exactObject(req.body, []); return events.uploadPermission(identity, req.params.cameraId, req.params.recordingId);
  });
  internal("/internal/cameras/:cameraId/recordings/:recordingId/confirm", (identity, req) => {
    exactObject(req.body, []); return events.confirmUpload(identity, req.params.cameraId, req.params.recordingId);
  });
  return router;
}
module.exports = { createCameraRouter, cameraResponse, eventResponse, recordingResponse };
