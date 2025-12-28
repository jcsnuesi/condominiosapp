"use strict";

// const Condominium = require("../models/condominio");
var validator = require("validator");
var path = require("path");
const fs = require("fs");
const ExceptionHandler = require("../error/errorHandler");
const Condominium = require("../models/condominio");
const Docs = require("../models/docs");
var findDirectory = require("../service/findDirectory");
const { model } = require("mongoose");

var DocsController = {
  createDoc: async function (req, res) {
    var params = req.body;

    try {
      const newDocs = new Docs({
        title: params.title,
        description: params.description,
        category: params.category,
        status: params.status,
        createdBy: params.uploadedBy,
        createdByModel: params.uploadedRole,
        condoId: params.condominiumId,
        file: req.files.map((file) => ({
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          url: `/getDocsByName/${params.condominiumId}/${file.filename}`,
        })),
      });
      await newDocs.save();

      return res.status(200).send({
        status: "success",
        message: newDocs,
      });
    } catch (error) {
      console.log(error);
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
      return res.status(500).send({
        status: "error",
        message: "Bad request",
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
  getDirectoriesByCreatedBy: async function (req, res) {
    let params = req.params.id;

    try {
      const docsFound = await Docs.find({ createdBy: params })
        .populate({
          path: "condoId",
          select: "alias",
        })
        .populate({
          path: "createdBy",
          select: "email name lastname",
        });
      console.log(docsFound);

      if (!docsFound || docsFound.length === 0) {
        return res.status(404).send({
          status: "NOT FOUND",
          message: "No documents found for the given creator.",
        });
      }

      return res.status(200).send({
        status: "success",
        message: docsFound,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error while retrieving documents.",
      });
    }
  },
  openFileByPath: async function (req, res) {
    var filename = req.params.filename;
    var directory = req.params.condoId;

    var params = `./uploads/docs/${directory}/${filename}`;

    try {
      if (fs.existsSync(params)) {
        return res.sendFile(path.resolve(params));
      } else {
        return res.status(404).send({
          status: "error",
          message: "Doc does not exists.",
        });
      }
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
