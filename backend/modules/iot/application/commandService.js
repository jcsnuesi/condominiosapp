"use strict";
const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const Device = require("../../../models/iotDevice");
const Gateway = require("../../../models/iotGateway");
const Profile = require("../../../models/iotDeviceProfile");
const Command = require("../../../models/iotCommand");
const Outbox = require("../../../models/iotIntegrationOutbox");
const Audit = require("../../../models/iotAuditEvent");
const { IoTAuthorizationService, notFound } = require("../../../service/iotAuthorization");
const { scopeFilter, apiError } = require("../../../service/iotService");
const { validateDeviceCommand } = require("../../../service/iotCapabilities");
const { validateProfilePayload } = require("../domain/profilePayload");
const { sameContext } = require("../domain/context");
const { objectId, exactObject } = require("./inventoryService");

function validateTarget(device, gateway, profile, payload) {
  if (!device || device.status !== "ACTIVE" || device.enabled === false || !device.gatewayId ||
      !gateway || String(device.gatewayId) !== String(gateway._id) || gateway.status !== "ACTIVE" || !sameContext(device, gateway) ||
      !profile || String(profile._id) !== String(device.profileId) || profile.version !== device.profileVersion ||
      profile.protocol !== device.protocol || profile.certification === "UNSUPPORTED" ||
      !profile.deviceTypes?.includes(device.deviceType) || !gateway.adapters?.includes(profile.protocol))
    throw apiError("IOT_COMMAND_TARGET_INVALID", "Command target is not available", 409);
  // Initial dispatcher only supports persistent state. Locks/gates require the
  // dedicated transient-action/interlock/physical-feedback flow from E4C.
  if (!["LIGHT", "AIR_CONDITIONER", "WATER_PUMP"].includes(device.deviceType))
    throw apiError("IOT_COMMAND_UNSUPPORTED", "Queued commands support persistent state only", 422);
  return validateProfilePayload(profile, "command", validateDeviceCommand(device.deviceType, payload));
}

class IoTCommandService {
  constructor({ DeviceModel = Device, GatewayModel = Gateway, ProfileModel = Profile, CommandModel = Command,
    OutboxModel = Outbox, AuditModel = Audit, authorization = new IoTAuthorizationService(), mongo = mongoose,
    now = () => new Date(), enabled = () => process.env.IOT_COMMANDS_ENABLED === "true" } = {}) {
    Object.assign(this, { DeviceModel, GatewayModel, ProfileModel, CommandModel, OutboxModel, AuditModel, authorization, mongo, now, enabled });
  }

  async requestCommand(actor, input, request = {}) {
    if (!this.enabled()) throw apiError("IOT_COMMANDS_DISABLED", "Queued commands are not enabled", 503);
    exactObject(input, ["deviceId", "payload", "idempotencyKey", "ttlSeconds"]);
    objectId(input.deviceId);
    if (typeof input.idempotencyKey !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(input.idempotencyKey))
      throw apiError("IOT_IDEMPOTENCY_KEY_INVALID", "A stable idempotencyKey is required", 422);
    const ttlSeconds = input.ttlSeconds === undefined ? 30 : input.ttlSeconds;
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 5 || ttlSeconds > 60)
      throw apiError("IOT_COMMAND_TTL_INVALID", "ttlSeconds must be between 5 and 60", 422);
    const device = await this.DeviceModel.findById(input.deviceId).lean();
    if (!device) throw notFound();
    await this.authorization.canControlDevice(actor, device);
    const gateway = device.gatewayId ? await this.GatewayModel.findById(device.gatewayId).lean() : null;
    const profile = device.profileId ? await this.ProfileModel.findById(device.profileId).lean() : null;
    const payload = validateTarget(device, gateway, profile, input.payload);
    const findPrevious = () => this.CommandModel.findOne({ actorId: actor.account._id, requestKey: input.idempotencyKey }).lean();
    const checkPrevious = (previous) => {
      if (!sameContext(previous, device) || String(previous.deviceId) !== String(device._id) ||
          JSON.stringify(previous.payload) !== JSON.stringify(payload))
        throw apiError("IOT_IDEMPOTENCY_MISMATCH", "Idempotency key belongs to a different command", 409);
      if (previous.ttlSeconds !== ttlSeconds) throw apiError("IOT_IDEMPOTENCY_MISMATCH", "Idempotency key has a different command TTL", 409);
      return previous;
    };
    const previous = await findPrevious();
    if (previous) return checkPrevious(previous); // Never extend expiry on retry.
    const issuedAt = this.now(), expiresAt = new Date(issuedAt.getTime() + ttlSeconds * 1000);
    const session = await this.mongo.startSession();
    let command;
    try {
      await session.withTransaction(async () => {
        const currentDevice = await this.DeviceModel.findById(device._id).session(session).lean();
        const currentGateway = await this.GatewayModel.findById(gateway._id).session(session).lean();
        const currentProfile = await this.ProfileModel.findById(profile._id).session(session).lean();
        validateTarget(currentDevice, currentGateway, currentProfile, payload);
        await this.authorization.canControlDevice(actor, currentDevice);
        [command] = await this.CommandModel.create([{
          ...scopeFilter(currentDevice), commandId: `cmd-${randomUUID()}`, deviceId: device._id, gatewayId: gateway._id,
          actorId: actor.account._id, actorType: "HUMAN", actorRole: actor.role, requestKey: input.idempotencyKey,
          profileVersion: currentProfile.version, payload, ttlSeconds, expiresAt, status: "REQUESTED",
        }], { session });
        await this.OutboxModel.create([{ ...scopeFilter(currentDevice), type: "COMMAND_DISPATCH", commandId: command.commandId, availableAt: issuedAt }], { session });
        await this.AuditModel.create([{
          ...scopeFilter(currentDevice), deviceId: device._id, actorId: actor.account._id, actorRole: actor.role,
          action: "COMMAND_REQUESTED", success: true, value: { commandId: command.commandId, payload },
          requestId: String(request.id || "").slice(0, 128), ip: String(request.ip || "").slice(0, 64),
        }], { session });
      });
      return command.toObject ? command.toObject() : command;
    } catch (error) {
      if (error.code === 11000) { const winner = await findPrevious(); if (winner) return checkPrevious(winner); }
      throw error;
    } finally { await session.endSession(); }
  }
}

module.exports = { IoTCommandService, validateTarget };
