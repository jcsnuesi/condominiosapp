"use strict";

let express = require("express");
let router = express.Router();
let DocsController = require("../controllers/docs");
var md_auth = require("../middleware/auth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/docs/"); // <-- carpeta de destino
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // <-- obtiene la extension .pdf
    cb(null, uniqueName + ext); // <-- agrega la extension
  },
});

const upload = multer({ storage: storage });
// GET

router.get(
  "/getDirectory/:id",
  md_auth.authenticated,
  DocsController.getDocsDirectoryByCondoId
);

router.get(
  "/getDocsByName/:id/:file",
  md_auth.authenticated,
  DocsController.openFileByPath
);

// POST

router.post(
  "/createDoc",
  [md_auth.authenticated, upload.single("file")],
  DocsController.createDoc
);

// DELETE

router.delete(
  "/deleteDoc",
  md_auth.authenticated,
  DocsController.deleteFileByName
);

module.exports = router;
