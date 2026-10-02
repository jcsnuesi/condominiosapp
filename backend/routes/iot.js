"use strict";

const express = require("express");
const controller = require("../controllers/iot");
const ownerRegistration = require("../controllers/iotOwnerRegistration");
const { authenticated } = require("../middleware/auth");
const { requirePermission } = require("../middleware/organizationAuth");

const router = express.Router();
const condoRead = requirePermission("iot.read");
const condoCreate = requirePermission("iot.create");

router.post("/iot/owners/register", ownerRegistration.register);
router.get("/iot/owners/verify/:token", ownerRegistration.verify);

router.get(
  "/iot/my/contexts",
  [authenticated, requirePermission("iot.read")],
  controller.getContexts
);
router.get(
  "/iot/dashboard",
  [authenticated, requirePermission("iot.read")],
  controller.getDashboard
);
router.post(
  "/iot/my/residences",
  [authenticated, requirePermission("iot.create")],
  controller.createPersonalResidence
);
router.get(
  "/iot/my/residences/:residenceId/devices",
  [authenticated, requirePermission("iot.read")],
  controller.listPersonalDevices
);
router.post(
  "/iot/my/residences/:residenceId/devices",
  [authenticated, requirePermission("iot.create")],
  controller.createPersonalDevice
);

router.get(
  "/iot/condominiums/:condominiumId/units/:unitId/devices",
  [authenticated, condoRead],
  controller.listUnitDevices
);
router.post(
  "/iot/condominiums/:condominiumId/units/:unitId/devices",
  [authenticated, condoCreate],
  controller.createUnitDevice
);
router.get(
  "/iot/condominiums/:condominiumId/common-area/devices",
  [authenticated, condoRead],
  controller.listCommonAreaDevices
);
router.post(
  "/iot/condominiums/:condominiumId/common-area/devices",
  [authenticated, condoCreate],
  controller.createCommonAreaDevice
);

router.get(
  "/iot/devices/:deviceId",
  [authenticated, requirePermission("iot.read")],
  controller.getDevice
);
router.patch(
  "/iot/devices/:deviceId",
  [authenticated, requirePermission("iot.update")],
  controller.updateDevice
);
router.delete(
  "/iot/devices/:deviceId",
  [authenticated, requirePermission("iot.delete")],
  controller.deleteDevice
);
router.get(
  "/iot/devices/:deviceId/state",
  [authenticated, requirePermission("iot.read")],
  controller.getDeviceState
);
router.get(
  "/iot/devices/:deviceId/events",
  [authenticated, requirePermission("iot.history")],
  controller.getDeviceEvents
);
router.patch(
  "/iot/events/:eventId/acknowledge",
  [authenticated, requirePermission("iot.history")],
  controller.acknowledgeEvent
);
router.post(
  "/iot/devices/:deviceId/commands",
  [authenticated, requirePermission("iot.control")],
  controller.controlDevice
);

router.post(
  "/iot/admin/subscriptions",
  authenticated,
  controller.provisionSubscription
);

module.exports = router;
