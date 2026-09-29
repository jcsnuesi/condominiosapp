"use strict";

const familyController = require("../controllers/family");
const express = require("express");
const router = express.Router();
const {
  authenticated,
  ownerAuth,
  adminAuth,
} = require("../middleware/middleware_bundle");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/families/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // <-- obtiene la extension .pdf
    cb(null, uniqueName + ext); // <-- agrega la extension
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Solo imágenes JPG, JPEG o PNG"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
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
  [authenticated, upload.single("avatar"), ownerAuth],
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
