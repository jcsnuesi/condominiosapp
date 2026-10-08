"use strict";

const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const Gateway = require("../../../models/iotGateway");
const Profile = require("../../../models/iotDeviceProfile");
const Mapping = require("../../../models/iotIntegrationMapping");
const Device = require("../../../models/iotDevice");
const Command = require("../../../models/iotCommand");
const Audit = require("../../../models/iotAuditEvent");
const { IoTAuthorizationService, notFound } = require("../../../service/iotAuthorization");
const { scopeFilter, apiError } = require("../../../service/iotService");
const { sameContext } = require("../domain/context");

function objectId(value) {
  if (typeof value !== "string" || !/^[a-f0-9]{24}$/i.test(value))
    throw apiError("IOT_ID_INVALID", "A valid resource identifier is required", 422);
  return value;
}

function exactObject(value, keys) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
      Object.keys(value).some((key) => !keys.includes(key)))
    throw apiError("IOT_INPUT_INVALID", "Unsupported input fields", 422);
}

function scopeInput(value) {
  exactObject(value, ["scopeType", "condominiumId", "unitId", "residenceId"]);
  const required = { COMMON_AREA: ["condominiumId"], CONDOMINIUM_UNIT: ["condominiumId", "unitId"], PERSONAL_RESIDENCE: ["residenceId"] }[value.scopeType];
  if (!required || Object.keys(value).some((key) => key !== "scopeType" && !required.includes(key)))
    throw apiError("IOT_SCOPE_INVALID", "Invalid resource context", 422);
  for (const key of required) objectId(value[key]);
  return value;
}

function pageInput(input = {}) {
  const limit = input.limit === undefined ? 25 : Number(input.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50)
    throw apiError("IOT_PAGE_INVALID", "limit must be between 1 and 50", 422);
  return { limit, ...(input.after ? { after: objectId(input.after) } : {}) };
}

function requiredText(value, name, max = 120) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max)
    throw apiError("IOT_INPUT_INVALID", `${name} is invalid`, 422);
  return value.trim();
}

class IoTInventoryService {
  constructor({ GatewayModel = Gateway, ProfileModel = Profile, MappingModel = Mapping,
    DeviceModel = Device, CommandModel = Command, AuditModel = Audit,
    authorization = new IoTAuthorizationService(), mongo = mongoose } = {}) {
    Object.assign(this, { GatewayModel, ProfileModel, MappingModel, DeviceModel, CommandModel, AuditModel, authorization, mongo });
  }

  async createGateway(actor, input, request = {}) {
    exactObject(input, ["scope", "displayName", "hardwareModel", "idempotencyKey"]);
    const scope = await this.authorization.canCreateDevice(actor, scopeInput(input.scope));
    const displayName = requiredText(input.displayName, "displayName");
    const hardwareModel = input.hardwareModel === undefined ? "" : requiredText(input.hardwareModel, "hardwareModel");
    const idempotencyKey = requiredText(input.idempotencyKey, "idempotencyKey", 128);
    const previous = await this.GatewayModel.findOne({ createdBy: actor.account._id, idempotencyKey }).lean();
    if (previous) return this.checkPrevious(previous, scope, displayName, hardwareModel);
    const session = await this.mongo.startSession();
    let gateway;
    try {
      await session.withTransaction(async () => {
        [gateway] = await this.GatewayModel.create([{
          ...scope, displayName, hardwareModel, idempotencyKey, createdBy: actor.account._id,
          awsThingName: `gateway-${randomUUID()}`, status: "PROVISIONING",
        }], { session });
        await this.MappingModel.create([{
          ...scope, resourceType: "GATEWAY", resourceId: gateway._id,
          integration: "AWS", status: "PENDING",
        }], { session });
        await this.audit(actor, gateway, "GATEWAY_REGISTERED", { gatewayId: String(gateway._id) }, request, session);
      });
      return gateway.toObject ? gateway.toObject() : gateway;
    } catch (error) {
      if (error.code === 11000) {
        const winner = await this.GatewayModel.findOne({ createdBy: actor.account._id, idempotencyKey }).lean();
        if (winner) return this.checkPrevious(winner, scope, displayName, hardwareModel);
      }
      throw error;
    } finally { await session.endSession(); }
  }

  checkPrevious(previous, scope, displayName, hardwareModel) {
    if (!sameContext(previous, scope) || previous.displayName !== displayName || (previous.hardwareModel || "") !== hardwareModel)
      throw apiError("IOT_IDEMPOTENCY_MISMATCH", "Idempotency key was used for a different registration", 409);
    return previous;
  }

  async listGateways(actor, input, pagination = {}) {
    const scope = await this.authorization.canCreateDevice(actor, scopeInput(input), "iot.read");
    const { limit, after } = pageInput(pagination);
    const rows = await this.GatewayModel.find({ ...scopeFilter(scope), ...(after ? { _id: { $gt: after } } : {}) })
      .sort({ _id: 1 }).limit(limit + 1).lean();
    return { items: rows.slice(0, limit), nextCursor: rows.length > limit ? String(rows[limit - 1]._id) : null };
  }

  async getGateway(actor, gatewayId, permission = "iot.read") {
    const gateway = await this.GatewayModel.findById(objectId(gatewayId)).lean();
    if (!gateway) throw notFound();
    await this.authorization.assertDevicePermission(actor, gateway, permission);
    return gateway;
  }

  async updateGateway(actor, gatewayId, input, request = {}) {
    exactObject(input, ["displayName", "hardwareModel"]);
    if (!Object.keys(input).length) throw apiError("IOT_UPDATE_EMPTY", "No editable fields supplied", 422);
    const gateway = await this.getGateway(actor, gatewayId, "iot.update");
    const changes = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, requiredText(value, key)]));
    const session = await this.mongo.startSession();
    try {
      await session.withTransaction(async () => {
        const result = await this.GatewayModel.updateOne({ _id: gateway._id }, { $set: changes }, { session, runValidators: true });
        if (result.matchedCount !== 1) throw notFound();
        await this.audit(actor, gateway, "GATEWAY_UPDATED", { gatewayId, ...changes }, request, session);
      });
      return { ...gateway, ...changes };
    } finally { await session.endSession(); }
  }

  async listProfiles(actor, input = {}) {
    if (!this.authorization.has(actor, "iot.read")) throw apiError("IOT_PERMISSION_DENIED", "IoT access is not allowed", 403);
    exactObject(input, ["protocol", "limit", "after"]);
    if (input.protocol !== undefined && !["AWS_SHADOW", "ZIGBEE", "ONVIF", "FRIGATE"].includes(input.protocol))
      throw apiError("IOT_PROTOCOL_INVALID", "Unsupported protocol", 422);
    const { limit, after } = pageInput(input);
    const rows = await this.ProfileModel.find({ ...(input.protocol ? { protocol: input.protocol } : {}), ...(after ? { _id: { $gt: after } } : {}) })
      .sort({ _id: 1 }).limit(limit + 1).lean();
    return { items: rows.slice(0, limit), nextCursor: rows.length > limit ? String(rows[limit - 1]._id) : null };
  }

  async bindDevice(actor, deviceId, input, request = {}) {
    exactObject(input, ["gatewayId", "profileId", "bindingAddress"]);
    const device = await this.DeviceModel.findById(objectId(deviceId)).lean();
    if (!device || device.status !== "ACTIVE") throw notFound();
    await this.authorization.canUpdateDevice(actor, device);
    const gateway = await this.getGateway(actor, objectId(input.gatewayId), "iot.update");
    if (gateway.status !== "ACTIVE" || !sameContext(device, gateway))
      throw apiError("IOT_BINDING_MISMATCH", "Gateway is unavailable or belongs to another context", 409);
    const profile = await this.ProfileModel.findById(objectId(input.profileId)).lean();
    if (!profile || profile.certification === "UNSUPPORTED") throw notFound();
    if (!profile.deviceTypes?.includes(device.deviceType)) throw apiError("IOT_PROFILE_INVALID", "Profile does not support this device type", 422);
    if (!gateway.adapters?.includes(profile.protocol)) throw apiError("IOT_PROTOCOL_INVALID", "Gateway does not support this protocol", 422);
    if (device.gatewayId) throw apiError("IOT_BINDING_EXISTS", "Reassignment requires a dedicated reconciliation flow", 409);
    const changes = { gatewayId: gateway._id, profileId: profile._id, profileVersion: profile.version,
      protocol: profile.protocol, bindingAddress: requiredText(input.bindingAddress, "bindingAddress", 128) };
    const session = await this.mongo.startSession();
    try {
      await session.withTransaction(async () => {
        const currentGateway = await this.GatewayModel.findOne({ _id: gateway._id, status: "ACTIVE" }).session(session).lean();
        if (!currentGateway || !sameContext(currentGateway, device) || !currentGateway.adapters?.includes(profile.protocol)) throw notFound();
        const result = await this.DeviceModel.updateOne({ _id: device._id, status: "ACTIVE", gatewayId: null }, { $set: changes }, { session, runValidators: true });
        if (result.modifiedCount !== 1) throw apiError("IOT_BINDING_EXISTS", "Device binding changed concurrently", 409);
        await this.audit(actor, device, "DEVICE_BOUND", { gatewayId: String(gateway._id), profileId: String(profile._id), profileVersion: profile.version }, request, session);
      });
      return { ...device, ...changes };
    } catch (error) {
      if (error.code === 11000) throw apiError("IOT_BINDING_EXISTS", "Gateway address is already assigned", 409);
      throw error;
    } finally { await session.endSession(); }
  }

  async getCommand(actor, commandId) {
    if (typeof commandId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(commandId)) throw apiError("IOT_ID_INVALID", "Invalid command identifier", 422);
    const command = await this.CommandModel.findOne({ commandId }).lean();
    if (!command) throw notFound();
    const device = await this.DeviceModel.findById(command.deviceId).lean();
    if (!device || device.status === "DELETED" || !sameContext(device, command)) throw notFound();
    await this.authorization.canViewHistory(actor, device);
    return command;
  }

  async audit(actor, resource, action, value, request, session) {
    return this.AuditModel.create([{ ...scopeFilter(resource), deviceId: action === "DEVICE_BOUND" ? resource._id : null,
      actorId: actor.account._id, actorRole: actor.role, action, success: true, value,
      requestId: String(request.id || "").slice(0, 128), ip: String(request.ip || "").slice(0, 64),
    }], { session });
  }
}

module.exports = { IoTInventoryService, scopeInput, objectId, exactObject, pageInput };
