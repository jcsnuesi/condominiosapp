"use strict";

var express = require("express");
var StaffController = require("../controllers/staff");
var router = express.Router();
var md_auth = require("../middleware/auth");
var confirmLinkVerification = require("../service/validateLinkVerification");
var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/staff" });
const checkUpdatePermissions = require("../service/checkPermissions");
const statusValidator = require("../middleware/status_validation");

const {
  authenticated,
  adminAuth,
  ownerAuth,
} = require("../middleware/middleware_bundle");

// GET
router.get(
  "/staff-card/:id",
  md_auth.authenticated,
  StaffController.getStaffCard
);
router.get(
  "/staffs-admin/:id",
  md_auth.authenticated,
  StaffController.getStaffAdmin
);

router.get("/avatar-staff/:avatar", StaffController.getAvatar);
router.get(
  "/staff-by-condo-id/:id",
  [authenticated],
  StaffController.getStaffByOwnerAndCondoId
);
router.get(
  "/staff-by-owner-id/:id",
  [authenticated],
  StaffController.getStaffByOwnerId
);
router.get(
  "/staff-verify-email/:email",
  confirmLinkVerification.emailVerification
);

// POST

router.post(
  "/create-staff",
  [md_auth.authenticated, md_upload, statusValidator.propertyStatus],
  StaffController.createStaff
);
router.post(
  "/create-staff-admin",
  [md_auth.authenticated, md_upload],
  StaffController.createAdmin
);
router.post(
  "/verify-password-staff",
  md_auth.authenticated,
  StaffController.verifyPasswordStaff
);

// router.put('/updateAccount', [md_auth.authenticated, md_upload], UserController.update)
router.put(
  "/update-staff",
  [
    md_auth.authenticated,
    [md_upload, statusValidator.propertyStatus],
    checkUpdatePermissions.checkPermissionsToUpdate,
  ],
  StaffController.update
);
router.put(
  "/update-staff-admin",
  [md_auth.authenticated],
  StaffController.updateStaffAdmin
);

// // DELETE

router.put("/delete-staff", md_auth.authenticated, StaffController.deleteBatch);
router.put(
  "/delete-staff-admin",
  md_auth.authenticated,
  StaffController.deleteBatchAdmin
);

module.exports = router;
