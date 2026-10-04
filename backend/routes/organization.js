"use strict";
const router = require("express").Router();
const registration = require("../controllers/adminRegistration");
const onboarding = require("../controllers/organization");
const { authenticated } = require("../middleware/auth");
const { requireOwnerAdmin } = require("../middleware/organizationAuth");
const registrationRateLimit = require("../middleware/registrationRateLimit");

router.post("/auth/admin/register", registrationRateLimit, registration.register);
router.post("/auth/admin/resend-verification", registrationRateLimit, registration.resend);
router.post("/auth/admin/verify/:token", registrationRateLimit, registration.verify);
router.get("/organization/onboarding", [authenticated, requireOwnerAdmin], onboarding.status);
router.post("/organization/onboarding/complete", [authenticated, requireOwnerAdmin], onboarding.complete);
module.exports = router;
