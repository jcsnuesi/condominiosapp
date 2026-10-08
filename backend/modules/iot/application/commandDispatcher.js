"use strict";
const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const Device = require("../../../models/iotDevice");
const Gateway = require("../../../models/iotGateway");
const Profile = require("../../../models/iotDeviceProfile");
const Command = require("../../../models/iotCommand");
const Outbox = require("../../../models/iotIntegrationOutbox");
const Mapping = require("../../../models/iotIntegrationMapping");
const { resolveAccessContext } = require("../../../service/authorization");
const { IoTAuthorizationService } = require("../../../service/iotAuthorization");
const { sameContext } = require("../domain/context");
const { validateTarget } = require("./commandService");
const { apiError } = require("../../../service/iotService");
const { expiryCandidates } = require("../domain/commandDeadline");

async function authorizeCommand(command, device) {
  const actor = await resolveAccessContext({ sub: String(command.actorId), role: command.actorRole });
  if (!actor) throw apiError("IOT_COMMAND_AUTHORIZATION_REVOKED", "Command requester no longer has access", 403);
  await new IoTAuthorizationService().canControlDevice(actor, device);
}

class IoTCommandDispatcher {
  // No default network transport. Construction alone cannot call AWS.
  constructor({ transport, DeviceModel = Device, GatewayModel = Gateway, ProfileModel = Profile,
    CommandModel = Command, OutboxModel = Outbox, MappingModel = Mapping, mongo = mongoose, authorize = authorizeCommand,
    now = () => new Date(), enabled = () => process.env.IOT_COMMANDS_ENABLED === "true" } = {}) {
    Object.assign(this, { transport, DeviceModel, GatewayModel, ProfileModel, CommandModel, OutboxModel, MappingModel, mongo, authorize, now, enabled });
  }

  async dispatchOne() {
    if (!this.enabled()) return { status: "DISABLED" };
    if (!this.transport || typeof this.transport.publish !== "function")
      throw apiError("IOT_COMMAND_TRANSPORT_MISSING", "A command transport must be configured", 503);
    const now = this.now(), leaseToken = randomUUID();
    const item = await this.OutboxModel.findOneAndUpdate({ type: "COMMAND_DISPATCH", $or: [
      { status: "PENDING", availableAt: { $lte: now } }, { status: "LEASED", leaseUntil: { $lte: now } },
    ] }, { $set: { status: "LEASED", leaseToken, leaseUntil: new Date(now.getTime() + 30000) }, $inc: { attempts: 1 } },
    { returnDocument: "after", sort: { availableAt: 1, _id: 1 }, runValidators: true }).lean();
    if (!item) return { status: "IDLE" };
    try {
      const prepared = await this.prepare(item);
      if (!prepared) return { status: "ALREADY_COMPLETED", commandId: item.commandId };
      if (new Date(item.leaseUntil) <= this.now()) return { status: "LEASE_LOST", commandId: item.commandId };
      if (new Date(prepared.command.expiresAt) <= this.now()) throw apiError("IOT_COMMAND_EXPIRED", "Command expired before publication", 409);
      const namespace = prepared.device.organizationId ? String(prepared.device.organizationId) : `personal-${prepared.device.residenceId}`;
      await this.transport.publish({
        topic: `comunard/${namespace}/${prepared.command.gatewayId}/${prepared.command.deviceId}/command`,
        retained: false, qos: 1,
        payload: { schemaVersion: 1, commandId: prepared.command.commandId, resourceId: String(prepared.command.deviceId),
          gatewayId: String(prepared.command.gatewayId), profileVersion: prepared.command.profileVersion,
          expiresAt: new Date(prepared.command.expiresAt).toISOString(), payload: prepared.command.payload },
      });
      const completed = await this.OutboxModel.updateOne(this.leaseFilter(item), { $set: {
        status: "SENT", sentAt: this.now(), leaseToken: null, leaseUntil: null, lastErrorCode: "",
      } });
      return { status: completed.modifiedCount === 1 ? "SENT" : "LEASE_LOST", commandId: item.commandId };
    } catch (error) {
      return this.fail(item, error);
    }
  }

  leaseFilter(item) {
    return { _id: item._id, status: "LEASED", leaseToken: item.leaseToken, leaseUntil: { $gt: this.now() } };
  }

  async prepare(item) {
    const session = await this.mongo.startSession();
    let prepared = null;
    try {
      await session.withTransaction(async () => {
        prepared = null;
        const lease = await this.OutboxModel.findOne(this.leaseFilter(item)).session(session).lean();
        if (!lease) throw apiError("IOT_COMMAND_LEASE_LOST", "Command lease is no longer owned", 409);
        const command = await this.CommandModel.findOne({ commandId: item.commandId }).session(session).lean();
        if (!command || !sameContext(item, command)) throw apiError("IOT_COMMAND_TARGET_INVALID", "Outbox command context does not match", 409);
        if (["ACKNOWLEDGED", "EXECUTED", "FAILED", "EXPIRED"].includes(command.status)) {
          await this.OutboxModel.updateOne(this.leaseFilter(item), { $set: { status: ["ACKNOWLEDGED", "EXECUTED"].includes(command.status) ? "SENT" : "DEAD", leaseToken: null, leaseUntil: null } }, { session });
          return;
        }
        if (new Date(command.expiresAt) <= this.now()) throw apiError("IOT_COMMAND_EXPIRED", "Command has expired", 409);
        if (item.attempts > 5) throw apiError("IOT_COMMAND_RETRY_EXHAUSTED", "Command publication retries exhausted", 409);
        const device = await this.DeviceModel.findById(command.deviceId).session(session).lean();
        const gateway = await this.GatewayModel.findById(command.gatewayId).session(session).lean();
        const profile = device?.profileId ? await this.ProfileModel.findById(device.profileId).session(session).lean() : null;
        if (!device || !sameContext(device, command) || String(device.gatewayId) !== String(command.gatewayId) || device.profileVersion !== command.profileVersion)
          throw apiError("IOT_COMMAND_TARGET_INVALID", "Command device binding changed", 409);
        validateTarget(device, gateway, profile, command.payload);
        const mapping = await this.MappingModel.findOne({ resourceType: "GATEWAY", resourceId: gateway._id,
          integration: "AWS", status: "SYNCED", externalId: gateway.awsThingName }).session(session).lean();
        if (!mapping || !sameContext(mapping, gateway)) throw apiError("IOT_COMMAND_TARGET_INVALID", "Gateway provisioning mapping is not active", 409);
        try { await this.authorize(command, device); }
        catch (error) {
          if (error.statusCode >= 400 && error.statusCode < 500) throw apiError("IOT_COMMAND_AUTHORIZATION_REVOKED", "Command authorization was revoked", 403);
          throw error;
        }
        const active = await this.GatewayModel.updateOne({ _id: gateway._id, status: "ACTIVE" }, { $inc: { ingestionRevision: 1 } }, { session });
        if (active.modifiedCount !== 1) throw apiError("IOT_COMMAND_TARGET_INVALID", "Gateway was revoked", 409);
        if (command.status === "REQUESTED") {
          const updated = await this.CommandModel.updateOne({ commandId: command.commandId, status: "REQUESTED", expiresAt: { $gt: this.now() } },
          { $set: { status: "DISPATCHED", dispatchedAt: this.now() } }, { session });
          if (updated.modifiedCount !== 1) throw apiError("IOT_COMMAND_LEASE_LOST", "Command changed concurrently", 409);
        }
        prepared = { command, device };
      });
      return prepared;
    } finally { await session.endSession(); }
  }

  async fail(item, error) {
    if (error.code === "IOT_COMMAND_LEASE_LOST") return { status: "LEASE_LOST", commandId: item.commandId };
    const terminalCodes = new Set(["IOT_COMMAND_TARGET_INVALID", "IOT_COMMAND_AUTHORIZATION_REVOKED", "IOT_COMMAND_EXPIRED", "IOT_COMMAND_RETRY_EXHAUSTED", "IOT_COMMAND_UNSUPPORTED", "IOT_PROFILE_PAYLOAD_INVALID"]);
    const terminal = terminalCodes.has(error.code) || item.attempts >= 5;
    const code = terminalCodes.has(error.code) ? error.code : "IOT_COMMAND_PUBLISH_FAILED";
    const session = await this.mongo.startSession();
    let applied = false;
    try {
      await session.withTransaction(async () => {
        applied = false;
        const update = await this.OutboxModel.updateOne(this.leaseFilter(item), { $set: {
          status: terminal ? "DEAD" : "PENDING", lastErrorCode: code, leaseToken: null, leaseUntil: null,
          availableAt: new Date(this.now().getTime() + Math.min(30000, 1000 * 2 ** item.attempts)),
        } }, { session });
        if (update.modifiedCount !== 1) return;
        if (terminal) await this.CommandModel.updateOne({ commandId: item.commandId,
          ...(code === "IOT_COMMAND_EXPIRED" ? expiryCandidates(this.now()) : { status: { $in: ["REQUESTED", "DISPATCHED"] } }) },
          { $set: { status: code === "IOT_COMMAND_EXPIRED" ? "EXPIRED" : "FAILED", failureCode: code } }, { session });
        applied = true;
      });
      return { status: applied ? (terminal ? "DEAD" : "RETRY_PENDING") : "LEASE_LOST", commandId: item.commandId };
    } finally { await session.endSession(); }
  }
}

module.exports = { IoTCommandDispatcher };
