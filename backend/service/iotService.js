"use strict";

const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const IoTDevice = require("../models/iotDevice");
const IoTAuditEvent = require("../models/iotAuditEvent");
const IoTDeviceEvent = require("../models/iotDeviceEvent");
const Condominium = require("../models/condominio");
const { IoTAuthorizationService, notFound } = require("./iotAuthorization");
const { IoTSubscriptionService } = require("./iotSubscriptionService");
const {
  DEVICE_CAPABILITIES,
  validateDeviceCommand,
  sanitizeDeviceState,
} = require("./iotCapabilities");
const { getIoTProvider } = require("./iotProvider");
const { buildDeviceEvents } = require("./iotEventRules");

const ALLOWED_METADATA = new Set([
  "manufacturer",
  "model",
  "firmwareVersion",
  "energyThresholdW",
]);

function apiError(code, message, statusCode = 400) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function cleanMetadata(value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw apiError("IOT_METADATA_INVALID", "Device metadata must be an object");
  }
  const entries = Object.entries(value);
  if (
    entries.some(([key, item]) => {
      if (!ALLOWED_METADATA.has(key)) return true;
      if (key === "energyThresholdW") {
        return (
          typeof item !== "number" ||
          !Number.isFinite(item) ||
          item <= 0 ||
          item > 100000
        );
      }
      return typeof item !== "string" || item.length > 120;
    })
  ) {
    throw apiError(
      "IOT_METADATA_INVALID",
      "Device metadata contains unsupported fields"
    );
  }
  return Object.fromEntries(entries);
}

function scopeFilter(scope) {
  switch (scope.scopeType) {
    case "CONDOMINIUM_UNIT":
      return {
        scopeType: scope.scopeType,
        organizationId: scope.organizationId,
        condominiumId: scope.condominiumId,
        unitId: scope.unitId,
      };
    case "PERSONAL_RESIDENCE":
      return {
        scopeType: scope.scopeType,
        ownerId: scope.ownerId,
        residenceId: scope.residenceId,
      };
    case "COMMON_AREA":
      return {
        scopeType: scope.scopeType,
        organizationId: scope.organizationId,
        condominiumId: scope.condominiumId,
      };
    default:
      throw apiError("IOT_SCOPE_INVALID", "Device scope is invalid");
  }
}

function auditContext(device) {
  return {
    scopeType: device.scopeType,
    organizationId: device.organizationId || null,
    condominiumId: device.condominiumId || null,
    unitId: device.unitId || null,
    ownerId: device.ownerId || null,
    residenceId: device.residenceId || null,
    deviceId: device._id || null,
  };
}

class IoTService {
  constructor({
    DeviceModel = IoTDevice,
    AuditModel = IoTAuditEvent,
    EventModel = IoTDeviceEvent,
    authorization = new IoTAuthorizationService(),
    subscriptions = new IoTSubscriptionService(),
    provider = getIoTProvider(),
    mongo = mongoose,
    now = () => new Date(),
  } = {}) {
    this.DeviceModel = DeviceModel;
    this.AuditModel = AuditModel;
    this.EventModel = EventModel;
    this.authorization = authorization;
    this.subscriptions = subscriptions;
    this.provider = provider;
    this.mongo = mongo;
    this.now = now;
  }

  async recordAudit(
    actor,
    device,
    action,
    success,
    errorCode = "",
    value = null,
    request = null,
    session = null
  ) {
    const context = auditContext(device);
    const audit = {
      ...context,
      actorId: actor.account._id,
      actorRole: actor.role,
      action,
      success,
      errorCode,
      value,
      requestId: request?.id || request?.headers?.["x-request-id"] || "",
      ip: request?.ip || "",
    };
    return this.AuditModel.create([audit], session ? { session } : undefined);
  }

  async createDevice(actor, scopeInput, input, request = null) {
    const scope = await this.authorization.canCreateDevice(actor, scopeInput);
    const displayName = String(input?.displayName || "").trim();
    const deviceType = String(input?.deviceType || "").toUpperCase();
    if (!displayName || displayName.length > 120)
      throw apiError(
        "IOT_DISPLAY_NAME_INVALID",
        "Device name is required",
        422
      );
    if (!DEVICE_CAPABILITIES[deviceType])
      throw apiError(
        "IOT_DEVICE_TYPE_INVALID",
        "Device type is not supported",
        422
      );
    const metadata = cleanMetadata(input.metadata);
    const idempotencyKey = String(input.idempotencyKey || "").trim();
    if (idempotencyKey.length > 128)
      throw apiError(
        "IOT_IDEMPOTENCY_KEY_INVALID",
        "Idempotency key is too long",
        422
      );

    if (idempotencyKey) {
      const previous = await this.DeviceModel.findOne({
        createdBy: actor.account._id,
        idempotencyKey,
      }).lean();
      if (previous) {
        await this.authorization.canViewDevice(actor, previous);
        if (
          JSON.stringify(scopeFilter(previous)) !==
          JSON.stringify(scopeFilter(scope))
        ) {
          throw apiError(
            "IOT_IDEMPOTENCY_SCOPE_MISMATCH",
            "Idempotency key belongs to another context",
            409
          );
        }
        return previous;
      }
    }

    const deviceId = new this.mongo.Types.ObjectId();
    const awsThingName = `iot-${randomUUID()}`;
    const capabilities = DEVICE_CAPABILITIES[deviceType].capabilities;
    const session = await this.mongo.startSession();
    let device;
    try {
      await session.withTransaction(async () => {
        await this.subscriptions.reserveDevice(scope, session);
        const created = await this.DeviceModel.create(
          [
            {
              _id: deviceId,
              ...scope,
              displayName,
              awsThingName,
              deviceType,
              location: String(input.location || "")
                .trim()
                .slice(0, 120),
              createdBy: actor.account._id,
              status: "PROVISIONING",
              metadata,
              capabilities,
              idempotencyKey: idempotencyKey || null,
              quotaReserved: true,
            },
          ],
          { session }
        );
        device = created[0];
      });
    } finally {
      await session.endSession();
    }

    try {
      await this.provider.createThing({
        thingName: awsThingName,
        attributes: {
          deviceId: String(deviceId),
          scopeType: scope.scopeType,
          ...(scope.organizationId
            ? { organizationId: String(scope.organizationId) }
            : {}),
          ...(scope.condominiumId
            ? { condominiumId: String(scope.condominiumId) }
            : {}),
          ...(scope.unitId ? { unitId: String(scope.unitId) } : {}),
        },
      });

      const finalizeSession = await this.mongo.startSession();
      try {
        await finalizeSession.withTransaction(async () => {
          await this.DeviceModel.updateOne(
            { _id: deviceId, status: "PROVISIONING" },
            { $set: { status: "ACTIVE" } },
            { session: finalizeSession }
          );
          await this.recordAudit(
            actor,
            device,
            "DEVICE_CREATED",
            true,
            "",
            { deviceType },
            request,
            finalizeSession
          );
        });
      } finally {
        await finalizeSession.endSession();
      }
      return this.DeviceModel.findById(deviceId).lean();
    } catch (error) {
      await this.DeviceModel.updateOne(
        { _id: deviceId, status: "PROVISIONING" },
        { $set: { status: "ERROR" } }
      );
      try {
        await this.recordAudit(
          actor,
          device,
          "DEVICE_CREATED",
          false,
          error.code || "AWS_IOT_CREATE_FAILED",
          null,
          request
        );
      } catch (auditError) {
        error.auditError = auditError.code || "IOT_AUDIT_WRITE_FAILED";
      }
      if (error.statusCode) throw error;
      throw apiError(
        "AWS_IOT_CREATE_FAILED",
        "Device provisioning failed; the operation can be reconciled",
        502
      );
    }
  }

  async listDevices(actor, scopeInput) {
    const scope = await this.authorization.canCreateDevice(
      actor,
      scopeInput,
      "iot.read"
    );
    return this.DeviceModel.find({
      ...scopeFilter(scope),
      status: { $in: ["ACTIVE", "ERROR", "PROVISIONING", "DELETING"] },
    })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getContexts(actor) {
    if (!actor || !this.authorization.has(actor, "iot.read")) {
      throw apiError("IOT_PERMISSION_DENIED", "IoT access is not allowed", 403);
    }
    const contexts = [];
    if (actor.role === "OWNER") {
      for (const association of actor.account.propertyDetails || []) {
        if (
          String(association.status_property || "active").toLowerCase() ===
            "inactive" ||
          String(association.status || "active").toLowerCase() === "inactive"
        ) {
          continue;
        }
        if (association.contextType === "PERSONAL_RESIDENCE") {
          const scope = await this.authorization.canCreateDevice(
            actor,
            { scopeType: "PERSONAL_RESIDENCE", residenceId: association._id },
            "iot.read"
          );
          contexts.push(
            await this.summarizeContext(
              scope,
              association.residenceLabel || "Residencia personal"
            )
          );
          continue;
        }
        if (!association.addressId || !association.unitId) continue;
        const condominium = await Condominium.findById(association.addressId)
          .select("alias units")
          .lean();
        const unit = condominium?.units?.find(
          (item) => String(item._id) === String(association.unitId)
        );
        if (!unit) continue;
        const scope = await this.authorization.canCreateDevice(
          actor,
          {
            scopeType: "CONDOMINIUM_UNIT",
            condominiumId: condominium._id,
            unitId: unit._id,
          },
          "iot.read"
        );
        contexts.push(
          await this.summarizeContext(
            scope,
            `${condominium.alias} · ${unit.label}`
          )
        );
      }
      return contexts;
    }

    if (!["ADMIN", "STAFF_ADMIN", "STAFF"].includes(actor.role))
      return contexts;
    const filter = { organizationId: actor.organizationId, status: "active" };
    if (actor.scope?.mode !== "ALL") {
      filter._id = { $in: actor.scope?.condominiumIds || [] };
    }
    const condominiums = await Condominium.find(filter)
      .select("alias organizationId")
      .lean();
    for (const condominium of condominiums) {
      try {
        const scope = await this.authorization.resolveCommonArea(
          actor,
          condominium._id,
          "iot.read"
        );
        contexts.push(
          await this.summarizeContext(
            scope,
            `${condominium.alias} · Áreas comunes`
          )
        );
      } catch (error) {
        if (error.statusCode !== 403 && error.statusCode !== 404) throw error;
      }
    }
    return contexts;
  }

  async summarizeContext(scope, label) {
    const [deviceCount, entitlement] = await Promise.all([
      this.DeviceModel.countDocuments({
        ...scopeFilter(scope),
        status: { $ne: "DELETED" },
      }),
      this.subscriptions.getEntitlement(scope),
    ]);
    return { ...scope, label, deviceCount, ...entitlement };
  }

  async resolveDevice(actor, deviceId, permission = "view") {
    const device = await this.DeviceModel.findById(deviceId).lean();
    if (!device || device.status === "DELETED") throw notFound();
    const method = {
      view: "canViewDevice",
      control: "canControlDevice",
      update: "canUpdateDevice",
      delete: "canDeleteDevice",
      history: "canViewHistory",
    }[permission];
    if (!method) throw new Error("Unsupported IoT permission action");
    await this.authorization[method](actor, device);
    return device;
  }

  async getDevice(actor, deviceId) {
    return this.resolveDevice(actor, deviceId, "view");
  }

  async updateDevice(actor, deviceId, changes, request = null) {
    const device = await this.resolveDevice(actor, deviceId, "update");
    const update = {};
    if (changes.displayName !== undefined) {
      const displayName = String(changes.displayName).trim();
      if (!displayName || displayName.length > 120)
        throw apiError(
          "IOT_DISPLAY_NAME_INVALID",
          "Device name is invalid",
          422
        );
      update.displayName = displayName;
    }
    if (changes.location !== undefined)
      update.location = String(changes.location).trim().slice(0, 120);
    if (changes.enabled !== undefined) {
      if (typeof changes.enabled !== "boolean")
        throw apiError("IOT_ENABLED_INVALID", "enabled must be boolean", 422);
      update.enabled = changes.enabled;
    }
    if (changes.metadata !== undefined)
      update.metadata = cleanMetadata(changes.metadata);
    if (!Object.keys(update).length)
      throw apiError(
        "IOT_UPDATE_EMPTY",
        "No supported device fields were supplied",
        422
      );

    await this.DeviceModel.updateOne(
      { _id: device._id, status: { $ne: "DELETED" } },
      { $set: update }
    );
    await this.recordAudit(
      actor,
      device,
      "DEVICE_UPDATED",
      true,
      "",
      update,
      request
    );
    return this.DeviceModel.findById(device._id).lean();
  }

  async deleteDevice(actor, deviceId, request = null) {
    const device = await this.resolveDevice(actor, deviceId, "delete");
    if (device.status === "DELETED") return { deleted: true };
    await this.DeviceModel.updateOne(
      { _id: device._id },
      { $set: { status: "DELETING" } }
    );
    try {
      await this.provider.deleteThing({ thingName: device.awsThingName });
    } catch (error) {
      await this.recordAudit(
        actor,
        device,
        "DEVICE_DELETED",
        false,
        error.code || "AWS_IOT_DELETE_FAILED",
        null,
        request
      );
      throw apiError(
        "AWS_IOT_DELETE_FAILED",
        "Device removal is pending reconciliation",
        502
      );
    }

    const session = await this.mongo.startSession();
    try {
      await session.withTransaction(async () => {
        await this.subscriptions.releaseDevice(device, session);
        await this.DeviceModel.updateOne(
          { _id: device._id },
          {
            $set: { status: "DELETED", enabled: false, deletedAt: this.now() },
          },
          { session }
        );
        await this.recordAudit(
          actor,
          device,
          "DEVICE_DELETED",
          true,
          "",
          null,
          request,
          session
        );
      });
    } finally {
      await session.endSession();
    }
    return { deleted: true };
  }

  async getDeviceState(actor, deviceId) {
    const device = await this.resolveDevice(actor, deviceId, "view");
    const shadow = await this.provider.getShadow({
      thingName: device.awsThingName,
    });
    if (!shadow) {
      return {
        ...device.shadow,
        reported: sanitizeDeviceState(
          device.deviceType,
          device.shadow?.reported
        ),
        desired: sanitizeDeviceState(device.deviceType, device.shadow?.desired),
        delta: sanitizeDeviceState(device.deviceType, device.shadow?.delta),
      };
    }
    const state = shadow.state || {};
    const reported = sanitizeDeviceState(device.deviceType, state.reported);
    const desired = sanitizeDeviceState(device.deviceType, state.desired);
    const delta = sanitizeDeviceState(device.deviceType, state.delta);
    const lastSeen = shadow.timestamp || null;
    const online =
      lastSeen &&
      this.now().getTime() - new Date(lastSeen).getTime() <= 5 * 60 * 1000;
    const connectivity = !lastSeen ? "UNKNOWN" : online ? "ONLINE" : "OFFLINE";
    const next = {
      reported,
      desired,
      delta,
      version: shadow.version || 0,
      updatedAt: lastSeen,
    };
    await this.DeviceModel.updateOne(
      { _id: device._id },
      {
        $set: {
          shadow: next,
          lastSeen,
          connectivity,
        },
      }
    );
    const generatedEvents = buildDeviceEvents(
      device,
      reported,
      connectivity,
      shadow.version || 0,
      lastSeen || this.now()
    );
    if (generatedEvents.length) {
      try {
        await this.EventModel.insertMany(
          generatedEvents.map((event) => ({
            ...auditContext(device),
            deviceId: device._id,
            ...event,
          })),
          { ordered: false }
        );
      } catch (error) {
        if (
          error?.code !== 11000 &&
          !error?.writeErrors?.every((item) => item.code === 11000)
        ) {
          throw error;
        }
      }
    }
    return next;
  }

  async controlDevice(actor, deviceId, command, request = null) {
    const device = await this.resolveDevice(actor, deviceId, "control");
    if (!device.enabled || device.status !== "ACTIVE") {
      throw apiError(
        "IOT_DEVICE_NOT_CONTROLLABLE",
        "Device is not currently controllable",
        409
      );
    }
    const desired = validateDeviceCommand(device.deviceType, command);
    try {
      const shadow = await this.provider.updateShadow({
        thingName: device.awsThingName,
        desired,
      });
      await this.recordAudit(
        actor,
        device,
        "DEVICE_CONTROLLED",
        true,
        "",
        desired,
        request
      );
      const state = shadow?.state || {};
      return {
        version: shadow?.version || 0,
        state: {
          reported: sanitizeDeviceState(device.deviceType, state.reported),
          desired: sanitizeDeviceState(
            device.deviceType,
            state.desired || desired
          ),
          delta: sanitizeDeviceState(device.deviceType, state.delta),
        },
      };
    } catch (error) {
      await this.recordAudit(
        actor,
        device,
        "DEVICE_CONTROLLED",
        false,
        error.code || "AWS_IOT_CONTROL_FAILED",
        desired,
        request
      );
      if (error.statusCode) throw error;
      throw apiError(
        "AWS_IOT_CONTROL_FAILED",
        "Device command could not be sent",
        502
      );
    }
  }

  async getDashboard(actor, scopeInput) {
    const devices = await this.listDevices(actor, scopeInput);
    const active = devices.filter((device) => device.status === "ACTIVE");
    const scope = await this.authorization.canCreateDevice(
      actor,
      scopeInput,
      "iot.read"
    );
    const events = await this.AuditModel.find(scopeFilter(scope))
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    const alertFilter = { ...scopeFilter(scope), status: "NEW" };
    const [alertCount, recentAlerts, entitlement] = await Promise.all([
      this.EventModel.countDocuments({
        ...alertFilter,
        severity: { $in: ["WARNING", "CRITICAL"] },
      }),
      this.EventModel.find(alertFilter)
        .populate("deviceId", "displayName")
        .sort({ occurredAt: -1 })
        .limit(5)
        .lean(),
      this.subscriptions.getEntitlement(scope),
    ]);
    return {
      total: devices.length,
      online: active.filter((device) => device.connectivity === "ONLINE")
        .length,
      offline: active.filter((device) => device.connectivity === "OFFLINE")
        .length,
      unknown: active.filter((device) => device.connectivity === "UNKNOWN")
        .length,
      alerts:
        alertCount +
        devices.filter((device) => device.status === "ERROR").length,
      recentAlerts,
      ...entitlement,
      devices,
      recentActivity: events,
    };
  }

  async getDeviceEvents(actor, deviceId) {
    const device = await this.resolveDevice(actor, deviceId, "history");
    return this.EventModel.find({ deviceId: device._id })
      .sort({ occurredAt: -1 })
      .limit(50)
      .lean();
  }

  async acknowledgeEvent(actor, eventId) {
    const event = await this.EventModel.findById(eventId).lean();
    if (!event) throw notFound();
    const device = await this.DeviceModel.findById(event.deviceId).lean();
    if (!device) throw notFound();
    await this.authorization.canViewHistory(actor, device);
    if (event.status === "ACKNOWLEDGED") return { acknowledged: true };
    await this.EventModel.updateOne(
      { _id: event._id, status: "NEW" },
      {
        $set: {
          status: "ACKNOWLEDGED",
          acknowledgedAt: this.now(),
          acknowledgedBy: actor.account._id,
        },
      }
    );
    await this.recordAudit(actor, device, "ALERT_ACKNOWLEDGED", true, "", {
      eventType: event.eventType,
    });
    return { acknowledged: true };
  }
}

module.exports = { IoTService, cleanMetadata, scopeFilter, apiError };
