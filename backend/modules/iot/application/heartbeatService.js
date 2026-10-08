"use strict";
const mongoose = require("mongoose");
const { createHash } = require("node:crypto");
const Gateway = require("../../../models/iotGateway");
const Mapping = require("../../../models/iotIntegrationMapping");
const Inbox = require("../../../models/iotIntegrationInbox");
const { validateHeartbeat } = require("../domain/heartbeat");
const { sameContext } = require("../domain/context");
const { contextIsActive } = require("./ingestionContext");
const { scopeFilter, apiError } = require("../../../service/iotService");

function heartbeatHash(envelope) {
  return createHash("sha256").update(JSON.stringify({ type: "GATEWAY_HEARTBEAT",
    schemaVersion: envelope.schemaVersion, messageId: envelope.messageId, gatewayId: envelope.gatewayId,
    resourceId: envelope.resourceId, profileVersion: envelope.profileVersion, sequence: envelope.sequence,
    occurredAt: envelope.occurredAt,
    payload: Object.fromEntries(Object.entries(envelope.payload).sort(([a], [b]) => a.localeCompare(b))),
  })).digest("hex");
}

class IoTHeartbeatService {
  constructor({ GatewayModel = Gateway, MappingModel = Mapping, InboxModel = Inbox, mongo = mongoose,
    activeContext = contextIsActive, now = () => new Date(),
    enabled = () => process.env.IOT_INGESTION_ENABLED === "true" } = {}) {
    Object.assign(this, { GatewayModel, MappingModel, InboxModel, mongo, activeContext, now, enabled });
  }

  // Trusted adapter identity only. No public HTTP route or default transport.
  async ingestHeartbeat({ authenticatedThingName } = {}, input) {
    if (!this.enabled()) throw apiError("IOT_INGESTION_DISABLED", "IoT ingestion is not enabled", 503);
    if (typeof authenticatedThingName !== "string" || !/^[A-Za-z0-9:_-]{1,128}$/.test(authenticatedThingName))
      throw apiError("IOT_INGESTION_IDENTITY_INVALID", "Authenticated gateway identity required", 403);
    const receivedAt = this.now(), session = await this.mongo.startSession();
    let result;
    try {
      await session.withTransaction(async () => {
        const gateway = await this.GatewayModel.findOne({ awsThingName: authenticatedThingName, status: "ACTIVE" }).session(session).lean();
        const envelope = validateHeartbeat(input, { gateway, now: receivedAt, maxAgeMs: Infinity });
        const mapping = await this.MappingModel.findOne({ resourceType: "GATEWAY", resourceId: gateway._id,
          integration: "AWS", status: "SYNCED", externalId: authenticatedThingName }).session(session).lean();
        if (!mapping || !sameContext(mapping, gateway) || !(await this.activeContext(gateway, session)))
          throw apiError("IOT_BINDING_MISMATCH", "Gateway mapping or context is not active", 403);
        const contentHash = heartbeatHash(envelope);
        const previous = await this.InboxModel.findOne({ gatewayId: gateway._id, messageId: envelope.messageId }).session(session).lean();
        if (previous) {
          if (previous.contentHash !== contentHash) throw apiError("IOT_MESSAGE_CONFLICT", "Message identifier was reused", 409);
          result = { messageId: previous.messageId, status: previous.status, duplicate: true }; return;
        }
        validateHeartbeat(input, { gateway, now: receivedAt });
        const occurredAt = new Date(envelope.occurredAt);
        const older = (gateway.heartbeatSequence != null && envelope.sequence <= gateway.heartbeatSequence) ||
          (gateway.lastHeartbeatAt && occurredAt < new Date(gateway.lastHeartbeatAt));
        const { agentVersion, configurationVersion, eventType, ...health } = envelope.payload;
        const changes = older ? {} : { lastHeartbeatAt: occurredAt, heartbeatSequence: envelope.sequence,
          agentVersion, health: { ...health, reportedConfigurationVersion: configurationVersion } };
        const updated = await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE",
          ingestionRevision: gateway.ingestionRevision ?? 0 }, { $inc: { ingestionRevision: 1 },
          ...(older ? {} : { $set: changes }) }, { session, runValidators: true });
        if (updated.modifiedCount !== 1) throw apiError("IOT_INGESTION_CONFLICT", "Gateway changed; retry heartbeat", 409);
        const receipt = { ...scopeFilter(gateway), gatewayId: gateway._id, resourceId: gateway._id,
          messageId: envelope.messageId, schemaVersion: 1, type: "GATEWAY_HEARTBEAT", contentHash,
          sequence: envelope.sequence, occurredAt, receivedAt, eventCount: 0,
          status: older ? "IGNORED_OUT_OF_ORDER" : "APPLIED" };
        await this.InboxModel.create([receipt], { session });
        result = { messageId: receipt.messageId, status: receipt.status, duplicate: false };
      });
      return result;
    } catch (error) {
      if (error.code === 11000) throw apiError("IOT_INGESTION_CONFLICT", "Concurrent heartbeat receipt; retry message", 409);
      throw error;
    } finally { await session.endSession(); }
  }
}
module.exports = { IoTHeartbeatService, heartbeatHash };
