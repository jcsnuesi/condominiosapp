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
const {
  canAccessDashboardIdentifier,
} = require("../service/dashboardScope");

let saltRounds = 10;

var StaffController = {
  createStaff: async function (req, res) {
    var params = req.body;

    var optionToVerify = new verifyClass();
    const requiredFields = [
      "name",
      "lastname",
      "gender",
      "email",
      "phone",
      "position",
      "condo_id",
    ];

    try {
      const hasRequiredFields = requiredFields.every(
        (field) =>
          typeof params[field] === "string" && !validator.isEmpty(params[field])
      );

      if (
        !hasRequiredFields ||
        !validator.isEmail(params.email) ||
        !mongoose.Types.ObjectId.isValid(params.condo_id)
      ) {
        return res.status(400).send({
          status: "bad request",
          message: "All fields required",
        });
      }

      optionToVerify.phonesTransformation(params.phone);
    } catch (error) {
      console.log("Error validating staff data:", error);
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    // Image settings
    if (req.files?.avatar?.path) {
      params.avatar = path.basename(req.files.avatar.path);

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

    const normalizedEmail = params.email.trim().toLowerCase();
    const normalizedPhone = params.phone.trim().toLowerCase();

    const assignedCondominium = await Condominio.findOne({
      _id: params.condo_id,
      organizationId: req.auth.organizationId,
    }).select("_id").lean();
    if (!assignedCondominium) {
      return res.status(403).send({ status: "forbidden", message: "Condominium is outside the organization" });
    }

    const staffFound = await Staff.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (staffFound) {
      return res.status(400).send({
        status: "error",
        message: "Staff with this email or phone already exists",
      });
    }

    try {
      const tempPassword = generatePassword.generate({
        length: 8,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        excludeSimilarCharacters: true,
      });

      const newStaff = new Staff({
        organizationId: req.auth.organizationId,
        avatar: params.avatar,
        name: params.name.trim().toLowerCase(),
        lastname: params.lastname.trim().toLowerCase(),
        gender: params.gender.trim().toLowerCase(),
        email: normalizedEmail,
        password: await bcrypt.hash(tempPassword, saltRounds),
        phone: normalizedPhone,
        position: params.position.trim().toLowerCase(),
        condo_id: params.condo_id,
        createdBy: req.user.sub,
      });
      await newStaff.save();

      let emailSent = true;

      try {
        await emailVerification.StaffRegistration({
          email: newStaff.email,
          password: tempPassword,
        });
      } catch (emailError) {
        emailSent = false;
        console.error(
          "Staff registration email failed:",
          emailError?.code || "SMTP_ERROR",
          emailError?.message || "Unknown mail error"
        );
      }

      newStaff.password = undefined;

      return res.status(200).send({
        status: "success",
        message: newStaff,
        emailSent,
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
      const requiredFields = [
        "name",
        "lastname",
        "gender",
        "email",
        "phone",
        "position",
      ];
      const hasRequiredFields = requiredFields.every(
        (field) => typeof params[field] === "string" && !validator.isEmpty(params[field].trim())
      );

      if (!hasRequiredFields || !validator.isEmail(params.email.trim())) {
        return res.status(400).send({
          status: "bad request",
          message: "Name, lastname, gender, email, phone and position are required",
        });
      }

      const normalizedEmail = params.email.trim().toLowerCase();
      const temporaryPassword = generatePassword.generate({
        length: 8,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        excludeSimilarCharacters: true,
      });
      const AdminFound = await Staff_Admin.findOne({ email: normalizedEmail });

      if (AdminFound) {
        return res.status(409).send({
          status: "error",
          message: "A Staff Admin with this email already exists",
        });
      }

      let staff = new Staff_Admin({
        organizationId: req.auth.organizationId,
        name: params.name.trim(),
        lastname: params.lastname.trim(),
        gender: params.gender.trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(temporaryPassword, saltRounds),
        phone: params.phone.trim(),
        position: params.position.trim(),
        createdBy: req.user.sub,
      });

      let staffSaved;
      try {
        staffSaved = await staff.save();
      } catch (saveError) {
        if (saveError?.code === 11000) {
          return res.status(409).send({
            status: "error",
            message: "A Staff Admin with this email already exists",
          });
        }
        if (saveError?.name === "ValidationError") {
          return res.status(400).send({
            status: "error",
            message: "Staff Admin data is invalid",
          });
        }
        console.error("Error saving staff admin:", saveError);
        return res.status(500).send({
          status: "error",
          message: "Staff was not created",
          errors: saveError,
        });
      }

      await Admin.findOneAndUpdate(
        { _id: req.user.sub },
        { $push: { admins: staffSaved._id } }
      );
      const emailSent = await emailVerification
        .StaffRegistration({ email: staffSaved.email, password: temporaryPassword })
        .then(() => true)
        .catch((emailError) => {
          console.error(
            "Staff Admin registration email failed:",
            emailError?.code || "SMTP_ERROR",
            emailError?.message || "Unknown mail error"
          );
          return false;
        });
      staffSaved.password = undefined;
      return res.status(200).send({
        status: "success",
        message: staffSaved,
        emailSent,
      });
    } catch (error) {
      console.log("Error creating admin:", error);
      return res.status(500).send({
        status: "error",
        message: "Server error",
      });
    }
  },
  updateStaffAdmin: async function (req, res) {
    let staffParams = req.body;

    try {
      let stafFound = await Staff_Admin.findOne({
        _id: staffParams._id,
        organizationId: req.auth.organizationId,
      });

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

      const editable = ["name", "lastname", "gender", "email", "phone", "position", "status", "password"];
      const updateData = Object.fromEntries(Object.entries(staffParams).filter(([key]) => editable.includes(key)));
      await Staff_Admin.findOneAndUpdate(
        { _id: staffParams._id, organizationId: req.auth.organizationId },
        { $set: updateData },
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
      let stafFound = await Staff.findOne({ _id: staffParams._id, organizationId: req.auth.organizationId });

      if (!stafFound) {
        this.unlikeImage(filePath);
        return res.status(404).send({
          status: "error",
          message: "STAFF not found",
        });
      }

      const requesterRole = String(req.user?.role || "").toUpperCase();
      const canManagePassword =
        requesterRole === "ADMIN" || requesterRole === "STAFF_ADMIN";

      if (staffParams.password) {
        if (!canManagePassword) {
          if (!staffParams.currentPassword) {
            return res.status(400).send({
              status: "error",
              message: "Current password is required",
            });
          }

          const passChecked = await bcrypt.compare(
            staffParams.currentPassword,
            stafFound.password
          );

          if (!passChecked) {
            return res.status(400).send({
              status: "error",
              message: "Password incorrect",
            });
          }
        }

        if (staffParams.password.length < 8) {
          return res.status(400).send({
            status: "error",
            message: "Password must be at least 8 characters",
          });
        }

        staffParams.password = await bcrypt.hash(
          staffParams.password,
          saltRounds
        );
      }

      const updateData = {};
      const editableFields = [
        "avatar",
        "name",
        "lastname",
        "gender",
        "email",
        "phone",
        "position",
        "status",
        "condo_id",
        "permissions",
      ];

      for (const key of editableFields) {
        if (staffParams[key] !== undefined) {
          updateData[key] =
            typeof staffParams[key] === "string"
              ? staffParams[key].toLowerCase()
              : staffParams[key];
        }
      }

      if (staffParams.password) {
        updateData.password = staffParams.password;
      }

      const staffUpdated = await Staff.findOneAndUpdate(
        { _id: staffParams._id, organizationId: req.auth.organizationId },
        { $set: updateData },
        { new: true, runValidators: true }
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
      if (!Array.isArray(updateData) || updateData.length === 0) {
        return res
          .status(400)
          .send({ message: "No se proporcionaron IDs válidos" });
      }
      const userIds = updateData.map((user) => user._id);
      // Realizar la eliminación por lotes
      const result = await Staff.updateMany(
        { _id: { $in: userIds }, organizationId: req.auth.organizationId },
        { status: "inactive" },
        { new: true }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontraron usuarios para eliminar",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Usuarios eliminados correctamente",
        updatedCount: result.modifiedCount,
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
        { _id: { $in: updateData.id }, organizationId: req.auth.organizationId },
        { status: statusUser },
        { new: true }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({
          status: "error",
          message: "No se encontraron usuarios para eliminar",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Usuarios eliminados correctamente",
        updatedCount: result.modifiedCount,
      });
    } catch (err) {
      console.error("Error en la eliminación:", err);
      return res.status(500).send({ message: "Error en la petición" });
    }
  },
  deletePermanent: async function (req, res) {
    const staffId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).send({
        status: "error",
        message: "Valid staff id is required",
      });
    }

    try {
      const requesterRole = String(req.user?.role || "").toUpperCase();
      let adminId = req.user.sub;

      if (requesterRole === "STAFF_ADMIN") {
        const staffAdmin = await Staff_Admin.findById(req.user.sub)
          .select("createdBy")
          .lean();

        if (!staffAdmin?.createdBy) {
          return res.status(403).send({
            status: "forbidden",
            message: "You are not authorized to delete this staff member",
          });
        }

        adminId = staffAdmin.createdBy;
      }

      const deletedStaff = await Staff.findOne({ _id: staffId, organizationId: req.auth.organizationId });

      if (!deletedStaff) {
        return res.status(404).send({
          status: "error",
          message: "Staff member was not found",
        });
      }

      if (!deletedStaff.createdBy?.equals(adminId)) {
        return res.status(403).send({
          status: "forbidden",
          message: "You are not authorized to delete this staff member",
        });
      }

      await deletedStaff.deleteOne();

      const sharedAvatars = new Set([
        "noimage.jpeg",
        "noimage2.jpeg",
        "default-avatar1.png",
      ]);
      const avatarName = path.basename(deletedStaff.avatar || "");

      if (avatarName && !sharedAvatars.has(avatarName)) {
        const avatarPath = path.resolve(
          __dirname,
          "../uploads/staff",
          avatarName
        );

        try {
          await fs.promises.unlink(avatarPath);
        } catch (fileError) {
          if (fileError.code !== "ENOENT") {
            console.error("Error deleting staff avatar:", fileError.message);
          }
        }
      }

      return res.status(200).send({
        status: "success",
        message: "Staff member permanently deleted",
        deletedId: deletedStaff._id,
        deletedCount: 1,
      });
    } catch (error) {
      console.error("Error permanently deleting staff:", error);
      return res.status(500).send({
        status: "error",
        message: "Staff member could not be permanently deleted",
      });
    }
  },
  getStaffByOwnerId: async function (req, res) {
    const rawId = new mongoose.Types.ObjectId(req.params.id);
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
        .select("-password -government_id")
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
    const rawId = new mongoose.Types.ObjectId(req.params.id);
    if (!rawId) {
      return res.status(400).send({
        status: "error",
        message: "Missing id parameter",
      });
    }

    // Build an array with both string and ObjectId (if valid) to match whatever is stored

    try {
      const staffFound = await Staff.find({
        organizationId: req.auth.organizationId,
        $or: [{ condo_id: { $in: [rawId] } }, { createdBy: { $in: [rawId] } }],
      })
        .select("-password -government_id")
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        status: "error",
        message: "Valid id parameter is required",
      });
    }

    if (!canAccessDashboardIdentifier(req.user, req.params.id)) {
      return res.status(403).send({
        status: "forbidden",
        message: "You are not authorized to access this staff count",
      });
    }

    const id = new mongoose.Types.ObjectId(req.params.id);
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

      if (query.length === 0) {
        return res.status(403).send({
          status: "forbidden",
          message: "You are not authorized to access this staff count",
        });
      }

      const staffCount = await Staff.countDocuments({
        $or: query,
      });

      return res.status(200).send({
        status: "success",
        message: Number(staffCount) || 0,
      });
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
    try {
      const staffs = await Staff_Admin.find({ organizationId: req.auth.organizationId });

      if (!staffs) {
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
    } catch (err) {
      return res.status(501).send({
        status: "error",
        message: "Staffs was not found",
      });
    }
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
