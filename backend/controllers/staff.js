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
  createStaff: function (req, res) {
    var params = req.body;

    var optionToVerify = new verifyClass();

    try {
      var val_name = !validator.isEmpty(params.name);
      var val_lastname = !validator.isEmpty(params.lastname);
      var val_email = validator.isEmail(params.email);
      var val_phone = optionToVerify.phonesTransformation(params.phone);
    } catch (error) {
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

    if (val_name && val_lastname && val_email && val_phone) {
      Staff.findOne(
        {
          $or: [
            { email: params.email },
            { government_id: params.government_id },
            { phone: params.phone },
          ],
        },
        async (err, staffound) => {
          var errorHandlerArr = errorHandler.errorRegisteringUser(
            err,
            staffound,
            params
          );

          if (errorHandlerArr[0]) {
            return res.status(errorHandlerArr[1]).send({
              status: "error",
              message: errorHandlerArr[2],
            });
          }

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

          newStaff.save(async (err, staffSaved) => {
            if (err) {
              return res.status(501).send({
                status: "error",
                message: "Staff was not create, try again",
                errors: err,
              });
            }

            try {
              await emailVerification.StaffRegistration({
                email: staffSaved.email,
                password: temp_password,
              });

              staffSaved.password = undefined;

              return res.status(200).send({
                status: "success",
                message: staffSaved,
              });
            } catch (error) {
              return res.status(500).send({
                status: "error",
                message: error,
              });
            }
          });
        }
      );
    } else {
      return res.status(400).send({
        status: "bad request",
        message: "Missing required fields",
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
  getStaffByOwnerAndCondoId: async function (req, res) {
    let id = req.params.id;

    try {
      const staffFound = await Staff.find({
        $or: [{ condo_id: id }, { createdBy: id }],
      }).populate({
        path: "condo_id",
        select: "_id alias",
      });

      if (staffFound.length > 0) {
        return res.status(200).send({
          status: "success",
          message: staffFound,
        });
      } else {
        return res.status(200).send({
          status: "error",
          message: "No staff found",
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Server error, getting staff by condo",
        error: error,
      });
    }
  },
  getStaffByAdmin: async function (req, res) {
    let id = mongoose.Types.ObjectId(req.params.id);

    Staff.find({
      createdBy: id,
    })
      .populate("condo_id", "alias")
      .exec((err, staffs) => {
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
