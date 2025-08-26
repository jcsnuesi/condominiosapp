"use strict";

let express = require("express");
let condominioController = require("../controllers/condominio");

let md_auth = require("../middleware/auth");
let router = express.Router();

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/properties" });
var { authenticated, adminAuth } = require("../middleware/middleware_bundle");
const VerifyData = require("../service/verifyParamData");
const phoneFormatFunc = new VerifyData();

router.get("/condominioById", condominioController.getCondominiumById);
router.get(
  "/condominioByAdmin/:id",
  [authenticated],
  condominioController.getCondominiumsByAdmin
);
router.get("/buildingDetail/:id", condominioController.getBuildingDetails);
router.get("/avatarCondominios/:avatar", condominioController.getAvatar);
// Obtener todas las unidades del owner con el ownerId y todos los condominios del admin con el adminId
router.get("/getUnits/:id", [authenticated], condominioController.getUnits);

router.get(
  "/condominio-page/:page",
  authenticated,
  condominioController.CondominiumPagination
);
router.get(
  "/get-properties",
  authenticated,
  condominioController.ownerByOrganization
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
router.post(
  "/create-multiple-condo",
  [authenticated, phoneFormatFunc.phoneFormat, phoneFormatFunc.validKeys],
  condominioController.createMultipleCondo
);

// PUT

router.put(
  "/updateCondominio/:id",
  [authenticated, md_upload, adminAuth],
  condominioController.CondominiumUpdate
);

router.put(
  "/admin-deleteProperty/:id",
  [authenticated, adminAuth],
  condominioController.CondominiumDelete
);

// DELETE

module.exports = router;
