"use strict";

const mongoose = require("mongoose");
const Owner = require("../models/owners");
const Condominium = require("../models/condominio");
const IoTAuditEvent = require("../models/iotAuditEvent");
const { IoTService } = require("../service/iotService");

function errorResponse(res, error) {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).send({
    status: "error",
    code: error.code || "IOT_REQUEST_FAILED",
    message:
      statusCode < 500 ? error.message : "IoT operation could not be completed",
  });
}

function deviceResponse(device, actor, detailed = false) {
  const canManage = Boolean(actor.permissions?.includes("iot.update"));
  return {
    id: String(device._id),
    displayName: device.displayName,
    deviceType: device.deviceType,
    protocol: device.protocol || "AWS_SHADOW",
    gatewayId: device.gatewayId ? String(device.gatewayId) : null,
    profileId: device.profileId ? String(device.profileId) : null,
    profileVersion: device.profileVersion || null,
    location: device.location,
    scopeType: device.scopeType,
    status: device.status,
    connectivity: device.connectivity,
    lastSeen: device.lastSeen,
    capabilities: device.capabilities,
    enabled: device.enabled,
    shadow: {
      reported: device.shadow?.reported || {},
      version: device.shadow?.version || 0,
      updatedAt: device.shadow?.updatedAt || null,
    },
    alerts: device.status === "ERROR" ? 1 : 0,
    createdAt: device.createdAt,
    ...(detailed && canManage ? { awsThingName: device.awsThingName } : {}),
    ...(detailed ? { metadata: device.metadata, shadow: device.shadow } : {}),
  };
}

function personalScope(req) {
  return {
    scopeType: "PERSONAL_RESIDENCE",
    residenceId: req.params.residenceId,
  };
}

function unitScope(req) {
  return {
    scopeType: "CONDOMINIUM_UNIT",
    condominiumId: req.params.condominiumId,
    unitId: req.params.unitId,
  };
}

function commonAreaScope(req) {
  return { scopeType: "COMMON_AREA", condominiumId: req.params.condominiumId };
}

function dashboardScope(req) {
  const scopeType = String(req.query.scopeType || "");
  if (scopeType === "PERSONAL_RESIDENCE")
    return personalScope({ params: req.query });
  if (scopeType === "CONDOMINIUM_UNIT") return unitScope({ params: req.query });
  if (scopeType === "COMMON_AREA")
    return commonAreaScope({ params: req.query });
  const error = new Error("A supported scopeType is required");
  error.statusCode = 400;
  error.code = "IOT_SCOPE_INVALID";
  throw error;
}

function createIoTController({
  service = new IoTService(),
  now = () => new Date(),
} = {}) {
  return {
    getContexts: async (req, res) => {
      try {
        const contexts = await service.getContexts(req.auth);
        return res.status(200).send({ status: "success", contexts });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    getDashboard: async (req, res) => {
      try {
        const dashboard = await service.getDashboard(
          req.auth,
          dashboardScope(req)
        );
        return res.status(200).send({
          status: "success",
          ...dashboard,
          devices: dashboard.devices.map((device) =>
            deviceResponse(device, req.auth)
          ),
          recentActivity: dashboard.recentActivity.map((event) => ({
            id: String(event._id),
            action: event.action,
            success: event.success,
            createdAt: event.createdAt,
          })),
          recentAlerts: dashboard.recentAlerts.map((event) => ({
            id: String(event._id),
            eventType: event.eventType,
            severity: event.severity,
            status: event.status,
            deviceName: event.deviceId?.displayName || "Device",
            occurredAt: event.occurredAt,
          })),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    listPersonalDevices: async (req, res) => {
      try {
        const devices = await service.listDevices(req.auth, personalScope(req));
        return res.status(200).send({
          status: "success",
          devices: devices.map((device) => deviceResponse(device, req.auth)),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    createPersonalDevice: async (req, res) => {
      try {
        const device = await service.createDevice(
          req.auth,
          personalScope(req),
          req.body || {},
          req
        );
        return res.status(201).send({
          status: "success",
          device: deviceResponse(device, req.auth, true),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    listUnitDevices: async (req, res) => {
      try {
        const devices = await service.listDevices(req.auth, unitScope(req));
        return res.status(200).send({
          status: "success",
          devices: devices.map((device) => deviceResponse(device, req.auth)),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    createUnitDevice: async (req, res) => {
      try {
        const device = await service.createDevice(
          req.auth,
          unitScope(req),
          req.body || {},
          req
        );
        return res.status(201).send({
          status: "success",
          device: deviceResponse(device, req.auth, true),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    listCommonAreaDevices: async (req, res) => {
      try {
        const devices = await service.listDevices(
          req.auth,
          commonAreaScope(req)
        );
        return res.status(200).send({
          status: "success",
          devices: devices.map((device) => deviceResponse(device, req.auth)),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    createCommonAreaDevice: async (req, res) => {
      try {
        const device = await service.createDevice(
          req.auth,
          commonAreaScope(req),
          req.body || {},
          req
        );
        return res.status(201).send({
          status: "success",
          device: deviceResponse(device, req.auth, true),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    getDevice: async (req, res) => {
      try {
        const device = await service.getDevice(req.auth, req.params.deviceId);
        return res.status(200).send({
          status: "success",
          device: deviceResponse(device, req.auth, true),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    updateDevice: async (req, res) => {
      try {
        const device = await service.updateDevice(
          req.auth,
          req.params.deviceId,
          req.body || {},
          req
        );
        return res.status(200).send({
          status: "success",
          device: deviceResponse(device, req.auth, true),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    deleteDevice: async (req, res) => {
      try {
        const result = await service.deleteDevice(
          req.auth,
          req.params.deviceId,
          req
        );
        return res.status(200).send({ status: "success", ...result });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    getDeviceState: async (req, res) => {
      try {
        const state = await service.getDeviceState(
          req.auth,
          req.params.deviceId
        );
        return res.status(200).send({ status: "success", state });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    getDeviceEvents: async (req, res) => {
      try {
        const events = await service.getDeviceEvents(
          req.auth,
          req.params.deviceId
        );
        return res.status(200).send({
          status: "success",
          events: events.map((event) => ({
            id: String(event._id),
            eventType: event.eventType,
            severity: event.severity,
            status: event.status,
            observedValue: event.observedValue,
            occurredAt: event.occurredAt,
          })),
        });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    acknowledgeEvent: async (req, res) => {
      try {
        const result = await service.acknowledgeEvent(
          req.auth,
          req.params.eventId
        );
        return res.status(200).send({ status: "success", ...result });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    controlDevice: async (req, res) => {
      try {
        const state = await service.controlDevice(
          req.auth,
          req.params.deviceId,
          req.body || {},
          req
        );
        return res.status(200).send({ status: "success", state });
      } catch (error) {
        return errorResponse(res, error);
      }
    },
    createPersonalResidence: async (req, res) => {
      const actor = req.auth;
      const residenceLabel = String(req.body?.residenceLabel || "").trim();
      if (actor.role !== "OWNER" || !actor.account?.emailVerified) {
        return res.status(403).send({
          status: "forbidden",
          code: "IOT_PERSONAL_OWNER_REQUIRED",
          message: "A verified owner account is required",
        });
      }
      if (!residenceLabel || residenceLabel.length > 100) {
        return res.status(422).send({
          status: "error",
          code: "IOT_OWNER_RESIDENCE_INVALID",
          message: "A residence name is required",
        });
      }
      if ((actor.account.propertyDetails || []).length >= 20) {
        return res.status(409).send({
          status: "error",
          code: "IOT_RESIDENCE_LIMIT_REACHED",
          message: "The residence limit has been reached",
        });
      }
      const residenceId = new mongoose.Types.ObjectId();
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const result = await Owner.updateOne(
            {
              _id: actor.account._id,
              status: "active",
              emailVerified: true,
              $expr: {
                $lt: [{ $size: { $ifNull: ["$propertyDetails", []] } }, 20],
              },
            },
            {
              $push: {
                propertyDetails: {
                  _id: residenceId,
                  contextType: "PERSONAL_RESIDENCE",
                  residenceLabel,
                  status_property: "active",
                  parkingsQty: 0,
                  isRenting: false,
                  contractStart: now(),
                  contractEnd: now(),
                },
              },
            },
            { session, runValidators: true }
          );
          if (result.modifiedCount !== 1) {
            const error = new Error(
              "Residence limit reached or owner is inactive"
            );
            error.statusCode = 409;
            error.code = "IOT_RESIDENCE_LIMIT_REACHED";
            throw error;
          }
          await IoTAuditEvent.create(
            [
              {
                scopeType: "PERSONAL_RESIDENCE",
                ownerId: actor.account._id,
                residenceId,
                actorId: actor.account._id,
                actorRole: actor.role,
                action: "RESIDENCE_CREATED",
                success: true,
                ip: req.ip || "",
              },
            ],
            { session }
          );
        });
        return res.status(201).send({
          status: "success",
          residence: { id: String(residenceId), label: residenceLabel },
        });
      } catch (error) {
        return errorResponse(res, error);
      } finally {
        await session.endSession();
      }
    },

  };
}

module.exports = createIoTController();
module.exports.createIoTController = createIoTController;
module.exports.deviceResponse = deviceResponse;
module.exports.dashboardScope = dashboardScope;
