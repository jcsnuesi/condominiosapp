"use strict";

const express = require("express");
const { authenticated } = require("../../middleware/auth");
const { requirePermission } = require("../../middleware/organizationAuth");
const { IoTInventoryService, exactObject } = require("./application/inventoryService");
const { deviceResponse } = require("../../controllers/iot");
const { IoTCommandService } = require("./application/commandService");
const { connectivityAt } = require("./domain/freshness");

function gatewayResponse(gateway) {
  return {
    id: String(gateway._id), displayName: gateway.displayName, scopeType: gateway.scopeType,
    hardwareModel: gateway.hardwareModel || "", status: gateway.status,
    adapters: gateway.adapters || [], lastHeartbeatAt: gateway.lastHeartbeatAt || null,
    agentVersion: gateway.agentVersion || null, configurationVersion: gateway.configurationVersion,
    connectivity: gateway.status === "ACTIVE" ? connectivityAt(gateway.lastHeartbeatAt) : "UNKNOWN",
    health: gateway.health ? {
      reportedConfigurationVersion: gateway.health.reportedConfigurationVersion,
      uptimeSeconds: gateway.health.uptimeSeconds, spoolCommandCount: gateway.health.spoolCommandCount,
      spoolAccountedBytes: gateway.health.spoolAccountedBytes, spoolCapacityBytes: gateway.health.spoolCapacityBytes,
      storageBlocked: gateway.health.storageBlocked,
    } : null,
    createdAt: gateway.createdAt,
  };
}

function profileResponse(profile) {
  return {
    id: String(profile._id), key: profile.key, version: profile.version,
    manufacturer: profile.manufacturer, model: profile.model, protocol: profile.protocol,
    deviceTypes: profile.deviceTypes || [], certification: profile.certification,
    commandFeedback: profile.commandFeedback || "NONE",
    testedFirmware: profile.testedFirmware || [],
    stateFields: profile.stateFields || [], commandFields: profile.commandFields || [],
  };
}

function commandResponse(command) {
  return {
    id: command.commandId, deviceId: String(command.deviceId), status: command.status,
    expiresAt: command.expiresAt, dispatchedAt: command.dispatchedAt,
    acknowledgedAt: command.acknowledgedAt, executedAt: command.executedAt,
    confirmed: command.status === "EXECUTED" && Boolean(command.evidenceRef),
    failureCode: command.failureCode || "", createdAt: command.createdAt,
  };
}

function createInventoryRouter({ service = new IoTInventoryService(), commandService = new IoTCommandService(), authenticate = authenticated,
  enabled = () => process.env.IOT_INVENTORY_ENABLED === "true" } = {}) {
  const router = express.Router();
  function route(method, path, permission, action, status = 200) {
    router[method](path, authenticate, requirePermission(permission), async (req, res) => {
      try {
        if (!enabled()) return res.status(503).send({ success: false, data: null,
          error: { message: "IoT inventory is not enabled" }, code: "IOT_INVENTORY_DISABLED" });
        const data = await action(req);
        return res.status(status).send({ success: true, data, error: null, code: status === 201 ? "CREATED" : status === 202 ? "ACCEPTED" : "OK" });
      } catch (error) {
        const statusCode = error.statusCode || (error.name === "ValidationError" || error.name === "StrictModeError" ? 422 : 500);
        return res.status(statusCode).send({ success: false, data: null,
          error: { message: statusCode < 500 ? error.message : "IoT operation could not be completed" },
          code: error.code || (statusCode === 422 ? "IOT_INPUT_INVALID" : "IOT_REQUEST_FAILED") });
      }
    });
  }
  route("post", "/iot/gateways", "iot.create", async (req) => ({ gateway: gatewayResponse(await service.createGateway(req.auth, req.body, req)) }), 201);
  route("get", "/iot/gateways", "iot.read", async (req) => {
    exactObject(req.query, ["scopeType", "condominiumId", "unitId", "residenceId", "limit", "after"]);
    const { limit, after, ...scope } = req.query;
    const page = await service.listGateways(req.auth, scope, { limit, after });
    return { gateways: page.items.map(gatewayResponse), nextCursor: page.nextCursor };
  });
  route("get", "/iot/gateways/:gatewayId", "iot.read", async (req) => ({ gateway: gatewayResponse(await service.getGateway(req.auth, req.params.gatewayId)) }));
  route("patch", "/iot/gateways/:gatewayId", "iot.update", async (req) => ({ gateway: gatewayResponse(await service.updateGateway(req.auth, req.params.gatewayId, req.body, req)) }));
  route("get", "/iot/profiles", "iot.read", async (req) => {
    const page = await service.listProfiles(req.auth, req.query);
    return { profiles: page.items.map(profileResponse), nextCursor: page.nextCursor };
  });
  route("patch", "/iot/devices/:deviceId/binding", "iot.update", async (req) => ({ device: deviceResponse(await service.bindDevice(req.auth, req.params.deviceId, req.body, req), req.auth) }));
  route("get", "/iot/commands/:commandId", "iot.history", async (req) => ({ command: commandResponse(await service.getCommand(req.auth, req.params.commandId)) }));
  route("post", "/iot/commands", "iot.control", async (req) => ({ command: commandResponse(await commandService.requestCommand(req.auth, req.body, req)) }), 202);
  return router;
}

module.exports = { createInventoryRouter, gatewayResponse, profileResponse, commandResponse };
