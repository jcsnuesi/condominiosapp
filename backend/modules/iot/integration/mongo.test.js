"use strict";

// Explicit integration suite: starts its own loopback-only mongod replica set.
// It does not accept a database URI and cannot connect to the application DB.
const { before, after, test } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const net = require("node:net");
const mongoose = require("mongoose");
const Gateway = require("../../../models/iotGateway");
const Device = require("../../../models/iotDevice");
const Profile = require("../../../models/iotDeviceProfile");
const Mapping = require("../../../models/iotIntegrationMapping");
const Inbox = require("../../../models/iotIntegrationInbox");
const Event = require("../../../models/iotDeviceEvent");
const Organization = require("../../../models/organization");
const Condominium = require("../../../models/condominio");
const Owner = require("../../../models/owners");
const Command = require("../../../models/iotCommand");
const Outbox = require("../../../models/iotIntegrationOutbox");
const Audit = require("../../../models/iotAuditEvent");
const Camera = require("../../../models/camera");
const CameraEvent = require("../../../models/cameraEvent");
const Recording = require("../../../models/cameraRecording");
const LiveSession = require("../../../models/cameraLiveSession");
const { CameraInventoryService } = require("../../cameras/application/inventoryService");
const { CameraEventService } = require("../../cameras/application/eventService");
const { CameraLiveService } = require("../../cameras/application/liveService");
const { IoTCommandService } = require("../application/commandService");
const { IoTCommandDispatcher } = require("../application/commandDispatcher");
const { IoTCommandExpiryService } = require("../application/commandExpiryService");
const Feedback = require("../../../models/iotCommandFeedback");
const { IoTCommandFeedbackService } = require("../application/commandFeedbackService");
const { GatewayCommandHandler } = require("../../../../edge/gateway-agent/command-handler");
const { GatewayEventUploader } = require("../../../../edge/gateway-agent/event-uploader");
const { IoTIngestionService } = require("../application/ingestionService");
const { IoTPresenceService } = require("../application/presenceService");
const { IoTHeartbeatService } = require("../application/heartbeatService");
const id = () => new mongoose.Types.ObjectId();
const now = new Date("2026-10-07T12:00:00.000Z");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let child, startupError, adminConnection, dataDirectory, edgeDirectory;
const temporaryRoot = path.resolve(__dirname, "../../../../tmp");

before(async () => {
  const root = temporaryRoot;
  await fs.mkdir(root, { recursive: true });
  const directory = await fs.mkdtemp(path.join(root, "iot-mongo-"));
  dataDirectory = directory;
  const server = net.createServer();
  const port = await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
  await new Promise((resolve) => server.close(resolve));
  child = spawn(process.env.IOT_TEST_MONGOD || "mongod", ["--dbpath", directory, "--port", String(port),
    "--bind_ip", "127.0.0.1", "--replSet", "codex-iot-isolated", "--logpath", path.join(directory, "mongod.log")],
  { windowsHide: true, stdio: "ignore" });
  child.on("error", (error) => { startupError = error; });
  const uri = `mongodb://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (startupError) throw startupError;
    if (child.exitCode !== null) throw new Error("Isolated mongod exited before initialization");
    try {
      adminConnection = await mongoose.createConnection(`${uri}/admin?directConnection=true`, { serverSelectionTimeoutMS: 500 }).asPromise();
      break;
    } catch { await sleep(250); }
  }
  assert.ok(adminConnection, "isolated MongoDB must start");
  await adminConnection.db.admin().command({ replSetInitiate: { _id: "codex-iot-isolated", members: [{ _id: 0, host: `127.0.0.1:${port}` }] } });
  let primary = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    primary = (await adminConnection.db.admin().command({ hello: 1 })).isWritablePrimary;
    if (primary) break;
    await sleep(250);
  }
  assert.equal(primary, true);
  await adminConnection.close(); adminConnection = null;
  await mongoose.connect(`${uri}/codex_iot_synthetic?replicaSet=codex-iot-isolated&directConnection=true`, { serverSelectionTimeoutMS: 5000 });
  for (const model of [Gateway, Device, Profile, Mapping, Inbox, Event, Command, Outbox, Audit, Feedback, Camera, CameraEvent, Recording, LiveSession]) await model.init();
}, { timeout: 60000 });

after(async () => {
  if (adminConnection) await adminConnection.close();
  await mongoose.disconnect();
  if (edgeDirectory) {
    const target = path.resolve(edgeDirectory);
    if (!target.startsWith(`${temporaryRoot}${path.sep}`) || !path.basename(target).startsWith("iot-edge-")) throw new Error("Unsafe edge test cleanup");
    await fs.rm(target, { recursive: true, force: true });
  }
  if (child && child.exitCode === null) {
    const exit = new Promise((resolve) => child.once("exit", () => resolve(true)));
    child.kill();
    await Promise.race([exit, sleep(5000).then(() => false)]);
  }
  if (dataDirectory && child && (child.exitCode !== null || child.signalCode !== null)) {
    const target = path.resolve(dataDirectory);
    if (!target.startsWith(`${temporaryRoot}${path.sep}`) || !path.basename(target).startsWith("iot-mongo-")) {
      throw new Error("Refusing cleanup outside the isolated test directory");
    }
    await fs.rm(target, { recursive: true, force: true });
  }
});

async function fixture(kind = "COMMON_AREA", sharedContext = null) {
  let context;
  if (kind === "PERSONAL_RESIDENCE") {
    const ownerId = id(), residenceId = id();
    await Owner.collection.insertOne({ _id: ownerId, status: "active", emailVerified: true,
      email: `synthetic-${ownerId}@example.invalid`, phone: `synthetic-${ownerId}`,
      propertyDetails: [{ _id: residenceId, contextType: kind, status_property: "active" }] });
    context = { scopeType: kind, ownerId, residenceId };
  } else {
    const organizationId = sharedContext?.organizationId || id(), condominiumId = sharedContext?.condominiumId || id(), unitId = id();
    if (sharedContext) {
      await Condominium.collection.updateOne({ _id: condominiumId }, { $push: { units: { _id: unitId, status: "active" } } });
    } else {
      await Organization.collection.insertOne({ _id: organizationId, slug: `synthetic-${organizationId}`, status: "active" });
      await Condominium.collection.insertOne({ _id: condominiumId, organizationId, status: "active", units: [{ _id: unitId, status: "active" }] });
    }
    context = { scopeType: kind, organizationId, condominiumId, ...(kind === "CONDOMINIUM_UNIT" ? { unitId } : {}) };
  }
  const profile = await Profile.create({ key: `water-${id()}`, version: 1, manufacturer: "Synthetic", model: "Water",
    protocol: "ZIGBEE", certification: "EXPERIMENTAL", deviceTypes: ["WATER_SENSOR"],
    stateFields: [{ name: "waterDetected", type: "boolean" }] });
  const gateway = await Gateway.create({ ...context, displayName: "Synthetic gateway", createdBy: id(), awsThingName: `test-${id()}`, status: "ACTIVE", adapters: ["ZIGBEE"] });
  const device = await Device.create({ ...context, displayName: "Synthetic sensor", createdBy: id(), awsThingName: `sensor-${id()}`,
    status: "ACTIVE", deviceType: "WATER_SENSOR", protocol: "ZIGBEE", gatewayId: gateway._id, profileId: profile._id, profileVersion: 1,
    bindingAddress: `address-${id()}`, shadow: { reported: { waterDetected: false } } });
  await Mapping.create({ ...context, resourceType: "GATEWAY", resourceId: gateway._id, integration: "AWS", externalId: gateway.awsThingName, status: "SYNCED" });
  const message = (patch = {}) => ({ schemaVersion: 1, messageId: `message-${id()}`, gatewayId: String(gateway._id), resourceId: String(device._id),
    sequence: 1, profileVersion: 1, occurredAt: now.toISOString(), payload: { waterDetected: true }, ...patch });
  return { context, gateway, device, message, identity: { authenticatedThingName: gateway.awsThingName } };
}

test("local camera private unit permissions preserve ownership boundaries for ADMIN and OWNER", async () => {
  const a = await fixture("CONDOMINIUM_UNIT");
  const b = await fixture("CONDOMINIUM_UNIT", a.context);
  const common = await fixture("COMMON_AREA", a.context);
  const { resolveAccessContext } = require("../../../service/authorization");
  const permissions = ["cameras.read", "cameras.manage", "cameras.live", "cameras.recordings.read"];
  async function ownerFor(home) {
    const ownerId = id();
    await Owner.collection.insertOne({ _id: ownerId, organizationId: home.context.organizationId, status: "active", emailVerified: true,
      email: `synthetic-${ownerId}@example.invalid`, phone: `synthetic-${ownerId}`,
      propertyDetails: [{ _id: id(), addressId: home.context.condominiumId, unitId: home.context.unitId,
        contextType: "CONDOMINIUM_UNIT", status_property: "active" }] });
    const actor = await resolveAccessContext({ sub: String(ownerId), role: "OWNER" });
    for (const permission of permissions) assert.ok(actor.permissions.includes(permission));
    return actor;
  }
  const ownerA = await ownerFor(a), ownerB = await ownerFor(b);
  const admin = { role: "ADMIN", account: { _id: id() }, organizationId: a.context.organizationId,
    permissions, scope: { mode: "ALL", condominiumIds: [] } };
  const inventory = new CameraInventoryService();
  const input = (home, key) => ({ scope: { scopeType: home.context.scopeType,
    condominiumId: String(home.context.condominiumId), ...(home.context.unitId ? { unitId: String(home.context.unitId) } : {}) },
    displayName: key, gatewayId: String(home.gateway._id), protocol: "RTSP", idempotencyKey: key });
  const cameraA = await inventory.createCamera(ownerA, input(a, "owner-unit-a"));
  const cameraB = await inventory.createCamera(ownerB, input(b, "owner-unit-b"));
  const cameraCommon = await inventory.createCamera(admin, input(common, "admin-common"));
  const contexts = await inventory.listContexts(ownerA);
  assert.equal(contexts.length, 1); assert.equal(contexts[0].scope.unitId, String(a.context.unitId));
  for (const permission of permissions) {
    assert.equal(String((await inventory.getCamera(ownerA, String(cameraA._id), permission))._id), String(cameraA._id));
    assert.equal(String((await inventory.getCamera(admin, String(cameraCommon._id), permission))._id), String(cameraCommon._id));
    await assert.rejects(inventory.getCamera(ownerA, String(cameraB._id), permission), { statusCode: 404 });
    await assert.rejects(inventory.getCamera(admin, String(cameraA._id), permission), { statusCode: 404 });
    await assert.rejects(inventory.getCamera(ownerA, String(cameraCommon._id), permission), { statusCode: 403 });
  }
  await assert.rejects(inventory.createCamera(ownerA, input(common, "owner-common-denied")), { statusCode: 403 });
  await assert.rejects(inventory.createCamera(admin, input(a, "admin-private-denied")), { statusCode: 403 });
  await Owner.collection.updateOne({ _id: ownerA.account._id }, { $set: { "propertyDetails.0.status_property": "inactive" } });
  for (const permission of permissions) await assert.rejects(inventory.getCamera(ownerA, String(cameraA._id), permission), { statusCode: 404 });
});

test("local camera guided setup encrypts, scopes and retries multiple camera registrations", async () => {
  const h = await fixture(), foreign = await fixture();
  const { CameraConnectionVault } = require("../../cameras/infrastructure/connectionVault");
  const vault = new CameraConnectionVault(Buffer.alloc(32, 11).toString("base64"));
  const actor = { role: "ADMIN", account: { _id: id() }, organizationId: h.context.organizationId,
    scope: { mode: "ALL", condominiumIds: [] }, permissions: ["cameras.read", "cameras.manage"] };
  const inventory = new CameraInventoryService({ vault });
  const setup = { manufacturer: "Generic vendor", model: "Model supplied by customer", firmware: "1.0", sourceKind: "DVR_NVR", channel: 1,
    motionDeclaration: "NO", connection: { host: "192.168.10.20", port: 554, path: "/channel/1", username: "local", password: "local-test-password" } };
  const input = { scope: { scopeType: "COMMON_AREA", condominiumId: String(h.context.condominiumId) }, displayName: "Camera 1",
    gatewayId: String(h.gateway._id), protocol: "RTSP", idempotencyKey: "guided-camera-1", setup };
  const first = await inventory.createCamera(actor, input);
  assert.equal(first.recordingMode, "NONE"); assert.equal(first.motionStatus, "UNAVAILABLE");
  assert.equal(String((await inventory.createCamera(actor, input))._id), String(first._id));
  await assert.rejects(inventory.createCamera(actor, { ...input, setup: { ...setup, model: "Different" } }), { code: "CAMERA_IDEMPOTENCY_MISMATCH" });
  const second = await inventory.createCamera(actor, { ...input, displayName: "Camera 2", idempotencyKey: "guided-camera-2",
    setup: { ...setup, channel: 2, motionDeclaration: "UNKNOWN", connection: { ...setup.connection, path: "/channel/2" } } });
  assert.equal(second.motionStatus, "UNVERIFIED");
  const publicRecord = await Camera.findById(first._id).lean();
  assert.equal(publicRecord.sealedConnection, undefined); assert.equal(publicRecord.setupFingerprint, undefined);
  const stored = await Camera.findById(first._id).select("+sealedConnection").lean();
  assert.ok(!stored.sealedConnection.includes(setup.connection.password));
  const configuration = await inventory.gatewayConfiguration(h.identity, {});
  assert.equal(configuration.cameras.length, 2);
  assert.equal(new URL(configuration.cameras[0].rtspSource).hostname, setup.connection.host);
  assert.equal((await inventory.gatewayConfiguration(foreign.identity, {})).cameras.length, 0);
  await inventory.updateSetup(actor, String(first._id), { ...setup, motionDeclaration: "YES" });
  assert.equal((await Camera.findById(first._id).lean()).configurationVersion, 2);
  assert.equal((await Camera.findById(first._id).lean()).motionStatus, "UNVERIFIED");
  await inventory.updateCamera(actor, String(first._id), { status: "DISABLED" });
  const disabled = (await inventory.gatewayConfiguration(h.identity, {})).cameras.find((c) => c.cameraId === String(first._id));
  assert.equal(disabled.enabled, false); assert.equal(disabled.rtspSource, undefined);
  await inventory.updateCamera(actor, String(first._id), { status: "PROVISIONING" });
  const resumed = (await inventory.gatewayConfiguration(h.identity, {})).cameras.find((c) => c.cameraId === String(first._id));
  assert.equal(resumed.enabled, true); assert.equal(resumed.recordingEnabled, false);
  assert.equal(new URL(resumed.rtspSource).hostname, setup.connection.host);
  await Gateway.updateOne({ _id: h.gateway._id }, { $set: { status: "REVOKED" } });
  await assert.rejects(inventory.gatewayConfiguration(h.identity, {}), { statusCode: 404 });
});

test("local cameras isolate private inventory and validate motion recordings before playback", async () => {
  const h = await fixture(), privateHome = await fixture("PERSONAL_RESIDENCE");
  const actor = { role: "ADMIN", account: { _id: id() }, organizationId: h.context.organizationId, scope: { mode: "ALL", condominiumIds: [] },
    permissions: ["cameras.read", "cameras.manage", "cameras.live", "cameras.recordings.read"] };
  let clock = new Date();
  const storage = { inspectObject: async () => ({ sizeBytes: 100, sha256: "a".repeat(64) }),
    presignRead: async ({ objectKey, ttlSeconds }) => { assert.ok(objectKey.startsWith("camera/")); assert.ok(ttlSeconds <= 60); return "https://storage.example.invalid/signed"; } };
  const inventory = new CameraInventoryService({ storage, now: () => clock });
  const input = { scope: { scopeType: "COMMON_AREA", condominiumId: String(h.context.condominiumId) }, displayName: "Entrada Hikvision",
    gatewayId: String(h.gateway._id), protocol: "RTSP", idempotencyKey: "camera-1" };
  const camera = await inventory.createCamera(actor, input);
  assert.equal(camera.status, "PROVISIONING"); assert.equal(camera.recordingMode, "EVENT");
  assert.equal(String((await inventory.createCamera(actor, input))._id), String(camera._id));
  assert.equal(await Audit.countDocuments({ action: "CAMERA_REGISTERED", "value.cameraId": String(camera._id) }), 1);
  await assert.rejects(inventory.createCamera(actor, { ...input, gatewayId: String(privateHome.gateway._id), idempotencyKey: "camera-foreign" }), { statusCode: 404 });
  const ownerAccount = await Owner.findById(privateHome.context.ownerId).lean();
  const owner = { role: "OWNER", account: ownerAccount, scope: { mode: "PERSONAL" }, permissions: actor.permissions };
  const privateCamera = await inventory.createCamera(owner, { ...input, scope: { scopeType: "PERSONAL_RESIDENCE", residenceId: String(privateHome.context.residenceId) },
    gatewayId: String(privateHome.gateway._id), idempotencyKey: "camera-private" });
  await assert.rejects(inventory.getCamera(actor, String(privateCamera._id)), { statusCode: 404 });
  await assert.rejects(inventory.getCamera(owner, String(camera._id)), { statusCode: 403 });
  await Camera.updateOne({ _id: camera._id }, { $set: { status: "ACTIVE" } }); // Simulated edge activation, not hardware certification.
  const service = new CameraEventService({ now: () => clock, enabled: () => true, storage });
  const motionTime = new Date(clock.getTime() - 86400000); // Upload delayed by an internet outage.
  const eventInput = { schemaVersion: 1, cameraId: String(camera._id), sourceEventId: "motion-1", source: "CAMERA", eventType: "camera.motion", occurredAt: motionTime.toISOString() };
  const event = await service.ingestEvent(h.identity, eventInput);
  assert.equal((await Camera.findById(camera._id).lean()).motionStatus, "CONFIRMED");
  assert.equal((await service.ingestEvent(h.identity, eventInput)).duplicate, true);
  await assert.rejects(service.ingestEvent(privateHome.identity, eventInput), { code: "CAMERA_BINDING_INVALID" });
  const manifest = { cameraId: String(camera._id), eventId: event.eventId, checksum: "a".repeat(64), sizeBytes: 100, durationSeconds: 30, kind: "CLIP" };
  const recording = await service.planRecording(h.identity, manifest);
  assert.equal(recording.expiresAt.getTime(), motionTime.getTime() + 7 * 86400000);
  assert.equal(recording.occurredAt.getTime(), motionTime.getTime());
  const originalDay = await inventory.listTimeline(actor, String(camera._id), {
    from: new Date(motionTime.getTime() - 1000).toISOString(), to: new Date(motionTime.getTime() + 1000).toISOString(),
  }, "recordings");
  assert.equal(String(originalDay.items[0]._id), String(recording._id));
  const uploadDay = await inventory.listTimeline(actor, String(camera._id), {
    from: new Date(clock.getTime() - 1000).toISOString(), to: new Date(clock.getTime() + 1000).toISOString(),
  }, "recordings");
  assert.equal(uploadDay.items.length, 0);
  assert.equal(String((await service.planRecording(h.identity, manifest))._id), String(recording._id));
  await assert.rejects(service.planRecording(h.identity, { ...manifest, durationSeconds: 31 }), { code: "CAMERA_RECORDING_INVALID" });
  await assert.rejects(inventory.playback(actor, String(recording._id)), { code: "CAMERA_RECORDING_UNAVAILABLE" });
  const wrong = new CameraEventService({ enabled: () => true, storage: { inspectObject: async () => ({ sizeBytes: 100, sha256: "b".repeat(64) }) } });
  await assert.rejects(wrong.confirmUpload(h.identity, String(camera._id), String(recording._id)), { code: "CAMERA_UPLOAD_UNVERIFIED" });
  assert.equal((await Recording.findById(recording._id).lean()).status, "PENDING");
  await service.confirmUpload(h.identity, String(camera._id), String(recording._id));
  assert.equal((await inventory.playback(actor, String(recording._id))).url, "https://storage.example.invalid/signed");
  clock = new Date(clock.getTime() + 7 * 86400000);
  await assert.rejects(inventory.playback(actor, String(recording._id)), { code: "CAMERA_RECORDING_UNAVAILABLE" });
});

test("local camera live credentials enforce paths, slots, expiry and server-side disconnect", async () => {
  const h = await fixture();
  let clock = new Date();
  const actor = { role: "ADMIN", account: { _id: id() }, organizationId: h.context.organizationId,
    permissions: ["cameras.read", "cameras.manage", "cameras.live"], scope: { mode: "ALL", condominiumIds: [] } };
  const inventory = new CameraInventoryService();
  const camera = await inventory.createCamera(actor, { scope: { scopeType: "COMMON_AREA", condominiumId: String(h.context.condominiumId) },
    displayName: "Camera live", gatewayId: String(h.gateway._id), protocol: "RTSP", idempotencyKey: "live-camera" });
  await Camera.updateOne({ _id: camera._id }, { $set: { status: "ACTIVE" } });
  const closed = [], media = { endpoint: () => "https://video.example.invalid/stream/whep", closeSession: async (session) => { closed.push(session.mediaSessionId); } };
  const live = new CameraLiveService({ inventory, media, now: () => clock, resolveActor: async () => actor });
  const first = await live.create(actor, String(camera._id));
  const request = { token: first.token, action: "read", protocol: "webrtc", path: camera.streamId, id: "12345678-1234-1234-1234-123456789012" };
  await live.authorizeMedia(request);
  await assert.rejects(live.authorizeMedia({ ...request, path: "another-camera" }), { code: "CAMERA_MEDIA_DENIED" });
  await assert.rejects(live.authorizeMedia({ ...request, action: "publish" }), { code: "CAMERA_MEDIA_DENIED" });
  for (let i = 0; i < 3; i++) await live.create(actor, String(camera._id));
  await assert.rejects(live.create(actor, String(camera._id)), { code: "CAMERA_LIVE_LIMIT" });
  await assert.rejects(live.close({ ...actor, account: { _id: id() } }, String(camera._id), first.id), { code: "CAMERA_SESSION_NOT_FOUND" });
  clock = new Date(clock.getTime() + 60001);
  await assert.rejects(live.authorizeMedia(request), { code: "CAMERA_MEDIA_DENIED" });
  await assert.rejects(live.renew(actor, String(camera._id), first.id), { code: "CAMERA_SESSION_EXPIRED" });
  assert.equal((await live.sweep()).closed, 4);
  assert.ok(closed.includes(request.id));
  assert.equal(await LiveSession.countDocuments({ actorId: actor.account._id, status: "ACTIVE" }), 0);
  const next = await live.create(actor, String(camera._id));
  await Camera.updateOne({ _id: camera._id }, { $set: { status: "DISABLED" } });
  assert.equal((await live.sweep()).closed, 1);
  assert.equal((await LiveSession.findById(next.id).lean()).status, "CLOSED");
  await Camera.updateOne({ _id: camera._id }, { $set: { status: "ACTIVE" } });
  const gatewaySession = await live.create(actor, String(camera._id));
  await Gateway.updateOne({ _id: h.gateway._id }, { $set: { status: "REVOKED" } });
  await assert.rejects(live.create(actor, String(camera._id)), { code: "CAMERA_GATEWAY_INACTIVE" });
  assert.equal((await live.sweep()).closed, 1);
  assert.equal((await LiveSession.findById(gatewaySession.id).lean()).status, "CLOSED");
});

test("local gateway heartbeat is atomic, isolated, monotonic and independent of device presence", async () => {
  const h = await fixture(), other = await fixture("PERSONAL_RESIDENCE");
  let time = now;
  const service = new IoTHeartbeatService({ enabled: () => true, now: () => time });
  const heartbeat = (sequence, occurredAt = time, patch = {}) => ({ schemaVersion: 1,
    messageId: `heartbeat-${sequence}`, resourceId: String(h.gateway._id), gatewayId: String(h.gateway._id),
    profileVersion: 1, sequence, occurredAt: occurredAt.toISOString(), payload: {
      eventType: "gateway.heartbeat", agentVersion: "0.1.0", configurationVersion: 2, uptimeSeconds: 60,
      spoolCommandCount: 1, spoolAccountedBytes: 65536, spoolCapacityBytes: 67108864, storageBlocked: true,
    }, ...patch });
  const first = heartbeat(1);
  assert.equal((await service.ingestHeartbeat(h.identity, first)).status, "APPLIED");
  const admitted = await Gateway.findById(h.gateway._id).lean();
  assert.equal(admitted.health.storageBlocked, true);
  assert.equal(admitted.health.reportedConfigurationVersion, 2);
  assert.equal(admitted.configurationVersion, 1); // Reporting cannot change authoritative configuration.
  assert.equal((await Device.findById(h.device._id).lean()).connectivity, "UNKNOWN");
  assert.equal((await Gateway.findById(other.gateway._id).lean()).lastHeartbeatAt, null);
  assert.equal(await Event.countDocuments({ deviceId: h.device._id }), 0);
  assert.equal((await service.ingestHeartbeat(h.identity, first)).duplicate, true);
  await assert.rejects(service.ingestHeartbeat(h.identity, { ...first,
    payload: { ...first.payload, uptimeSeconds: 61 } }), { code: "IOT_MESSAGE_CONFLICT" });
  await assert.rejects(service.ingestHeartbeat(other.identity, first), { code: "IOT_BINDING_MISMATCH" });
  time = new Date(now.getTime() + 1000);
  await service.ingestHeartbeat(h.identity, heartbeat(3));
  assert.equal((await service.ingestHeartbeat(h.identity, heartbeat(2, now))).status, "IGNORED_OUT_OF_ORDER");
  assert.equal((await Gateway.findById(h.gateway._id).lean()).lastHeartbeatAt.getTime(), time.getTime());
  const broken = new IoTHeartbeatService({ enabled: () => true, now: () => time,
    InboxModel: { findOne: (...args) => Inbox.findOne(...args), create: async () => { throw new Error("heartbeat receipt failure"); } } });
  await assert.rejects(broken.ingestHeartbeat(h.identity, heartbeat(4)), /heartbeat receipt failure/);
  assert.equal((await Gateway.findById(h.gateway._id).lean()).heartbeatSequence, 3);
  assert.equal(await Inbox.countDocuments({ gatewayId: h.gateway._id, messageId: "heartbeat-4" }), 0);
  time = new Date(now.getTime() + 360000);
  assert.equal((await service.ingestHeartbeat(h.identity, first)).duplicate, true);
  await assert.rejects(service.ingestHeartbeat(h.identity, heartbeat(5, now)), { code: "IOT_EVENT_STALE" });
  await Mapping.updateOne({ resourceId: h.gateway._id }, { $set: { status: "REVOKED" } });
  await assert.rejects(service.ingestHeartbeat(h.identity, first), { code: "IOT_BINDING_MISMATCH" });
  await Gateway.updateOne({ _id: h.gateway._id }, { $set: { status: "REVOKED" } });
  await assert.rejects(service.ingestHeartbeat(h.identity, heartbeat(6)), { code: "IOT_BINDING_MISMATCH" });
});

test("real replica-set transaction updates state and enforces inbox uniqueness under duplicate delivery", async () => {
  const h = await fixture(), message = h.message();
  const service = new IoTIngestionService({ now: () => now, enabled: () => true });
  const results = await Promise.allSettled([service.ingestState(h.identity, message), service.ingestState(h.identity, message)]);
  assert.ok(results.some((result) => result.status === "fulfilled"));
  for (const result of results) if (result.status === "rejected") assert.equal(result.reason.code, "IOT_INGESTION_CONFLICT");
  assert.equal((await service.ingestState(h.identity, message)).duplicate, true);
  assert.equal(await Inbox.countDocuments({ gatewayId: h.gateway._id, messageId: message.messageId }), 1);
  assert.equal(await Event.countDocuments({ deviceId: h.device._id, eventType: "water.detected" }), 1);
  assert.equal((await Device.findById(h.device._id).lean()).shadow.reported.waterDetected, true);
});

test("real transaction rolls back device, gateway revision and inbox when event persistence fails", async () => {
  const h = await fixture();
  const service = new IoTIngestionService({ now: () => now, enabled: () => true,
    EventModel: { insertMany: async () => { throw new Error("synthetic event storage failure"); } } });
  await assert.rejects(service.ingestState(h.identity, h.message()), /synthetic event storage failure/);
  assert.equal((await Device.findById(h.device._id).lean()).shadow.reported.waterDetected, false);
  assert.equal((await Gateway.findById(h.gateway._id).lean()).ingestionRevision, 0);
  assert.equal(await Inbox.countDocuments({ gatewayId: h.gateway._id }), 0);
});

test("real persistence isolates two organizations, two units and a personal residence", async () => {
  const service = new IoTIngestionService({ now: () => now, enabled: () => true });
  const firstUnit = await fixture("CONDOMINIUM_UNIT");
  const cases = [await fixture(), await fixture(), firstUnit, await fixture("CONDOMINIUM_UNIT", firstUnit.context), await fixture("PERSONAL_RESIDENCE")];
  for (let index = 0; index < cases.length; index++) {
    const own = cases[index], foreign = cases[(index + 1) % cases.length];
    await assert.rejects(service.ingestState(own.identity, foreign.message()), { code: "IOT_BINDING_MISMATCH" });
    assert.equal((await service.ingestState(own.identity, own.message())).status, "APPLIED");
  }
  const unit = cases[2];
  await Condominium.updateOne({ _id: unit.context.condominiumId, "units._id": unit.context.unitId }, { $set: { "units.$.status": "inactive" } });
  await assert.rejects(service.ingestState(unit.identity, unit.message({ sequence: 2 })), { code: "IOT_BINDING_MISMATCH" });
  const personal = cases[4];
  await Owner.collection.updateOne({ _id: personal.context.ownerId }, { $set: { status: "inactive" } });
  await assert.rejects(service.ingestState(personal.identity, personal.message({ sequence: 2 })), { code: "IOT_BINDING_MISMATCH" });
});

test("real concurrent reports converge on the higher sequence and presence expiry is idempotent", async () => {
  const h = await fixture();
  const service = new IoTIngestionService({ now: () => now, enabled: () => true });
  const messages = [h.message({ sequence: 2, payload: { waterDetected: false } }), h.message({ sequence: 3 })];
  const results = await Promise.allSettled(messages.map((message) => service.ingestState(h.identity, message)));
  for (let index = 0; index < results.length; index++) if (results[index].status === "rejected") {
    assert.equal(results[index].reason.code, "IOT_INGESTION_CONFLICT");
    await service.ingestState(h.identity, messages[index]);
  }
  assert.equal((await Device.findById(h.device._id).lean()).ingestion.sequence, 3);
  const presence = new IoTPresenceService({ now: () => new Date(now.getTime() + 360000) });
  await presence.expirePresence(); await presence.expirePresence();
  assert.equal((await Device.findById(h.device._id).lean()).connectivity, "OFFLINE");
  assert.equal(await Event.countDocuments({ deviceId: h.device._id, eventType: "device.offline" }), 1);
});

test("local command outbox commits intent before mock publication, retries the same ID and enforces expiry/revocation", async () => {
  const h = await fixture();
  await Device.updateOne({ _id: h.device._id }, { $set: { deviceType: "LIGHT", "shadow.reported": { power: "OFF" } } });
  await Profile.updateOne({ _id: h.device.profileId }, { $set: { deviceTypes: ["LIGHT"],
    commandFields: [{ name: "power", type: "string", values: ["ON", "OFF"] }] } });
  const actor = { role: "ADMIN", account: { _id: id() }, organizationId: h.context.organizationId,
    permissions: ["iot.control"], scope: { mode: "ALL", condominiumIds: [] } };
  let commandTime = new Date();
  const requester = new IoTCommandService({ now: () => commandTime, enabled: () => true });
  const input = { deviceId: String(h.device._id), payload: { power: "ON" }, idempotencyKey: "local-command-1" };
  const requested = await requester.requestCommand(actor, input);
  const retry = await requester.requestCommand(actor, input);
  assert.equal(retry.commandId, requested.commandId);
  assert.equal(new Date(retry.expiresAt).getTime(), new Date(requested.expiresAt).getTime());
  assert.equal(await Outbox.countDocuments({ commandId: requested.commandId }), 1);
  assert.equal(await Audit.countDocuments({ "value.commandId": requested.commandId }), 1);
  await assert.rejects(requester.requestCommand(actor, { ...input, payload: { power: "OFF" } }), { code: "IOT_IDEMPOTENCY_MISMATCH" });
  const published = [];
  let failFirst = true;
  const dispatcher = new IoTCommandDispatcher({ now: () => commandTime, enabled: () => true, authorize: async () => {},
    transport: { publish: async (envelope) => {
      assert.equal(await Audit.countDocuments({ "value.commandId": envelope.payload.commandId }), 1);
      assert.equal(envelope.retained, false);
      published.push(envelope);
      if (failFirst) { failFirst = false; throw new Error("simulated network failure"); }
    } } });
  assert.equal((await dispatcher.dispatchOne()).status, "RETRY_PENDING");
  commandTime = new Date(commandTime.getTime() + 2500);
  const simultaneous = await Promise.all([dispatcher.dispatchOne(), dispatcher.dispatchOne()]);
  assert.ok(simultaneous.some((result) => result.status === "SENT"));
  assert.ok(simultaneous.some((result) => result.status === "IDLE"));
  assert.equal(published.length, 2);
  assert.equal(published[0].payload.commandId, published[1].payload.commandId);
  assert.equal((await Command.findOne({ commandId: requested.commandId }).lean()).status, "DISPATCHED");
  const expired = await requester.requestCommand(actor, { ...input, idempotencyKey: "local-expiry", ttlSeconds: 5 });
  commandTime = new Date(commandTime.getTime() + 6000);
  assert.equal((await dispatcher.dispatchOne()).status, "DEAD");
  assert.equal((await Command.findOne({ commandId: expired.commandId }).lean()).status, "EXPIRED");
  const revoked = await requester.requestCommand(actor, { ...input, idempotencyKey: "local-revocation" });
  const denying = new IoTCommandDispatcher({ now: () => commandTime, enabled: () => true,
    authorize: async () => { throw Object.assign(new Error("revoked"), { statusCode: 403 }); },
    transport: { publish: async () => { throw new Error("must not publish"); } } });
  assert.equal((await denying.dispatchOne()).status, "DEAD");
  assert.equal((await Command.findOne({ commandId: revoked.commandId }).lean()).failureCode, "IOT_COMMAND_AUTHORIZATION_REVOKED");
  assert.equal(published.length, 2);
});

test("local command expiry preserves feedback grace, terminal results and atomic queue closure", async () => {
  const h = await fixture();
  const deadline = new Date();
  const seed = async (status, age, queue = "PENDING") => {
    const commandId = `expiry-${id()}`;
    await Command.collection.insertOne({ ...h.context, commandId, deviceId: h.device._id,
      gatewayId: h.gateway._id, actorId: id(), actorType: "HUMAN", actorRole: "ADMIN",
      profileVersion: 1, payload: { power: "ON" }, status, expiresAt: new Date(deadline.getTime() - age),
      feedbackSequence: null });
    await Outbox.create({ ...h.context, commandId, type: "COMMAND_DISPATCH", status: queue,
      availableAt: deadline, leaseToken: queue === "LEASED" ? "old-lease" : null,
      leaseUntil: queue === "LEASED" ? new Date(deadline.getTime() + 30000) : null });
    return commandId;
  };
  const unsent = await seed("REQUESTED", 1, "LEASED");
  const waiting = await seed("ACKNOWLEDGED", 299999, "SENT");
  const sent = await seed("DISPATCHED", 300000, "SENT");
  const ack = await seed("ACKNOWLEDGED", 300001);
  const executed = await seed("EXECUTED", 400000, "SENT");
  const failed = await seed("FAILED", 400000, "DEAD");
  const service = new IoTCommandExpiryService({ enabled: () => true, now: () => deadline });
  assert.deepEqual(await service.expireCommands(), { scanned: 3, changed: 3 });
  assert.equal((await Command.findOne({ commandId: unsent }).lean()).failureCode, "IOT_COMMAND_EXPIRED");
  assert.equal((await Outbox.findOne({ commandId: unsent }).lean()).leaseToken, null);
  for (const commandId of [sent, ack])
    assert.equal((await Command.findOne({ commandId }).lean()).failureCode, "IOT_COMMAND_FEEDBACK_TIMEOUT");
  assert.equal((await Outbox.findOne({ commandId: sent }).lean()).status, "SENT");
  assert.equal((await Outbox.findOne({ commandId: ack }).lean()).status, "DEAD");
  assert.equal((await Command.findOne({ commandId: waiting }).lean()).status, "ACKNOWLEDGED");
  assert.equal((await Command.findOne({ commandId: executed }).lean()).status, "EXECUTED");
  assert.equal((await Command.findOne({ commandId: failed }).lean()).status, "FAILED");

  // A publish retry that crosses the execution deadline closes the queue, but keeps feedback grace.
  const retry = await seed("DISPATCHED", 1000);
  let publications = 0;
  const dispatcher = new IoTCommandDispatcher({ enabled: () => true, now: () => deadline,
    transport: { publish: async () => { publications++; } } });
  assert.equal((await dispatcher.dispatchOne()).status, "DEAD");
  assert.equal(publications, 0);
  assert.equal((await Command.findOne({ commandId: retry }).lean()).status, "DISPATCHED");
  assert.equal((await Outbox.findOne({ commandId: retry }).lean()).status, "DEAD");

  const rollback = await seed("REQUESTED", 1);
  const broken = new IoTCommandExpiryService({ enabled: () => true, now: () => deadline,
    OutboxModel: { updateMany: async () => { throw new Error("simulated queue failure"); } } });
  await assert.rejects(broken.expireCommands(), /simulated queue failure/);
  assert.equal((await Command.findOne({ commandId: rollback }).lean()).status, "REQUESTED");
  assert.equal((await Outbox.findOne({ commandId: rollback }).lean()).status, "PENDING");
  await service.expireCommands();

  const concurrent = await seed("DISPATCHED", 400000);
  const racing = new IoTCommandExpiryService({ enabled: () => true, now: () => deadline, CommandModel: {
    find: (filter) => ({ sort() { return this; }, limit() { return this; }, lean: async () => {
      const candidates = await Command.find(filter).lean();
      await Command.collection.updateOne({ commandId: concurrent }, { $set: { status: "EXECUTED",
        executedAt: deadline, evidenceRef: "feedback:synthetic-race" } });
      return candidates;
    } }), updateOne: (...args) => Command.updateOne(...args),
  } });
  assert.deepEqual(await racing.expireCommands(), { scanned: 1, changed: 0 });
  assert.equal((await Command.findOne({ commandId: concurrent }).lean()).status, "EXECUTED");
  await Outbox.updateOne({ commandId: concurrent }, { $set: { status: "SENT" } });
});

test("local cloud-edge feedback distinguishes receipt from execution and survives lost ACK and replay", async () => {
  const h = await fixture();
  await Device.updateOne({ _id: h.device._id }, { $set: { deviceType: "LIGHT", "shadow.reported": { power: "OFF" } } });
  await Profile.updateOne({ _id: h.device.profileId }, { $set: { deviceTypes: ["LIGHT"], commandFeedback: "DEVICE_REPORT",
    commandFields: [{ name: "power", type: "string", values: ["ON", "OFF"] }],
    stateFields: [{ name: "power", type: "string", values: ["ON", "OFF"] }] } });
  const actor = { role: "ADMIN", account: { _id: id() }, organizationId: h.context.organizationId,
    permissions: ["iot.control"], scope: { mode: "ALL", condominiumIds: [] } };
  const commandTime = new Date();
  const requester = new IoTCommandService({ now: () => commandTime, enabled: () => true });
  const input = { deviceId: String(h.device._id), payload: { power: "ON" }, idempotencyKey: "feedback-1" };
  const command = await requester.requestCommand(actor, input);
  edgeDirectory = await fs.mkdtemp(path.join(temporaryRoot, "iot-edge-"));
  let executionCount = 0, edgeResult;
  const handlerConfig = { gatewayId: String(h.gateway._id), stateDirectory: edgeDirectory,
    resources: { [String(h.device._id)]: { deviceType: "LIGHT", profileVersion: 1, feedbackEnabled: true } },
    now: () => commandTime, execute: async () => {
      executionCount++;
      return { sourceEventId: `report-${id()}`, observedAt: commandTime.toISOString(), reported: { power: "ON" } };
    } };
  let published;
  const dispatcher = new IoTCommandDispatcher({ now: () => commandTime, enabled: () => true, authorize: async () => {},
    transport: { publish: async ({ payload }) => {
      published = payload;
      edgeResult = await new GatewayCommandHandler(handlerConfig).handle(payload);
    } } });
  assert.equal((await dispatcher.dispatchOne()).status, "SENT");
  const feedback = new IoTCommandFeedbackService({ now: () => commandTime, enabled: () => true });
  await feedback.ingestAck(h.identity, edgeResult.events[0]);
  assert.equal((await Command.findOne({ commandId: command.commandId }).lean()).status, "ACKNOWLEDGED");
  assert.equal(await Feedback.countDocuments({ commandId: command.commandId }), 0);
  const invalid = { ...edgeResult.events[1], messageId: "wrong-feedback", payload: { ...edgeResult.events[1].payload,
    feedback: { ...edgeResult.events[1].payload.feedback, reported: { power: "OFF" } } } };
  await assert.rejects(feedback.ingestAck(h.identity, invalid), { code: "IOT_COMMAND_FEEDBACK_INVALID" });
  await Profile.updateOne({ _id: h.device.profileId }, { $set: { commandFeedback: "NONE" } });
  await assert.rejects(feedback.ingestAck(h.identity, edgeResult.events[1]), { code: "IOT_COMMAND_FEEDBACK_INVALID" });
  await Profile.updateOne({ _id: h.device.profileId }, { $set: { commandFeedback: "DEVICE_REPORT" } });
  await feedback.ingestAck(h.identity, edgeResult.events[1]);
  const executed = await Command.findOne({ commandId: command.commandId }).lean();
  assert.equal(executed.status, "EXECUTED");
  assert.match(executed.evidenceRef, /^feedback:/);
  assert.equal(await Feedback.countDocuments({ commandId: command.commandId }), 1);
  await assert.rejects(Feedback.deleteOne({ commandId: command.commandId }), /immutable/);
  assert.equal((await feedback.ingestAck(h.identity, edgeResult.events[1])).duplicate, true);
  assert.equal((await new GatewayCommandHandler(handlerConfig).handle(published)).duplicate, true);
  assert.equal(executionCount, 1);
  const next = await requester.requestCommand(actor, { ...input, idempotencyKey: "feedback-lost-ack" });
  await dispatcher.dispatchOne();
  await feedback.ingestAck(h.identity, edgeResult.events[1]);
  assert.equal((await Command.findOne({ commandId: next.commandId }).lean()).status, "EXECUTED");
  await feedback.ingestAck(h.identity, edgeResult.events[0]);
  assert.equal((await Command.findOne({ commandId: next.commandId }).lean()).status, "EXECUTED");
  let uploadTime = commandTime, loseReceipt = true;
  const uploads = [];
  const uploaderConfig = { gatewayId: String(h.gateway._id), stateDirectory: edgeDirectory,
    now: () => uploadTime, transport: { publishEvent: async (event) => {
      uploads.push(event);
      await feedback.ingestAck(h.identity, event); // Mongo transaction has committed before acceptance.
      if (loseReceipt) { loseReceipt = false; throw new Error("application receipt lost after commit"); }
      return { accepted: true, messageId: event.messageId };
    } } };
  assert.equal((await new GatewayEventUploader(uploaderConfig).uploadPending()).accepted, 2);
  uploadTime = new Date(commandTime.getTime() + 2000);
  assert.equal((await new GatewayEventUploader(uploaderConfig).uploadPending()).accepted, 2);
  assert.equal((await new GatewayEventUploader(uploaderConfig).uploadPending()).attempted, 0);
  assert.equal(new Set(uploads.map((event) => event.messageId)).size, 4);
  assert.equal(uploads.length, 5);
  assert.equal(await Feedback.countDocuments({ commandId: { $in: [command.commandId, next.commandId] } }), 2);
  assert.equal(executionCount, 2);
});
