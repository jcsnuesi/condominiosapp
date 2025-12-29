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
const { param } = require("../routes/docs");

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
      const docsFound = await Docs.find({
        $or: [{ createdBy: params }, { condoId: params }],
      })
        .populate({
          path: "condoId",
          select: "alias",
        })
        .populate({
          path: "createdBy",
          select: "email name lastname",
        });

      if (!docsFound || docsFound.length === 0) {
        return res.status(201).send({
          status: "Not files",
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
  docsQty: async function (req, res) {
    let params = req.params.id;
    try {
      const docsCount = await Docs.countDocuments({
        $or: [{ createdBy: params }, { condoId: params }],
      });
      return res.status(200).send({
        status: "success",
        message: docsCount,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error while counting documents.",
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
  },
  deleteAllAttachments: async function (req, res) {
    const params = req.body;

    try {
      const docFound = await Docs.findOne({
        _id: params[0].id,
      });

      if (docFound != null || docFound != undefined) {
        docFound.file = [];
      } else {
        return res.status(404).send({
          status: "error",
          message: "Document or file not found.",
        });
      }
      await docFound.save();

      params.forEach((f) => {
        fs.unlink(`./uploads/docs/${f.condoId}/${f.filename}`, (err) => {
          if (err) {
            console.log("file was not deleted");
            return res.status(500).send({
              status: "error",
              message: "Error deleting file from server",
            });
          }
        });
      });

      return res.status(200).send({
        status: "success",
        message: "File deleted successfully",
      });
    } catch (error) {
      console.log(" error", error);
      return res.status(400).send({
        status: "error",
        message: "Bad request",
      });
    }
  },
  deleteAttachamentByName: async function (req, res) {
    const params = req.body;

    try {
      const docFound = await Docs.findOne({
        _id: params.id,
        "file.filename": params.filename,
      });

      if (docFound != null || docFound != undefined) {
        docFound.file = docFound.file.filter(
          (file) => file.filename !== params.filename
        );
      } else {
        return res.status(404).send({
          status: "error",
          message: "Document or file not found.",
        });
      }
      await docFound.save();

      fs.unlink(
        `./uploads/docs/${docFound.condoId}/${params.filename}`,
        (err) => {
          if (err) {
            console.log("file was not deleted");
            return res.status(500).send({
              status: "error",
              message: "Error deleting file from server",
            });
          } else {
            return res.status(200).send({
              status: "success",
              message: "File deleted successfully",
            });
          }
        }
      );
    } catch (error) {
      console.log(" error", error);
      return res.status(400).send({
        status: "error",
        message: "Bad request",
      });
    }
  },
  updateDoc: async function (req, res) {
    const docId = req.params.id;
    const params = req.body;
    let existingFiles = [];
    if (params.existingFiles) {
      existingFiles = JSON.parse(params.existingFiles);
    }

    try {
      const docToUpdate = await Docs.findById(docId);
      if (!docToUpdate) {
        return res.status(404).send({
          status: "error",
          message: "Document not found",
        });
      }
      // Update metadata fields
      docToUpdate.title = params.title || docToUpdate.title;
      docToUpdate.description = params.description || docToUpdate.description;
      docToUpdate.category = params.category || docToUpdate.category;
      docToUpdate.status = params.status || docToUpdate.status;
      docToUpdate.condoId = params.condominiumId;
      // Append new files if any
      if (req.files && req.files.length > 0) {
        if (existingFiles.length > 0) {
          const retainedFiles = docToUpdate.file.filter((file) =>
            existingFiles.some((f) => f.filename === file.filename)
          );
          docToUpdate.file = retainedFiles;
        }

        let updateFiles = req.files.map((file) => ({
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          url: `/getDocsByName/${docToUpdate.condoId}/${file.filename}`,
        }));
        updateFiles.forEach((file) => {
          docToUpdate.file.push(file);
        });
      }

      await docToUpdate.save();

      return res.status(200).send({
        status: "success",
        message: docToUpdate,
      });
    } catch (error) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error while updating document.",
      });
    }
  },
  deleteDoc: async function (req, res) {
    const docId = req.params.id;

    try {
      const docToDelete = await Docs.findById(docId);
      if (!docToDelete) {
        return res.status(404).send({
          status: "error",
          message: "Document not found",
        });
      }
      // Delete associated files from filesystem
      for (const file of docToDelete.file) {
        fs.unlink(
          `./uploads/docs/${docToDelete.condoId}/${file.filename}`,
          (err) => {
            if (err) {
              console.log("file was not deleted", err);
            }
          }
        );
      }
      await Docs.findByIdAndDelete(docId);

      return res.status(200).send({
        status: "success",
        message: "Document and associated files deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error while deleting document.",
      });
    }
  },
};

module.exports = DocsController;
