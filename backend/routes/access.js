"use strict";

const express = require("express");
const multer = require("multer");
const controller = require("../controllers/access");
const { authenticated } = require("../middleware/auth");
const { requireOwnerAdmin } = require("../middleware/organizationAuth");

const router = express.Router();
const profileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});
router.get("/auth/me", authenticated, controller.me);
router.put(
  "/auth/me",
  [authenticated, profileUpload.single("avatar")],
  controller.updateMe
);
router.put("/auth/me/password", authenticated, controller.changeMyPassword);
router.get("/access/catalog", [authenticated, requireOwnerAdmin], controller.catalog);
router.get("/access/policies", [authenticated, requireOwnerAdmin], controller.listPolicies);
router.post("/access/policies", [authenticated, requireOwnerAdmin], controller.createPolicy);
router.put("/access/policies/:id", [authenticated, requireOwnerAdmin], controller.updatePolicy);
router.delete("/access/policies/:id", [authenticated, requireOwnerAdmin], controller.archivePolicy);
router.get("/organization-users", [authenticated, requireOwnerAdmin], controller.listAdministrativeUsers);
router.put("/access/grants/:subjectModel/:subjectId", [authenticated, requireOwnerAdmin], controller.upsertGrant);

module.exports = router;
