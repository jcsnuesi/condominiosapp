"use strict";

const familyController = require("../controllers/family");
const express = require("express");
const router = express.Router();
const {
  authenticated,
  ownerAuth,
  adminAuth,
} = require("../middleware/middleware_bundle");
const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/families" });

// GET METHOD
router.get(
  "/get-familyMembers/:id",
  authenticated,
  familyController.getFamilyByOwnerId
);
router.get(
  "/familyMembers-byCondo/:condoId",
  [authenticated, ownerAuth],
  familyController.getFamilyMemberByCondoId
);

// POST METHOD
router.post(
  "/create-family",
  [authenticated, md_upload],
  familyController.createAccount
);

// PUT METHOD
router.put(
  "/update-family-auth",
  [authenticated, ownerAuth],
  familyController.authFamily
);
router.put(
  "/update-family-member",
  [authenticated, md_upload, ownerAuth],
  familyController.updateFamilyMember
);
router.put(
  "/delete-family-member/:id",
  [authenticated, ownerAuth],
  familyController.hideFamilyMember
);

module.exports = router;
