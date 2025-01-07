"use strict";

let express = require("express");
let condominioController = require("../controllers/condominio");

let md_auth = require("../middleware/auth");
let router = express.Router();

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/properties" });
var { authenticated, adminAuth } = require("../middleware/middleware_bundle");
// GET

router.get(
  "/condominios",
  authenticated,
  condominioController.getCondominiumByAdmin
);

router.get("/condominioById", condominioController.getCondominiumById);
router.get(
  "/condominioByAdmin",
  authenticated,
  condominioController.getCondominiumsByAdmin
);
router.get("/buildingDetail/:id", condominioController.getBuildingDetails);
router.get("/avatarCondominios/:avatar", condominioController.getAvatar);

router.get(
  "/condominio-page/:page",
  authenticated,
  condominioController.CondominiumPagination
);

// POST

router.post(
  "/create-condominio",
  [authenticated, md_upload, adminAuth],
  condominioController.createCondominium
);
router.post(
  "/create-Apartment",
  authenticated,
  condominioController.createApartment
);

// PUT

router.put(
  "/updateCondominio",
  authenticated,
  condominioController.CondominiumUpdate
);

router.put(
  "/admin-deleteProperty/:id",
  [authenticated, adminAuth],
  condominioController.CondominiumDelete
);

// DELETE

module.exports = router;
