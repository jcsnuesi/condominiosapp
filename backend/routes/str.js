"use strict";

const express = require("express");
const strController = require("../controllers/str");
const { authenticated } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/rental-channels",
  authenticated,
  strController.upsertRentalChannel
);
router.get("/rental-channels", authenticated, strController.listRentalChannels);
router.put(
  "/rental-channels/:id/status",
  authenticated,
  strController.updateRentalChannelStatus
);
router.post(
  "/rental-channels/:id/sync",
  authenticated,
  strController.syncRentalChannel
);
router.get(
  "/external-reservations/conflicts/:condoId",
  authenticated,
  strController.listExternalConflicts
);
router.get(
  "/external-reservations/:condoId",
  authenticated,
  strController.listExternalReservations
);
router.post(
  "/external-reservations/:id/alerts/preregistration",
  authenticated,
  strController.createConflictPreregistrationAlert
);

module.exports = router;
