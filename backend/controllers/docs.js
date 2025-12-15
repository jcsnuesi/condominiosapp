"use strict";

var Docs = require("../models/docs");
// const Condominium = require("../models/condominio");
var validator = require("validator");
var path = require("path");
const fs = require("fs");
const ExceptionHandler = require("../error/errorHandler");
var directoryManagement = require("../service/createDirectory");
var findDirectory = require("../service/findDirectory");

var DocsController = {
  createDoc: function (req, res) {
    var docsAllowed = [
      "pdf",
      "gif",
      "jpeg",
      "jpg",
      "png",
      "doc",
      "docx",
      "xls",
      "xlsx",
    ];

    var params = req.body;

    try {
      var filePath = req.files.file0.path;
      var title_val = !validator.isEmpty(params.title);
      var description_val = !validator.isEmpty(params.description);
      var condoId_val = !validator.isEmpty(params.condoId);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "File was not uploaded",
      });
    }

    var fileSplit = filePath.split(/[".\\"]/);

    if (!docsAllowed.includes(fileSplit[3])) {
      fs.unlink(filePath, (err) => {
        return res.status(400).send({
          status: "Failed",
          message: `Format file allowed ${docsAllowed}`,
        });
      });
    }

    if (title_val && description_val && condoId_val) {
      Docs.find({
        $and: [{ title: params.title }, { condoId: params.condoId }],
      })
        .populate(
          "condoId",
          "alias phone1 street_1 sector_name province city country"
        )
        .exec(async (err, docFound) => {
          var Exceptions = ExceptionHandler.docRegistration(err, docFound);

          if (Exceptions[0]) {
            return res.status(Exceptions[1]).send({
              status: Exceptions[2],
              message: Exceptions[3],
            });
          }

          var docsFields = new Docs();

          for (const key in params) {
            docsFields[key] = params[key];
          }

          if (req.user.role.includes("ROLE_ADMIN")) {
            docsFields.createdByAdmin = req.user.sub;
          } else if (req.user.role.includes("ROLE_STAFF")) {
            docsFields.createdByStaff = req.user.sub;
          }

          const directory = await findDirectory.findDirectory(params.condoId);

          // Crear carpeta para los futuros documentos de cada condominio
          const newDirectory = `./uploads/docs/${directory}`;

          const currentFilePath = "./uploads/docs";

          const fileName = `${fileSplit[2]}.${fileSplit[3]}`;

          const fileNewName = `${params.title}.${fileSplit[3]}`;

          directoryManagement.CreateDirectory(
            newDirectory,
            currentFilePath,
            fileName,
            fileNewName
          );

          docsFields.save((err, docCreated) => {
            if (err) {
              return res.status(500).send({
                status: "error",
                message: "Server error",
              });
            }

            return res.status(200).send({
              status: "success",
              message: docCreated,
            });
          });
        });
    }
  },
  getDocsDirectoryByCondoId: async function (req, res) {
    let params = req.params.id;

    var directory = await findDirectory.findDirectory(params);

    const docPath = `./uploads/docs/${directory}`;

    fs.readdir(docPath, (err, files) => {
      if (err) {
        return res.status(404).send({
          status: "NOT FOUND",
          message: "No directory found",
        });
      }

      // Filtramos solo los directorios del array de archivos
      const directorios = files.filter((archivo) => {
        const rutaCompleta = `${docPath}/${archivo}`;
        return fs.statSync(rutaCompleta);
      });

      return res.status(200).send({
        status: "success",
        message: directorios,
      });
    });
  },
  openFileByPath: async function (req, res) {
    var params = req.params.id;
    var fileName = req.params.file;

    try {
      var directory = await findDirectory.findDirectory(params);
      var id_val = !validator.isEmpty(params);
    } catch (error) {
      return res.status(400).send({
        status: "Error",
        message: "Bad Request",
      });
    }

    var filePath = `./uploads/docs/${directory}/${fileName}`;

    if (id_val) {
      fs.readFile(filePath, (err, data) => {
        if (data) {
          return res.sendFile(path.resolve(filePath));
        } else {
          return res.status(404).send({
            status: "error",
            message: "Doc does not exists.",
            details: err,
          });
        }
      });
    }
  },
  deleteFileByName: function (req, res) {
    var params = req.body;

    try {
      var id_val = !validator.isEmpty(params.id);
      var id_filename = !validator.isEmpty(params.filename);
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: "Bad request",
      });
    }

    if (id_val && id_filename) {
      Docs.findOneAndDelete({ _id: params.id })
        .populate("condoId", "alias")
        .exec((err, docFound) => {
          var Exceptions = ExceptionHandler.loginExceptions(err, docFound);

          if (Exceptions[0]) {
            return res.status(Exceptions[1]).send({
              status: Exceptions[2],
              message: Exceptions[3],
            });
          }

          fs.unlink(
            `./uploads/docs/${docFound.condoId.alias}/${params.filename}`,
            (err) => {
              if (err) {
                console.log("file was not deleted");
              } else {
                return res.status(200).send({
                  status: "success",
                  message: docFound,
                });
              }
            }
          );
        });
    }
  },
};

module.exports = DocsController;
