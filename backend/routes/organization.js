"use strict";

const express = require("express");
const controller = require("../controllers/organization");
const { authenticated } = require("../middleware/auth");
const { authorization } = require("../middleware/userAuth");

const router = express.Router();
router.post("/organizations", [authenticated, authorization], controller.provision);

module.exports = router;
