"use strict";

var validator = require("validator");
var fs = require("fs");
var path = require("path");
let bcrypt = require("bcrypt");
let errorHandler = require("../error/errorHandler");
let checkExtensions = require("../service/extensions");
const { v4: uuidv4 } = require("uuid");
const emailVerification = require("../service/generateVerification");
const verifyClass = require("../service/verifyParamData");
const generatePassword = require("generate-password");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Admin = require("../models/admin");
const Staff = require("../models/staff");
const Staff_Admin = require("../models/staff_admin");
const Condominio = require("../models/condominio");
let mongoose = require("mongoose");
const { create } = require("domain");
const staff = require("../models/staff");
let saltRounds = 10;
// Generar una contraseña con opciones específicas
let temp_password = generatePassword.generate({
  length: 8, // Longitud de la contraseña
  numbers: true, // Incluir números
  symbols: true, // Incluir símbolos
  uppercase: true, // Incluir letras mayúsculas
  lowercase: true, // Incluir letras minúsculas
  excludeSimilarCharacters: true, // Excluir caracteres similares
});

var StaffController = {
  createStaff: async function (req, res) {
    var params = req.body;

    var optionToVerify = new verifyClass();

    try {
      !validator.isEmpty(params.name);
      !validator.isEmpty(params.lastname);
      validator.isEmail(params.email);
      optionToVerify.phonesTransformation(params.phone);
    } catch (error) {
      console.log("Error validating staff data:", error);
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    // Image settings
    if (Boolean(req.files != undefined) && Object.keys(req.files).length != 0) {
      let avatarPath = req.files.avatar.path;
      let avatarFullname = avatarPath.split("\\")[2];
      params.avatar = avatarFullname;

      //verificar la extension de archivo enviado sea tipo imagen
      var imgFormatAccepted = checkExtensions.confirmExtension(req);

      if (imgFormatAccepted == false) {
        return res.status(400).send({
          status: "bad request",
          message:
            "System just accept image format '.jpg', '.jpeg', '.gif', '.png'",
        });
      }
    }

    const staffFound = await Staff.findOne({
      $or: [
        { email: params.email },
        { government_id: params.government_id },
        { phone: params.phone },
      ],
    });

    if (staffFound) {
      return res.status(400).send({
        status: "error",
        message: "Staff with this email, government ID or phone already exists",
      });
    }

    try {
      const newStaff = new Staff({
        avatar: params.avatar,
        name: params.name.toLowerCase(),
        lastname: params.lastname.toLowerCase(),
        gender: params.gender.toLowerCase(),
        government_id: params.government_id.toLowerCase(),
        email: params.email.toLowerCase(),
        password: await bcrypt.hash(temp_password, saltRounds),
        phone: params.phone.toLowerCase(),
        position: params.position.toLowerCase(),
        condo_id: params.condo_id,
        createdBy: req.user.sub,
      });
      await newStaff.save();

      await emailVerification.StaffRegistration({
        email: newStaff.email,
        password: temp_password,
      });

      newStaff.password = undefined;

      return res.status(200).send({
        status: "success",
        message: newStaff,
      });
    } catch (error) {
      console.log("Error creating staff:", error);
      return res.status(500).send({
        status: "error",
        message: error,
      });
    }
  },
  createAdmin: async function (req, res) {
    let params = req.body;

    try {
      const AdminFound = await Staff_Admin.findOne({
        $or: [{ email: params.email }, { government_id: params.government_id }],
      });

      if (AdminFound) {
        return res.status(400).send({
          status: "bad request",
          message: "Admin with this email or government ID already exists",
        });
      }

      let staff = new Staff_Admin({
        name: params.name,
        lastname: params.lastname,
        gender: params.gender,
        government_id: params.government_id,
        email: params.email,
        password: await bcrypt.hash(temp_password, saltRounds),
        phone: params.phone,
        position: params.position,
        createdBy: req.user.sub,
        permissions: params.permissions,
      });

      staff.save(async (err, staffSaved) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Staff was not created",
            errors: err,
          });
        }

        await Admin.findOneAndUpdate(
          { _id: req.user.sub },
          { $push: { admins: staffSaved._id } }
        );
        staffSaved.password = temp_password;
        emailVerification.StaffRegistration(staffSaved);
        return res.status(200).send({
          status: "success",
          message: staffSaved,
        });
      });
    } catch (error) {
      console.log("Error creating admin:", error);
      return res.status(500).send({
        status: "error",
        message: "Server error",
        error: error,
      });
    }
  },
  updateStaffAdmin: async function (req, res) {
    let staffParams = req.body;

    try {
      let stafFound = await Staff_Admin.findOne({ _id: staffParams._id });

      if (Object.prototype.hasOwnProperty.call(staffParams, "password")) {
        staffParams.password = await bcrypt.hash(
          staffParams.password,
          saltRounds
        );
      }

      if (!stafFound) {
        return res.status(404).send({
          status: "error",
          message: "STAFF not found",
        });
      }

      await Staff_Admin.findOneAndUpdate(
        { _id: staffParams._id },
        staffParams,
        {
          new: true,
        }
      );

      return res.status(200).send({
        status: "success",
        message: "User updated successfully",
      });
    } catch (err) {
      return res.status(500).send({
        status: "error",
        message: "Server error",
        error: err,
      });
    }
  },
  update: async function (req, res) {
    let staffParams = req.body;
    const avatarPath = req?.files?.avatar?.path?.split("\\")[2];
    var filePath = null;

    if (Boolean(avatarPath != undefined)) {
      staffParams.avatar = avatarPath;
      filePath = "./uploads/staff/" + avatarPath;
    }

    try {
      let stafFound = await Staff.findOne({ _id: staffParams._id });

      if (Boolean(staffParams.currentPassword != undefined)) {
        var passChecked = await bcrypt.compare(
          staffParams.currentPassword,
          stafFound.password
        );

        if (passChecked) {
          staffParams.password = await bcrypt.hash(
            staffParams.password,
            saltRounds
          );
        } else {
          return res.status(400).send({
            status: "error",
            message: "Password incorrect",
          });
        }
      }

      if (!stafFound) {
        this.unlikeImage(filePath);
        return res.status(404).send({
          status: "error",
          message: "STAFF not found",
        });
      }

      for (const key in staffParams) {
        if (key != "password") {
          stafFound[key] = staffParams[key].toLowerCase();
        }
      }

      stafFound.password = staffParams.password;

      const staffUpdated = await Staff.findOneAndUpdate(
        { _id: staffParams._id },
        stafFound,
        { new: true }
      );
      staffUpdated.password = undefined;

      return res.status(200).send({
        status: "success",
        message: staffUpdated,
      });
    } catch (err) {
      if (Boolean(avatarPath != undefined)) this.unlikeImage(filePath);

      return res.status(500).send({
        status: "error",
        message: "Server error",
        error: err,
      });
    }
  },
  getAvatar: function (req, res) {
    var avatarParams = req.params.avatar;
    var filePath = "./uploads/staff/" + avatarParams;

    fs.access(filePath, fs.constants.F_OK, (err, exist) => {
      if (err) {
        console.error(`${filePath} does not exist ${err}`);
      } else {
        return res.sendFile(path.resolve(filePath));
      }
    });
  },
  delete: async function (req, res) {
    var params = req.body;

    if (req.user.role.toLowerCase() != "admin") {
      return res.status(403).send({
        status: "forbidden",
        message: "Denied",
      });
    }

    // Hacer el bloque de codigo para eliminar del Schema ADMIN
    Staff.findOneAndUpdate(
      { _id: params._id },
      { status: "inactive" },
      { new: true },
      (err, deleted) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error deleting",
          });
        }

        return res.status(200).send({
          status: "success",
          message: deleted,
        });
      }
    );
  },
  deleteBatch: async function (req, res) {
    try {
      const updateData = req.body;
      const userIds = updateData.map((user) => user._id); // Extraer los IDs de los usuarios a eliminar del cuerpo de la solicitud

      if (!Array.isArray(updateData) || userIds.length === 0) {
        return res
          .status(400)
          .send({ message: "No se proporcionaron IDs válidos" });
      }
      // Realizar la eliminación por lotes
      const result = await Staff.updateMany(
        { _id: { $in: userIds } },
        { status: "inactive" },
        { new: true }
      );

      if (result.deletedCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontraron usuarios para eliminar",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Usuarios eliminados correctamente",
        deletedCount: result.deletedCount,
      });
    } catch (err) {
      console.error("Error en la eliminación:", err);
      return res.status(500).send({ message: "Error en la petición" });
    }
  },
  deleteBatchAdmin: async function (req, res) {
    const updateData = req.body;
    var statusUser = updateData.status == "inactive" ? "active" : "inactive";

    try {
      if (!Array.isArray(updateData.id) || updateData.id.length === 0) {
        return res
          .status(400)
          .send({ message: "No se proporcionaron IDs válidos" });
      }
      // Realizar la eliminación por lotes
      const result = await Staff_Admin.updateMany(
        { _id: { $in: updateData.id } },
        { status: statusUser },
        { new: true }
      );

      if (result.deletedCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontraron usuarios para eliminar",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Usuarios eliminados correctamente",
        deletedCount: result.deletedCount,
      });
    } catch (err) {
      console.error("Error en la eliminación:", err);
      return res.status(500).send({ message: "Error en la petición" });
    }
  },
  getStaffByOwnerId: async function (req, res) {
    const rawId = mongoose.Types.ObjectId(req.params.id);
    if (!rawId) {
      return res.status(400).send({
        status: "error",
        message: "Missing id parameter",
      });
    }
    let models = { FAMILY: Family, OWNER: Owner };
    let query = [];

    // Build an array with both string and ObjectId (if valid) to match whatever is stored

    try {
      const ownerIds = await models[req.user.role.toUpperCase()]
        .findOne({ _id: rawId })
        .select("propertyDetails.addressId");
      query.push({
        condo_id: {
          $in: ownerIds.propertyDetails.map((prop) => prop.addressId),
        },
      });
      const staffFound = await Staff.find({
        $or: query,
      })
        .populate({
          path: "condo_id",
          select: "_id alias",
        })
        .lean();

      if (staffFound && staffFound.length > 0) {
        return res.status(200).send({
          status: "success",
          message: staffFound,
        });
      } else {
        return res.status(404).send({
          status: "error",
          message: "No staff found",
        });
      }
    } catch (error) {
      console.error("Error getting staff by condo:", error);
      return res.status(500).send({
        status: "error",
        message: "Server error, getting staff by condo",
        error: error,
      });
    }
  },
  getStaffByOwnerAndCondoId: async function (req, res) {
    const rawId = mongoose.Types.ObjectId(req.params.id);
    if (!rawId) {
      return res.status(400).send({
        status: "error",
        message: "Missing id parameter",
      });
    }

    // Build an array with both string and ObjectId (if valid) to match whatever is stored

    try {
      const staffFound = await Staff.find({
        $or: [{ condo_id: { $in: [rawId] } }, { createdBy: { $in: [rawId] } }],
      })
        .populate({
          path: "condo_id",
          model: "Condominium",
          select: "_id alias",
        })
        .lean();

      if (staffFound && staffFound.length > 0) {
        return res.status(200).send({
          status: "success",
          message: staffFound,
        });
      } else {
        console.log("No staff found for condo or owner ID:", rawId);
        return res.status(204).send({
          status: "error",
          message: "No staff found",
        });
      }
    } catch (error) {
      console.error("Error getting staff by condo:", error);
      return res.status(500).send({
        status: "error",
        message: "Server error, getting staff by condo",
        error: error,
      });
    }
  },
  getStaffCard: async function (req, res) {
    let id = mongoose.Types.ObjectId(req.params.id);

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Missing id parameter",
      });
    }
    let models = {
      FAMILY: Family,
      OWNER: Owner,
      ADMIN: Admin,
      STAFF_ADMIN: Staff_Admin,
      STAFF: Staff,
    };
    let query = [];

    try {
      const role = req.user.role.toUpperCase();
      if (role == "OWNER" || role == "FAMILY") {
        const ownerIds = await models[role]
          .findOne({ _id: id })
          .select("propertyDetails.addressId");
        query.push({
          condo_id: {
            $in: ownerIds.propertyDetails.map((prop) => prop.addressId),
          },
        });
      } else if (role == "ADMIN") {
        query.push({
          createdBy: {
            $in: [id],
          },
        });
      } else if (role == "STAFF_ADMIN" || role == "STAFF") {
        const adminIds = await models[role]
          .findOne({ _id: id })
          .select("createdBy");
        query.push({
          createdBy: {
            $in: [adminIds.createdBy],
          },
        });
      }

      const staffFound = await Staff.find({
        $or: query,
      }).lean();

      if (staffFound && staffFound.length > 0) {
        return res.status(200).send({
          status: "success",
          message: staffFound.length,
        });
      } else {
        return res.status(203).send({
          status: "success",
          message: "No staff found",
        });
      }
    } catch (error) {
      console.error("Error getting staff by condo:", error);
      return res.status(500).send({
        status: "error",
        message: "Server error, getting staff by condo",
        error: error,
      });
    }
  },
  getStaffAdmin: async function (req, res) {
    let id = mongoose.Types.ObjectId(req.params.id);

    Staff_Admin.find({ createdBy: id }).exec((err, staffs) => {
      if (err || !staffs) {
        return res.status(501).send({
          status: "error",
          message: "Staffs was not found",
        });
      }

      // Ocultamos la password
      for (const index in staffs) {
        staffs[index].password = undefined;
      }

      return res.status(200).send({
        status: "success",
        message: staffs,
      });
    });
  },
  unlikeImage: function (filePath) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error al eliminar el archivo: ${err.message}`);
      } else {
        console.log("Archivo eliminado correctamente.");
      }
    });
  },
  verifyPasswordStaff: async function (req, res) {
    let params = req.body;

    if (params.currentPassword.length < 8) {
      return res.status(400).send({
        status: "error",
        message: "Password too long",
      });
    }

    try {
      let staffInfo = await Staff.findOne({
        _id: params._id,
      });

      var passChecked = await bcrypt.compare(
        params.currentPassword,
        staffInfo.password
      );

      if (passChecked) {
        return res.status(200).send({
          status: "success",
          message: "Password correct",
        });
      } else {
        return res.status(400).send({
          status: "error",
          message: "Wrong password",
        });
      }
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: error,
      });
    }
  },
};

module.exports = StaffController;
