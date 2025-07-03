let express = require("express");
let ownerController = require("../controllers/owner");
let md_auth = require("../middleware/auth");
let emailRegisterGenerator = require("../controllers/whatsappController");
let router = express.Router();
let md_ws = require("../middleware/whatsappAuth");

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./uploads/owners" });

router.get("/owner-avatar/:avatar", ownerController.getAvatar);
router.get(
  "/condominioByOwnerId/:ownerId",
  md_auth.authenticated,
  ownerController.getCondominiumByOwnerId
);
router.get(
  "/get-assets-by-owner/:id",
  md_auth.authenticated,
  ownerController.getAssets
);
router.get(
  "/get-owner-by-id-or-email/:keyword",
  md_auth.authenticated,
  ownerController.getOwnerByIdentifier
);
// router.get("/get-family", md_auth.authenticated, ownerController.getFamily);

// router.get(
//   "/family-member-details/:id",
//   md_auth.authenticated,
//   ownerController.getFamilyDetailsById
// );

// verify email
router.get("/verify-email/:email", ownerController.emailVerification);

// create owner
router.post(
  "/create-owner",
  [md_upload, md_auth.emailOwnerRegistration],
  ownerController.createSingleOwner
);
router.post(
  "/create-multiple-owner",
  md_auth.emailOwnerRegistration,
  ownerController.createMultipleOwner
);

// invite owner
// router.post('/owner-register', [md_auth.authenticated], emailRegisterGenerator.emailOwnerRegister)

// router.post(
//   "/create-family",
//   [md_upload, md_auth.authenticated],
//   ownerController.secundaryAcc
// );

router.put(
  "/update-owner",
  [md_auth.authenticated, md_upload],
  ownerController.update
);
router.put(
  "/update-owner-unit",
  md_auth.authenticated,
  ownerController.updateProperties
);
router.put(
  "/delete-owner-unit",
  md_auth.authenticated,
  ownerController.deleteOwnerUnit
);

router.put(
  "/deactivate-owner",
  md_auth.authenticated,
  ownerController.deactivatedUser
);

router.put(
  "/add-new-owner-unit",
  md_auth.authenticated,
  ownerController.addOwnerUnit
);

module.exports = router;
