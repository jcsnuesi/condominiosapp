"use strict";

const mongoose = require("mongoose");
const { createHash } = require("node:crypto");
const Gateway = require("../../../models/iotGateway");
const Device = require("../../../models/iotDevice");
const Profile = require("../../../models/iotDeviceProfile");
const Mapping = require("../../../models/iotIntegrationMapping");
const Inbox = require("../../../models/iotIntegrationInbox");
const Event = require("../../../models/iotDeviceEvent");
const { validateEnvelope } = require("../domain/envelope");
const { validateProfilePayload } = require("../domain/profilePayload");
const { sameContext } = require("../domain/context");
const { contextIsActive } = require("./ingestionContext");
const { scopeFilter, apiError } = require("../../../service/iotService");
const { sanitizeDeviceState } = require("../../../service/iotCapabilities");
const { buildDeviceEvents } = require("../../../service/iotEventRules");

function hashState(envelope) {
  const payload = Object.fromEntries(Object.entries(envelope.payload).sort(([left], [right]) => left.localeCompare(right)));
  return createHash("sha256").update(JSON.stringify({
    type: "DEVICE_STATE", schemaVersion: envelope.schemaVersion, messageId: envelope.messageId,
    resourceId: envelope.resourceId, gatewayId: envelope.gatewayId, occurredAt: envelope.occurredAt,
    sequence: envelope.sequence, profileVersion: envelope.profileVersion, payload,
  })).digest("hex");
}

function receiptResult(receipt, duplicate = false) {
  return { messageId: receipt.messageId, status: receipt.status, eventCount: receipt.eventCount, duplicate };
}

class IoTIngestionService {
  constructor({ GatewayModel = Gateway, DeviceModel = Device, ProfileModel = Profile, MappingModel = Mapping,
    InboxModel = Inbox, EventModel = Event, mongo = mongoose, activeContext = contextIsActive,
    now = () => new Date(), enabled = () => process.env.IOT_INGESTION_ENABLED === "true" } = {}) {
    Object.assign(this, { GatewayModel, DeviceModel, ProfileModel, MappingModel, InboxModel, EventModel, mongo, activeContext, now, enabled });
  }

  // Internal entrypoint only. authenticatedThingName must come from the trusted
  // AWS adapter's certificate/connection identity, never from MQTT payload/HTTP.
  async ingestState({ authenticatedThingName } = {}, input) {
    if (!this.enabled()) throw apiError("IOT_INGESTION_DISABLED", "IoT ingestion is not enabled", 503);
    if (typeof authenticatedThingName !== "string" || !/^[A-Za-z0-9:_-]{1,128}$/.test(authenticatedThingName))
      throw apiError("IOT_INGESTION_IDENTITY_INVALID", "Authenticated gateway identity required", 403);
    if (typeof input?.resourceId !== "string" || !/^[a-f0-9]{24}$/i.test(input.resourceId))
      throw apiError("IOT_ENVELOPE_INVALID", "Invalid resource identifier", 422);
    const receivedAt = this.now();
    const session = await this.mongo.startSession();
    let result;
    try {
      await session.withTransaction(async () => {
        const gateway = await this.GatewayModel.findOne({ awsThingName: authenticatedThingName, status: "ACTIVE" }).session(session).lean();
        const device = await this.DeviceModel.findById(input.resourceId).session(session).lean();
        const validation = { gateway, device, authenticatedGatewayId: gateway?._id, now: receivedAt };
        // A durable receipt may acknowledge an old retry without applying it again.
        // Unknown old messages still have to pass the normal freshness window.
        const envelope = validateEnvelope(input, { ...validation, maxAgeMs: Infinity });
        const mapping = await this.MappingModel.findOne({ resourceType: "GATEWAY", resourceId: gateway._id,
          integration: "AWS", status: "SYNCED", externalId: authenticatedThingName }).session(session).lean();
        if (!mapping || !sameContext(mapping, gateway) || !(await this.activeContext(device, session)))
          throw apiError("IOT_BINDING_MISMATCH", "Gateway mapping or context is not active", 403);
        const profile = await this.ProfileModel.findById(device.profileId).session(session).lean();
        if (!profile || profile.version !== envelope.profileVersion || profile.protocol !== device.protocol ||
            profile.certification === "UNSUPPORTED" || !profile.deviceTypes?.includes(device.deviceType) ||
            !gateway.adapters?.includes(device.protocol))
          throw apiError("IOT_PROFILE_INVALID", "Device profile or gateway adapter does not match", 422);
        const payload = validateProfilePayload(profile, "state", envelope.payload);
        const sanitized = sanitizeDeviceState(device.deviceType, payload);
        if (!Object.keys(payload).length || Object.keys(payload).some((key) => sanitized[key] !== payload[key]))
          throw apiError("IOT_PROFILE_PAYLOAD_INVALID", "State contains unsupported business capabilities", 422);
        const contentHash = hashState(envelope);
        const previous = await this.InboxModel.findOne({ gatewayId: gateway._id, messageId: envelope.messageId }).session(session).lean();
        if (previous) {
          if (previous.contentHash !== contentHash) throw apiError("IOT_MESSAGE_CONFLICT", "Message identifier was reused with different content", 409);
          result = receiptResult(previous, true);
          return;
        }
        validateEnvelope(input, validation);
        // Write to the gateway as well, so concurrent revocation participates in
        // the transaction's conflict detection instead of being a snapshot read.
        const active = await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE", ingestionRevision: gateway.ingestionRevision ?? 0 },
          { $inc: { ingestionRevision: 1 } }, { session });
        if (active.modifiedCount !== 1) throw apiError("IOT_INGESTION_CONFLICT", "Gateway changed during ingestion; retry message", 409);
        const occurredAt = new Date(envelope.occurredAt);
        const isOlder = (device.ingestion?.sequence != null && envelope.sequence <= device.ingestion.sequence) ||
          (device.lastReportedAt && occurredAt < new Date(device.lastReportedAt));
        let events = [];
        if (!isOlder) {
          // Partial reports preserve other already validated business fields.
          const reported = { ...sanitizeDeviceState(device.deviceType, device.shadow?.reported), ...sanitized };
          events = buildDeviceEvents(device, reported, "ONLINE", envelope.messageId, occurredAt);
          const update = await this.DeviceModel.updateOne({ _id: device._id, status: "ACTIVE", enabled: { $ne: false },
            gatewayId: gateway._id, profileId: profile._id, profileVersion: profile.version,
            "ingestion.sequence": device.ingestion?.sequence ?? null }, { $set: {
            "shadow.reported": reported, "shadow.updatedAt": occurredAt,
            lastReportedAt: occurredAt, lastSeen: occurredAt, connectivity: "ONLINE",
            ingestion: { sequence: envelope.sequence, messageId: envelope.messageId, occurredAt },
          } }, { session, runValidators: true });
          if (update.modifiedCount !== 1) throw apiError("IOT_INGESTION_CONFLICT", "Device changed during ingestion; retry message", 409);
          if (events.length) await this.EventModel.insertMany(events.map((event) => ({
            ...scopeFilter(device), deviceId: device._id, ...event,
          })), { session, ordered: true });
        }
        const receipt = { ...scopeFilter(device), gatewayId: gateway._id, resourceId: device._id,
          messageId: envelope.messageId, schemaVersion: 1, type: "DEVICE_STATE", contentHash,
          sequence: envelope.sequence, occurredAt, receivedAt,
          status: isOlder ? "IGNORED_OUT_OF_ORDER" : "APPLIED", eventCount: events.length };
        await this.InboxModel.create([receipt], { session });
        result = receiptResult(receipt);
      });
      return result;
    } catch (error) {
      // An aborted duplicate-key transaction must be retried from a new snapshot.
      // The transport retries the same messageId; it must never drop it as success.
      if (error.code === 11000) throw apiError("IOT_INGESTION_CONFLICT", "Concurrent message receipt; retry message", 409);
      throw error;
    } finally { await session.endSession(); }
  }
}

module.exports = { IoTIngestionService, hashState };
