"use strict";

let express = require("express");
let condominioController = require("../controllers/condominio");

let router = express.Router();
var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/properties" });
var { authenticated, adminAuth } = require("../middleware/middleware_bundle");
const VerifyData = require("../service/verifyParamData");
const phoneFormatFunc = new VerifyData();
const statusValidator = require("../middleware/status_validation");
const { requirePermission } = require("../middleware/organizationAuth");

router.get(
  "/condominioById/:id",
  [authenticated, requirePermission("condominiums.read", { getCondominiumId: (req) => req.params.id }), statusValidator.propertyStatus],
  condominioController.getCondominiumById
);
router.get(
  "/condominioByAdmin/:id",
  [authenticated, requirePermission("condominiums.read")],
  condominioController.getCondominiumsByAdmin
);
router.get(
  "/buildingDetail/:id",
  [authenticated, requirePermission("condominiums.read", { getCondominiumId: (req) => req.params.id })],
  condominioController.getBuildingDetails
);
router.get(
  "/condoWithInvoice/:id",
  [authenticated, requirePermission("condominiums.read")],
  condominioController.getOwnerCondoAndInvoices
);
router.get("/avatarCondominios/:avatar", condominioController.getAvatar);
// Obtener todas las unidades del owner con el ownerId y todos los condominios del admin con el adminId
router.get("/getUnits/:id", [authenticated], condominioController.getUnits);

router.get(
  "/condominio-page/:page",
  [authenticated, requirePermission("condominiums.read")],
  condominioController.CondominiumPagination
);
router.get(
  "/get-properties/:adminId",
  authenticated,
  condominioController.ownerByOrganization
);

// POST

router.post(
  "/create-condominio",
  [authenticated, requirePermission("condominiums.create", { organizationWide: true }), md_upload, adminAuth],
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
  [authenticated, requirePermission("condominiums.update", { getCondominiumId: (req) => req.params.id }), md_upload, adminAuth],
  condominioController.CondominiumUpdate
);

router.put(
  "/deactivate-owner/:condoId/:ownerId/:status",
  [authenticated, requirePermission("owners.update", { getCondominiumId: (req) => req.params.condoId }), adminAuth],
  condominioController.in_activeOwnerFromCondo
);

router.put(
  "/admin-deleteProperty/:id",
  [authenticated, requirePermission("condominiums.delete", { getCondominiumId: (req) => req.params.id }), adminAuth],
  condominioController.CondominiumDelete
);

// DELETE
router.get(
  "/condominiums/:id/permanent-delete-impact",
  [authenticated, requirePermission("condominiums.delete", { getCondominiumId: (req) => req.params.id }), adminAuth],
  condominioController.PermanentDeleteImpact
);

router.delete(
  "/condominiums/:id/permanent",
  [authenticated, requirePermission("condominiums.delete", { getCondominiumId: (req) => req.params.id }), adminAuth],
  condominioController.PermanentDelete
);

module.exports = router;
