"use strict";
const mongoose = require("mongoose");
const { createHash } = require("node:crypto");
const Device = require("../../../models/iotDevice");
const Gateway = require("../../../models/iotGateway");
const Profile = require("../../../models/iotDeviceProfile");
const Mapping = require("../../../models/iotIntegrationMapping");
const Command = require("../../../models/iotCommand");
const Feedback = require("../../../models/iotCommandFeedback");
const Inbox = require("../../../models/iotIntegrationInbox");
const { validateEnvelope } = require("../domain/envelope");
const { validateProfilePayload } = require("../domain/profilePayload");
const { commandTransition } = require("../domain/commandLifecycle");
const { sameContext } = require("../domain/context");
const { contextIsActive } = require("./ingestionContext");
const { exactObject } = require("./inventoryService");
const { apiError, scopeFilter } = require("../../../service/iotService");

function validateAck(payload) {
  exactObject(payload, ["eventType", "commandId", "status", "feedback", "failureCode"]);
  if (payload.eventType !== "command.ack" || typeof payload.commandId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(payload.commandId) ||
      !["ACKNOWLEDGED", "EXECUTED", "FAILED"].includes(payload.status)) throw apiError("IOT_COMMAND_ACK_INVALID", "Invalid command acknowledgement", 422);
  if (payload.status === "EXECUTED") {
    exactObject(payload.feedback, ["sourceEventId", "observedAt", "reported"]);
    if (typeof payload.feedback.sourceEventId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(payload.feedback.sourceEventId))
      throw apiError("IOT_COMMAND_FEEDBACK_INVALID", "Feedback must identify a device report", 422);
  } else if (payload.feedback !== undefined) throw apiError("IOT_COMMAND_ACK_INVALID", "Receipt acknowledgements cannot include execution evidence", 422);
  if (payload.status === "FAILED" ? typeof payload.failureCode !== "string" || !/^[A-Z0-9_]{1,80}$/.test(payload.failureCode) : payload.failureCode !== undefined)
    throw apiError("IOT_COMMAND_ACK_INVALID", "Invalid failure code", 422);
}

class IoTCommandFeedbackService {
  constructor({ DeviceModel = Device, GatewayModel = Gateway, ProfileModel = Profile, MappingModel = Mapping,
    CommandModel = Command, FeedbackModel = Feedback, InboxModel = Inbox, mongo = mongoose,
    activeContext = contextIsActive, now = () => new Date(), enabled = () => process.env.IOT_INGESTION_ENABLED === "true" } = {}) {
    Object.assign(this, { DeviceModel, GatewayModel, ProfileModel, MappingModel, CommandModel, FeedbackModel, InboxModel, mongo, activeContext, now, enabled });
  }

  // Internal consumer entrypoint. The same trusted identity rule as state ingestion applies.
  async ingestAck({ authenticatedThingName } = {}, input) {
    if (!this.enabled()) throw apiError("IOT_INGESTION_DISABLED", "IoT ingestion is not enabled", 503);
    if (typeof authenticatedThingName !== "string" || !/^[A-Za-z0-9:_-]{1,128}$/.test(authenticatedThingName) ||
        typeof input?.resourceId !== "string" || !/^[a-f0-9]{24}$/i.test(input.resourceId))
      throw apiError("IOT_COMMAND_ACK_INVALID", "Authenticated identity and resource required", 422);
    const receivedAt = this.now(), session = await this.mongo.startSession();
    let result;
    try {
      await session.withTransaction(async () => {
        const gateway = await this.GatewayModel.findOne({ awsThingName: authenticatedThingName, status: "ACTIVE" }).session(session).lean();
        const device = await this.DeviceModel.findById(input.resourceId).session(session).lean();
        const options = { gateway, device, authenticatedGatewayId: gateway?._id, now: receivedAt };
        const envelope = validateEnvelope(input, { ...options, maxAgeMs: Infinity });
        validateAck(envelope.payload);
        const mapping = await this.MappingModel.findOne({ resourceType: "GATEWAY", resourceId: gateway._id,
          integration: "AWS", status: "SYNCED", externalId: authenticatedThingName }).session(session).lean();
        if (!mapping || !sameContext(mapping, gateway) || !(await this.activeContext(device, session)))
          throw apiError("IOT_BINDING_MISMATCH", "Gateway mapping or context is not active", 403);
        const command = await this.CommandModel.findOne({ commandId: envelope.payload.commandId }).session(session).lean();
        if (!command || String(command.deviceId) !== String(device._id) || String(command.gatewayId) !== String(gateway._id) ||
            command.profileVersion !== envelope.profileVersion || !sameContext(command, device))
          throw apiError("IOT_BINDING_MISMATCH", "Acknowledgement belongs to another command binding", 403);
        const feedback = envelope.payload.feedback;
        const canonicalPayload = { ...envelope.payload, ...(feedback ? { feedback: { sourceEventId: feedback.sourceEventId, observedAt: feedback.observedAt,
          reported: Object.fromEntries(Object.entries(feedback.reported || {}).sort(([a], [b]) => a.localeCompare(b))) } } : {}) };
        const contentHash = createHash("sha256").update(JSON.stringify({ type: "COMMAND_ACK", schemaVersion: envelope.schemaVersion,
          messageId: envelope.messageId, gatewayId: envelope.gatewayId, resourceId: envelope.resourceId,
          sequence: envelope.sequence, profileVersion: envelope.profileVersion, occurredAt: envelope.occurredAt,
          payload: { eventType: canonicalPayload.eventType, commandId: canonicalPayload.commandId,
            status: canonicalPayload.status, feedback: canonicalPayload.feedback, failureCode: canonicalPayload.failureCode } })).digest("hex");
        const previous = await this.InboxModel.findOne({ gatewayId: gateway._id, messageId: envelope.messageId }).session(session).lean();
        if (previous) {
          if (previous.contentHash !== contentHash) throw apiError("IOT_MESSAGE_CONFLICT", "Message identifier has different content", 409);
          result = { commandId: command.commandId, status: command.status, duplicate: true };
          return;
        }
        validateEnvelope(input, options);
        const occurredAt = new Date(envelope.occurredAt);
        if (occurredAt < new Date(command.dispatchedAt || command.createdAt) || occurredAt >= new Date(command.expiresAt))
          throw apiError("IOT_COMMAND_FEEDBACK_INVALID", "Feedback is outside the command execution window", 422);
        const ignored = ["EXECUTED", "FAILED", "EXPIRED"].includes(command.status) ||
          (command.feedbackSequence != null && envelope.sequence <= command.feedbackSequence) ||
          (command.status === "ACKNOWLEDGED" && envelope.payload.status === "ACKNOWLEDGED");
        if (!ignored) {
          const active = await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE" }, { $inc: { ingestionRevision: 1 } }, { session });
          if (active.modifiedCount !== 1) throw apiError("IOT_INGESTION_CONFLICT", "Gateway changed during acknowledgement", 409);
          let evidenceRef;
          if (envelope.payload.status === "EXECUTED") {
            const profile = await this.ProfileModel.findById(device.profileId).session(session).lean();
            if (!profile || profile.commandFeedback !== "DEVICE_REPORT" || profile.version !== command.profileVersion ||
                profile.protocol !== device.protocol || profile.certification === "UNSUPPORTED" ||
                !profile.deviceTypes?.includes(device.deviceType) || !gateway.adapters?.includes(device.protocol) ||
                !device.bindingAddress || !["LIGHT", "AIR_CONDITIONER", "WATER_PUMP"].includes(device.deviceType))
              throw apiError("IOT_COMMAND_FEEDBACK_INVALID", "Profile has no supported physical feedback", 422);
            const observedAt = new Date(feedback.observedAt);
            if (typeof feedback.observedAt !== "string" || !Number.isFinite(observedAt.getTime()) || observedAt.toISOString() !== feedback.observedAt ||
                observedAt < new Date(command.dispatchedAt) || observedAt > occurredAt || observedAt >= new Date(command.expiresAt))
              throw apiError("IOT_COMMAND_FEEDBACK_INVALID", "Device report timestamp is outside execution window", 422);
            const reported = validateProfilePayload(profile, "state", feedback.reported);
            if (Object.entries(command.payload).some(([key, value]) => reported[key] !== value))
              throw apiError("IOT_COMMAND_FEEDBACK_INVALID", "Device feedback does not confirm the requested state", 422);
            const [evidence] = await this.FeedbackModel.create([{ ...scopeFilter(device), commandId: command.commandId,
              gatewayId: gateway._id, deviceId: device._id, profileId: profile._id, profileVersion: profile.version,
              bindingAddress: device.bindingAddress, sourceEventId: feedback.sourceEventId, observedAt, reported }], { session });
            evidenceRef = `feedback:${evidence._id}`;
          }
          // Execution evidence implies receipt if its separate ACK was lost in transport.
          const base = command.status === "DISPATCHED" && envelope.payload.status === "EXECUTED" ? { ...command, status: "ACKNOWLEDGED" } : command;
          const transition = commandTransition(base, envelope.payload.status, { now: occurredAt, evidenceRef, failureCode: envelope.payload.failureCode });
          transition.filter.status = command.status;
          transition.update.$set.feedbackSequence = envelope.sequence;
          if (base !== command) transition.update.$set.acknowledgedAt = occurredAt;
          const updated = await this.CommandModel.updateOne(transition.filter, transition.update, { session, runValidators: true });
          if (updated.modifiedCount !== 1) throw apiError("IOT_INGESTION_CONFLICT", "Command changed during acknowledgement", 409);
        }
        await this.InboxModel.create([{ ...scopeFilter(device), gatewayId: gateway._id, resourceId: device._id,
          messageId: envelope.messageId, schemaVersion: 1, type: "COMMAND_ACK", contentHash, sequence: envelope.sequence,
          occurredAt, receivedAt, status: ignored ? "IGNORED_OUT_OF_ORDER" : "APPLIED", eventCount: 0 }], { session });
        result = { commandId: command.commandId, status: ignored ? command.status : envelope.payload.status, duplicate: false };
      });
      return result;
    } catch (error) {
      if (error.code === 11000) throw apiError("IOT_INGESTION_CONFLICT", "Concurrent or reused feedback; retry original message", 409);
      throw error;
    } finally { await session.endSession(); }
  }
}

module.exports = { IoTCommandFeedbackService, validateAck };
