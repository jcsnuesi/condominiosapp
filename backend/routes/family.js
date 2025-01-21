"use strict";

const familyController = require("../controllers/family");
const express = require("express");
const router = express.Router();
const { authenticated, ownerAuth } = require("../middleware/middleware_bundle");
const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/families" });
// POST METHOD

router.post(
  "/create-family",
  [authenticated, md_upload],
  familyController.createAccount
);

module.exports = router;
