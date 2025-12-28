"use strict";

let express = require("express");
let router = express.Router();
let DocsController = require("../controllers/docs");
var md_auth = require("../middleware/auth");
let fs = require("fs");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const condoId = req.body.condominiumId;

    if (!condoId) {
      return cb(new Error("condoId es requerido"), null);
    }

    const uploadPath = path.join(__dirname, "..", "uploads", "docs", condoId);

    // 📂 Crear directorio si no existe
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err, null);
      }
      cb(null, uploadPath);
    });
  },

  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName + ext);
  },
});

const upload = multer({ storage: storage });
// GET

router.get(
  "/docs/getDirectories/:id",
  md_auth.authenticated,
  DocsController.getDirectoriesByCreatedBy
);

router.get(
  "/docs/getDocsByName/:condoId/:filename",
  md_auth.authenticated,
  DocsController.openFileByPath
);

// POST

router.post(
  "/docs/createDoc",
  [md_auth.authenticated, upload.array("file")],
  DocsController.createDoc
);

// DELETE

router.delete(
  "/deleteDoc",
  md_auth.authenticated,
  DocsController.deleteFileByName
);

module.exports = router;
