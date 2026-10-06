"use strict";
const { remainingBalanceExpression } = require("../service/invoiceBalance");

let bcrypt = require("bcrypt");
let saltRounds = 10;
let jwtoken = require("../service/jwt");
let checkExtensions = require("../service/extensions");
let errorHandler = require("../error/errorHandler");
let deactivatedOwner = require("../service/persistencia");
let verifyDataParam = require("../service/verifyParamData");
const Condominio = require("../models/condominio");
const Owner = require("../models/owners");
const Family = require("../models/family");
const Reserve = require("../models/reserves");
const Invoice = require("../models/invoice");
const occupant = require("../models/occupant");
const verifying = new verifyDataParam();
let validator = require("validator");
let emailVerification = require("../service/generateVerification");
const fs = require("fs");
const paths = require("path");
const wsConfirmationMessage = require("./whatsappController");
var mongoose = require("mongoose");
const assert = require("assert");
const {
  setOwnerCondominiumStatus,
} = require("../service/residentPropertyAccess");
const {
  canAccessCondominium,
  hasPermission,
} = require("../service/authorization");

const generatePassword = require("generate-password");
// Generar una contraseña con opciones específicas
const passwordOptions = {
  length: 8, // Longitud de la contraseña
  numbers: true, // Incluir números
  symbols: true, // Incluir símbolos
  uppercase: true, // Incluir letras mayúsculas
  lowercase: true, // Incluir letras minúsculas
  excludeSimilarCharacters: true, // Excluir caracteres similares
};

function canManageOwnerCondominiumUnit(req, ownerId, condominiumId) {
  const role = String(req.auth?.role || "").toUpperCase();
  if (role === "OWNER") {
    return (
      String(req.auth?.account?._id || req.user?.sub) === String(ownerId) &&
      canAccessCondominium(req.auth, condominiumId)
    );
  }
  if (!["ADMIN", "STAFF_ADMIN", "STAFF"].includes(role)) return false;
  if (
    !req.auth?.organizationId ||
    !canAccessCondominium(req.auth, condominiumId)
  ) {
    return false;
  }
  return (
    req.auth.isOwnerAdmin ||
    hasPermission(req.auth, "owners.create") ||
    hasPermission(req.auth, "owners.update")
  );
}

var ownerAndSubController = {
  createSingleOwner: async function (req, res) {
    const params = req.body || {};
    let pathName = null;
    let normalizedPhone;
    const organizationId = req.auth?.organizationId;
    const creator = req.user || {};

    try {
      params.email = params.email.trim().toLowerCase();
      params.id_number = params.id_number?.trim();
      params.apartmentsUnit = params.apartmentsUnit.trim();
      normalizedPhone = verifying.phonesTransformation(params.phone);
    } catch (error) {
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    // Si el usuario envia un archivo de imagen, se guarda en el servidor y se le asigna el nombre a la propiedad avatar
    if (req.files?.avatar) {
      const { path } = req.files.avatar;
      pathName = paths.basename(path);
      params.avatar = pathName;
      //verificar la extension de archivo enviado sea tipo imagen
      const imgFormatAccepted = checkExtensions.confirmExtension(req);
      if (imgFormatAccepted === false) {
        return res.status(400).send({
          status: "bad request",
          message: "Files allows '.jpg', '.jpeg', '.gif', '.png'",
        });
      }
    }

    if (
      !organizationId ||
      !validator.isEmail(params.email) ||
      !params.name?.trim() ||
      !params.lastname?.trim() ||
      !params.gender?.trim() ||
      !normalizedPhone ||
      !params.addressId ||
      !params.apartmentsUnit
    ) {
      return res.status(400).send({
        status: "error",
        message: "Fill out all fields",
      });
    }

    try {
      const duplicateFilters = [{ email: params.email }];
      if (params.id_number) {
        duplicateFilters.push({ id_number: params.id_number });
      }

      const userDuplicated = await Owner.findOne({ $or: duplicateFilters });

      if (userDuplicated) {
        if (String(userDuplicated.organizationId) !== String(organizationId)) {
          return res.status(409).send({
            status: "error",
            message: "The owner identity is already registered",
          });
        }

        if (
          !params.existingOwnerId ||
          String(params.existingOwnerId) !== String(userDuplicated._id)
        ) {
          return res.status(409).send({
            status: "error",
            code: "OWNER_EMAIL_EXISTS",
            message:
              "An owner with this email already exists. Use Existing user to assign another unit.",
          });
        }

        const propertyFound = userDuplicated.propertyDetails.some(
          (property) =>
            String(property.addressId) === String(params.addressId) &&
            property.condominium_unit === params.apartmentsUnit
        );

        if (propertyFound) {
          return res.status(400).send({
            status: "error",
            message: "This unit is already assigned to another owner",
          });
        }
      }

      const creatorRole = String(creator.role || "").toUpperCase();
      const createdBy =
        creatorRole === "ADMIN"
          ? creator.sub
          : creator.createdBy || creator.sub;
      const createdByModel =
        creatorRole === "STAFF_ADMIN" && !creator.createdBy
          ? "Staff_Admin"
          : "Admin";
      const isRenting = ["yes", "true", "1"].includes(
        String(params.isRenting || "").toLowerCase()
      );
      const parkingsQty = Number(params.parkingsQty);

      if (
        !Number.isInteger(parkingsQty) ||
        parkingsQty < 0 ||
        parkingsQty > 5
      ) {
        return res.status(400).send({
          status: "error",
          message: "Parking quantity must be an integer between 0 and 5",
        });
      }

      // Reserva la unidad de forma condicional. Dos solicitudes concurrentes no
      // pueden consumir la misma unidad porque solo una puede hacer este $pull.
      const reservedCondominium = await Condominio.findOneAndUpdate(
        {
          _id: params.addressId,
          organizationId,
          status: "active",
          availableUnits: params.apartmentsUnit,
        },
        { $pull: { availableUnits: params.apartmentsUnit } },
        { new: true }
      );

      if (!reservedCondominium) {
        return res.status(409).send({
          status: "error",
          message: "The selected unit is not available in this condominium",
        });
      }

      const normalizedUnit = String(params.apartmentsUnit)
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
      const existingUnit = (reservedCondominium.units || []).find(
        (unit) =>
          (unit.normalizedLabel || String(unit.label || "").toLowerCase()) ===
          normalizedUnit
      );
      const unitId = existingUnit?._id || new mongoose.Types.ObjectId();
      const releaseUnit = () =>
        Condominio.updateOne(
          { _id: reservedCondominium._id, organizationId },
          {
            $addToSet: { availableUnits: params.apartmentsUnit },
            $set: { "units.$[unit].availability": "AVAILABLE" },
          },
          { arrayFilters: [{ "unit._id": unitId }] }
        );

      if (existingUnit) {
        if (
          existingUnit.status !== "active" ||
          existingUnit.availability !== "AVAILABLE"
        ) {
          return res.status(409).send({
            status: "error",
            code: "CONDOMINIUM_UNIT_NOT_AVAILABLE",
            message: "The selected unit is not available in this condominium",
          });
        }
        const claimed = await Condominio.updateOne(
          {
            _id: reservedCondominium._id,
            organizationId,
            units: {
              $elemMatch: {
                _id: unitId,
                status: "active",
                availability: "AVAILABLE",
              },
            },
          },
          { $set: { "units.$[unit].availability": "ASSIGNED" } },
          { arrayFilters: [{ "unit._id": unitId }] }
        );
        if (claimed.modifiedCount !== 1) {
          return res.status(409).send({
            status: "error",
            code: "CONDOMINIUM_UNIT_NOT_AVAILABLE",
            message: "The selected unit is no longer available",
          });
        }
      } else {
        const inserted = await Condominio.updateOne(
          {
            _id: reservedCondominium._id,
            organizationId,
            units: {
              $not: { $elemMatch: { normalizedLabel: normalizedUnit } },
            },
          },
          {
            $push: {
              units: {
                _id: unitId,
                label: params.apartmentsUnit,
                normalizedLabel: normalizedUnit,
                status: "active",
                availability: "ASSIGNED",
              },
            },
          },
          { runValidators: true }
        );
        if (inserted.modifiedCount !== 1) {
          return res.status(409).send({
            status: "error",
            code: "CONDOMINIUM_UNIT_RECONCILIATION_REQUIRED",
            message: "The selected unit requires administrator reconciliation",
          });
        }
      }

      const propertyDetails = {
        contextType: "CONDOMINIUM_UNIT",
        addressId: params.addressId,
        unitId,
        condominium_unit: params.apartmentsUnit,
        parkingsQty,
        isRenting,
      };

      if (userDuplicated) {
        try {
          const updatedOwner = await Owner.findOneAndUpdate(
            { _id: userDuplicated._id, organizationId },
            { $push: { propertyDetails } },
            { new: true, runValidators: true }
          );

          if (!updatedOwner) throw new Error("Owner not found in organization");

          const condominiumUpdated = await Condominio.findOneAndUpdate(
            { _id: reservedCondominium._id, organizationId },
            {
              $addToSet: {
                units_ownerId: {
                  ownerId: userDuplicated._id,
                  status: "active",
                },
              },
            },
            { new: true, runValidators: true }
          );

          if (!condominiumUpdated) {
            await Owner.updateOne(
              { _id: userDuplicated._id, organizationId },
              {
                $pull: {
                  propertyDetails: {
                    addressId: params.addressId,
                    condominium_unit: params.apartmentsUnit,
                  },
                },
              }
            );
            throw new Error("Condominium assignment failed");
          }

          return res.status(200).send({
            status: "success",
            message: "Unit assigned successfully",
          });
        } catch (error) {
          await Owner.updateOne(
            { _id: userDuplicated._id, organizationId },
            {
              $pull: {
                propertyDetails: {
                  addressId: params.addressId,
                  condominium_unit: params.apartmentsUnit,
                },
              },
            }
          );
          await releaseUnit();
          throw error;
        }
      }

      const temporaryPassword = generatePassword.generate(passwordOptions);

      const user = new Owner({
        organizationId,
        createdBy,
        createdByModel,
        avatar: params.avatar,
        name: params.name?.trim().toLowerCase(),
        lastname: params.lastname?.trim().toLowerCase(),
        gender: params.gender?.trim().toLowerCase(),
        dob: params.dob,
        phone: normalizedPhone,
        phone2: params.phone2?.trim(),
        email: params.email,
        ...(params.id_number ? { id_number: params.id_number } : {}),
        propertyDetails: [propertyDetails],
        password: await bcrypt.hash(temporaryPassword, saltRounds),
      });

      try {
        await user.save();

        const condominioUpdated = await Condominio.findOneAndUpdate(
          { _id: reservedCondominium._id, organizationId },
          {
            $addToSet: {
              units_ownerId: { ownerId: user._id, status: "active" },
            },
          },
          { new: true, runValidators: true }
        );

        if (!condominioUpdated) {
          await Owner.deleteOne({ _id: user._id, organizationId });
          throw new Error("Condominium assignment failed");
        }

        user.passwordTemp = temporaryPassword;
        user.condominioName = condominioUpdated.alias;
        const emailSent = await emailVerification.verifyRegistration(user).then(() => true).catch((error) => {
          console.log("Owner registration email failed", error.message);
          return false;
        });
        void Promise.resolve()
          .then(() => wsConfirmationMessage.sendWhatsappMessage(user))
          .catch((error) => {
            console.log("Owner registration WhatsApp failed", error.message);
          });

        return res.status(201).send({
          status: "success",
          message: "User created successfully",
          emailSent,
          user: {
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
          },
        });
      } catch (error) {
        if (!user.isNew) {
          await Owner.deleteOne({ _id: user._id, organizationId });
        }
        await releaseUnit();
        if (error?.code === 11000) {
          return res.status(409).send({
            status: "error",
            message: "The owner identity is already registered",
          });
        }
        throw error;
      }
    } catch (error) {
      console.log("Error creating owner", error);
      return res.status(500).send({
        status: "error",
        message: "Owner could not be created",
      });
    }
  },

  getOwnerPaymentsStats: async function (req, res) {
    let identifier = req.params.createdBy;

    if (Boolean(identifier == undefined)) {
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    try {
      const owners = await Owner.find(
        { createdBy: identifier },
        { _id: 1 }
      ).lean();
      const ownerIds = owners.map((o) => o._id);

      const invoicesByMonth = await Invoice.aggregate([
        {
          $match: {
            ownerId: { $in: ownerIds },
            paymentStatus: { $in: ["pending", "completed"] },
          },
        },
        {
          $addFields: {
            month: {
              $dateToString: {
                format: "%B",
                date: "$createdAt",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              month: "$month",
              paymentStatus: "$paymentStatus",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.month",
            totalInvoices: { $sum: "$count" },
            statuses: {
              $push: {
                status: "$_id.paymentStatus",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            totalInvoices: 1,
            statuses: 1,
          },
        },
        {
          $sort: { month: 1 },
        },
      ]);

      const monthlyInvoiceStats = invoicesByMonth.map((m) => {
        const completed =
          m.statuses.find((s) => s.status === "completed")?.count || 0;
        const pending =
          m.statuses.find((s) => s.status === "pending")?.count || 0;

        return {
          month: m.month,
          totalInvoices: m.totalInvoices,
          completed: {
            count: completed,
            percentage: Number(
              ((completed / m.totalInvoices) * 100).toFixed(2)
            ),
          },
          pending: {
            count: pending,
            percentage: Number(((pending / m.totalInvoices) * 100).toFixed(2)),
          },
        };
      });

      return res.status(200).send({
        status: "success",
        message: monthlyInvoiceStats,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },
  getOwnerByIdentifier: async function (req, res) {
    const identifier = req.params.keyword?.trim();

    if (!identifier) {
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    try {
      const owner = await Owner.findOne({
        organizationId: req.auth.organizationId,
        $or: [{ email: identifier }, { id_number: identifier }],
      })
        .select(
          "name lastname gender dob email phone phone2 id_number avatar status"
        )
        .lean();

      if (!owner) {
        return res.status(404).send({
          status: "error",
          message: "Owner not found",
        });
      }
      return res.status(200).send({
        status: "success",
        message: owner,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },

  getFamily: async function (req, res) {
    try {
      const familyFound = await Family.find({
        ownerId: "66f84833006341d7843b4127",
      }).populate(
        "addressId.condominioId",
        "alias type phone street_1 street_2 sector_name city province zipcode country  status createdAt"
      );

      if (!familyFound) {
        return res.status(404).send({
          status: "error",
          message: "Family not found",
        });
      }

      return res.status(200).send({
        status: "success",
        message: familyFound,
      });
    } catch (err) {
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },
  getFamilyDetailsById: async function (req, res) {
    let id_member = req.params.id;

    if (Boolean(id_member == undefined)) {
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    const familyMember = await Family.findOne({ _id: id_member }).populate(
      "addressId.condominioId",
      "alias type phone street_1 street_2 sector_name city province zipcode country socialAreas status"
    );

    if (!familyMember) {
      return res.status(404).send({
        status: "error",
        message: "Family member not found",
      });
    }

    return res.status(200).send({
      status: "success",
      message: familyMember,
    });
  },
  addOwnerUnit: async function (req, res) {
    const params = req.body || {};
    const unitLabel = String(params.unit || "").trim();
    if (!params.ownerId || !params.addressId || !unitLabel) {
      return res.status(400).send({
        status: "error",
        code: "OWNER_UNIT_REQUIRED",
        message: "Owner, condominium and unit are required",
      });
    }
    if (!canManageOwnerCondominiumUnit(req, params.ownerId, params.addressId)) {
      return res.status(403).send({
        status: "forbidden",
        code: "OWNER_UNIT_ASSIGNMENT_DENIED",
        message: "Not authorized to assign this condominium unit",
      });
    }
    const normalizedLabel = unitLabel
      .normalize("NFKC")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    try {
      const condominium = await Condominio.findOne({
        _id: params.addressId,
        organizationId: req.auth?.organizationId,
        status: "active",
        availableUnits: unitLabel,
      })
        .select("organizationId availableUnits units")
        .lean();
      if (!condominium) {
        return res.status(409).send({
          status: "error",
          code: "CONDOMINIUM_UNIT_NOT_AVAILABLE",
          message: "The selected unit is not available in this condominium",
        });
      }

      const existingUnit = (condominium.units || []).find(
        (unit) => unit.normalizedLabel === normalizedLabel
      );
      if (
        existingUnit &&
        (existingUnit.status !== "active" ||
          existingUnit.availability !== "AVAILABLE")
      ) {
        return res.status(409).send({
          status: "error",
          code: "CONDOMINIUM_UNIT_RECONCILIATION_REQUIRED",
          message: "The selected unit requires administrator reconciliation",
        });
      }
      const unitId = existingUnit?._id || new mongoose.Types.ObjectId();
      const propertyDetails = {
        contextType: "CONDOMINIUM_UNIT",
        addressId: condominium._id,
        unitId,
        condominium_unit: unitLabel,
        parkingsQty: Number(params.parkingsQty || 0),
        isRenting: ["yes", "true", "1"].includes(
          String(params.isRenting || "").toLowerCase()
        ),
      };
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const condominiumUpdate = existingUnit
            ? await Condominio.updateOne(
                {
                  _id: condominium._id,
                  organizationId: condominium.organizationId,
                  availableUnits: unitLabel,
                  units: {
                    $elemMatch: {
                      _id: unitId,
                      status: "active",
                      availability: "AVAILABLE",
                    },
                  },
                },
                {
                  $pull: { availableUnits: unitLabel },
                  $set: { "units.$[unit].availability": "ASSIGNED" },
                  $addToSet: {
                    units_ownerId: {
                      ownerId: params.ownerId,
                      status: "active",
                    },
                  },
                },
                {
                  session,
                  arrayFilters: [{ "unit._id": unitId }],
                  runValidators: true,
                }
              )
            : await Condominio.updateOne(
                {
                  _id: condominium._id,
                  organizationId: condominium.organizationId,
                  availableUnits: unitLabel,
                  units: {
                    $not: { $elemMatch: { normalizedLabel } },
                  },
                },
                {
                  $pull: { availableUnits: unitLabel },
                  $push: {
                    units: {
                      _id: unitId,
                      label: unitLabel,
                      normalizedLabel,
                      status: "active",
                      availability: "ASSIGNED",
                    },
                  },
                  $addToSet: {
                    units_ownerId: {
                      ownerId: params.ownerId,
                      status: "active",
                    },
                  },
                },
                { session, runValidators: true }
              );
          if (condominiumUpdate.modifiedCount !== 1) {
            const error = new Error("Unit is no longer available");
            error.code = "CONDOMINIUM_UNIT_NOT_AVAILABLE";
            throw error;
          }
          const ownerUpdate = await Owner.updateOne(
            {
              _id: params.ownerId,
              status: "active",
              ...(req.auth?.organizationId
                ? { organizationId: req.auth.organizationId }
                : {}),
              propertyDetails: {
                $not: {
                  $elemMatch: {
                    addressId: condominium._id,
                    unitId,
                    status_property: { $ne: "inactive" },
                  },
                },
              },
            },
            { $push: { propertyDetails } },
            { session, runValidators: true }
          );
          if (ownerUpdate.modifiedCount !== 1) {
            const error = new Error("Owner is unavailable for this assignment");
            error.code = "OWNER_UNIT_ASSIGNMENT_DENIED";
            throw error;
          }
        });
      } finally {
        await session.endSession();
      }

      if (res == null) {
        return {
          status: "success",
          message: "Unit assigned successfully",
          code: 200,
        };
      }
      return res
        .status(200)
        .send({ status: "success", message: "Unit assigned successfully" });
    } catch (error) {
      if (res == null) {
        return {
          status: "error",
          message: "Unit could not be assigned",
          code: 500,
        };
      }
      return res
        .status(error.code === "CONDOMINIUM_UNIT_NOT_AVAILABLE" ? 409 : 500)
        .send({
          status: "error",
          code: error.code || "OWNER_UNIT_ASSIGNMENT_FAILED",
          message:
            error.code === "OWNER_UNIT_ASSIGNMENT_DENIED"
              ? "Owner is unavailable for this assignment"
              : "Unit could not be assigned",
        });
    }
  },
  update: function (req, res) {
    const allow = ["owner", "family"];

    if (!allow.includes(req.user.role.toLowerCase())) {
      return res.status(403).send({
        status: "forbidden",
        message: "Not authorized",
      });
    }

    // Si el usuario envia un archivo de imagen, se guarda en el servidor y se le asigna el nombre a la propiedad avatar

    var params = req.body;

    if (Boolean(req.files.avatar)) {
      let { path, ...res } = req.files.avatar;
      params.avatar = path.split("\\")[2];
    }

    //verificar la extension de archivo enviado sea tipo imagen
    var imgFormatAccepted = checkExtensions.confirmExtension(req);

    if (imgFormatAccepted == false) {
      return res.status(400).send({
        status: "bad request",
        message: "Files allows '.jpg', '.jpeg', '.gif', '.png'",
      });
    }

    const user = { owner: Owner, family: Family };
    user[params.role.toLowerCase()].findOne(
      { _id: params._id },
      async (err, userFound) => {
        if (err || !userFound) {
          await fs.unlink(`./uploads/owner/${params.avatar}`);
        }

        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Server error, try again",
          });
        }

        if (!userFound) {
          return res.status(404).send({
            status: "error",
            message: "User was not found",
          });
        }

        delete params.propertyDetails;

        for (const key in params) {
          if (params.password) {
            userFound.password = await bcrypt.hash(params.password, saltRounds);
            userFound.first_password_changed = true;
          } else {
            userFound[key] = params[key].toLowerCase();
          }
        }

        try {
          await user[params.role.toLowerCase()].findOneAndUpdate(
            { _id: params._id },
            userFound,
            { new: true }
          );
          delete userFound.password;
        } catch (error) {
          return res.status(500).send({
            status: "error",
            message: "Missing params to update this user",
            error: error,
          });
        }

        return res.status(200).send({
          status: "success",
          message: "User updated successfully",
          user_updated: userFound,
        });
      }
    );
  },
  updateProperties: async function (req, res) {
    let params = req.body;

    try {
      var val_ownerId = !validator.isEmpty(params.ownerId);
      var val_propertyId = !validator.isEmpty(params.propertyId);
      var val_unit = !validator.isEmpty(params.unit);
      var val_newUnit = !validator.isEmpty(params.newUnit.trim());
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }

    if (!(val_ownerId && val_propertyId && val_unit && val_newUnit)) {
      return res.status(400).send({
        status: "error",
        code: "OWNER_UNIT_UPDATE_INVALID",
        message: "Owner, condominium, current unit and new unit are required",
      });
    }
    if (
      !canManageOwnerCondominiumUnit(req, params.ownerId, params.propertyId)
    ) {
      return res.status(403).send({
        status: "forbidden",
        code: "OWNER_UNIT_UPDATE_DENIED",
        message: "Not authorized to change this condominium unit",
      });
    }

    const normalizeUnit = (value) =>
      String(value || "")
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
    const oldLabel = String(params.unit).trim();
    const newLabel = String(params.newUnit).trim();
    const oldNormalized = normalizeUnit(oldLabel);
    const newNormalized = normalizeUnit(newLabel);
    if (!oldNormalized || !newNormalized) {
      return res.status(422).send({
        status: "error",
        code: "CONDOMINIUM_UNIT_LABEL_INVALID",
        message: "Unit label is invalid",
      });
    }

    const session = await mongoose.startSession();
    try {
      let ownerResult;
      await session.withTransaction(async () => {
        const condominium = await Condominio.findOne({
          _id: params.propertyId,
          organizationId: req.auth.organizationId,
          status: "active",
        })
          .session(session)
          .lean();
        if (!condominium) {
          const error = new Error("Condominium not found");
          error.statusCode = 404;
          throw error;
        }
        const oldUnit = (condominium.units || []).find(
          (unit) => unit.normalizedLabel === oldNormalized
        );
        if (!oldUnit) {
          const error = new Error("Current unit needs catalog reconciliation");
          error.code = "CONDOMINIUM_UNIT_RECONCILIATION_REQUIRED";
          error.statusCode = 409;
          throw error;
        }
        const owner = await Owner.findOne({
          _id: params.ownerId,
          organizationId: req.auth.organizationId,
          status: "active",
          propertyDetails: {
            $elemMatch: {
              addressId: condominium._id,
              unitId: oldUnit._id,
              status_property: { $ne: "inactive" },
            },
          },
        })
          .session(session)
          .lean();
        if (!owner) {
          const error = new Error("Owner is not actively linked to this unit");
          error.statusCode = 404;
          throw error;
        }

        if (oldNormalized === newNormalized) {
          ownerResult = await Owner.updateOne(
            { _id: owner._id, organizationId: req.auth.organizationId },
            {
              $set: {
                "propertyDetails.$[association].condominium_unit": newLabel,
                "propertyDetails.$[association].parkingsQty":
                  params.parkingsQty,
              },
            },
            {
              session,
              arrayFilters: [
                {
                  "association.addressId": condominium._id,
                  "association.unitId": oldUnit._id,
                },
              ],
              runValidators: true,
            }
          );
          return;
        }

        const targetUnit = (condominium.units || []).find(
          (unit) => unit.normalizedLabel === newNormalized
        );
        if (
          !targetUnit ||
          targetUnit.status !== "active" ||
          targetUnit.availability !== "AVAILABLE" ||
          !(condominium.availableUnits || []).some(
            (unit) => normalizeUnit(unit) === newNormalized
          )
        ) {
          const error = new Error(
            "New unit is not available or needs catalog reconciliation"
          );
          error.code = "CONDOMINIUM_UNIT_NOT_AVAILABLE";
          error.statusCode = 409;
          throw error;
        }

        const claim = await Condominio.updateOne(
          {
            _id: condominium._id,
            organizationId: condominium.organizationId,
            availableUnits: targetUnit.label,
            units: {
              $elemMatch: {
                _id: targetUnit._id,
                availability: "AVAILABLE",
                status: "active",
              },
            },
          },
          {
            $pull: { availableUnits: targetUnit.label },
            $set: { "units.$[target].availability": "ASSIGNED" },
          },
          {
            session,
            arrayFilters: [{ "target._id": targetUnit._id }],
            runValidators: true,
          }
        );
        if (claim.modifiedCount !== 1) {
          const error = new Error("New unit is no longer available");
          error.code = "CONDOMINIUM_UNIT_NOT_AVAILABLE";
          error.statusCode = 409;
          throw error;
        }

        const release = await Condominio.updateOne(
          {
            _id: condominium._id,
            organizationId: condominium.organizationId,
            "units._id": oldUnit._id,
          },
          {
            $addToSet: { availableUnits: oldUnit.label },
            $set: { "units.$[old].availability": "AVAILABLE" },
          },
          { session, arrayFilters: [{ "old._id": oldUnit._id }] }
        );
        if (release.modifiedCount !== 1) {
          throw new Error("Previous unit could not be released");
        }

        ownerResult = await Owner.updateOne(
          { _id: owner._id, organizationId: req.auth.organizationId },
          {
            $set: {
              "propertyDetails.$[association].unitId": targetUnit._id,
              "propertyDetails.$[association].condominium_unit": newLabel,
              "propertyDetails.$[association].parkingsQty": params.parkingsQty,
            },
          },
          {
            session,
            arrayFilters: [
              {
                "association.addressId": condominium._id,
                "association.unitId": oldUnit._id,
              },
            ],
            runValidators: true,
          }
        );
      });
      if (ownerResult?.modifiedCount !== 1) {
        return res.status(409).send({
          status: "error",
          code: "OWNER_UNIT_UPDATE_CONFLICT",
          message: "Owner unit assignment changed; refresh and try again",
        });
      }
      return res.status(200).send({
        status: "success",
        message: "Unit updated successfully",
      });
    } catch (error) {
      return res.status(error.statusCode || 500).send({
        status: "error",
        code: error.code || "OWNER_UNIT_UPDATE_FAILED",
        message: error.statusCode ? error.message : "Unit could not be updated",
      });
    } finally {
      await session.endSession();
    }
  },
  deleteOwnerUnit: async function (req, res) {
    let params = req.body;

    try {
      var val_ownerId = !validator.isEmpty(params.ownerId);
      var val_propertyId = !validator.isEmpty(params.propertyId);
      var val_unit = !validator.isEmpty(params.unit);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Missing params to delete this user",
      });
    }

    if (!(val_ownerId && val_propertyId && val_unit)) {
      return res.status(400).send({
        status: "error",
        code: "OWNER_UNIT_DELETE_INVALID",
        message: "Owner, condominium and unit are required",
      });
    }
    if (
      !canManageOwnerCondominiumUnit(req, params.ownerId, params.propertyId)
    ) {
      return res.status(403).send({
        status: "forbidden",
        code: "OWNER_UNIT_DELETE_DENIED",
        message: "Not authorized to remove this condominium unit",
      });
    }

    const normalizeUnit = (value) =>
      String(value || "")
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const condominium = await Condominio.findOne({
          _id: params.propertyId,
          organizationId: req.auth.organizationId,
          status: "active",
        })
          .session(session)
          .lean();
        const unit = condominium?.units?.find(
          (entry) => entry.normalizedLabel === normalizeUnit(params.unit)
        );
        if (!condominium || !unit) {
          const error = new Error("Unit needs catalog reconciliation");
          error.code = "CONDOMINIUM_UNIT_RECONCILIATION_REQUIRED";
          error.statusCode = 409;
          throw error;
        }

        const hasOtherActiveUnit = await Owner.exists({
          _id: params.ownerId,
          organizationId: req.auth.organizationId,
          status: "active",
          propertyDetails: {
            $elemMatch: {
              addressId: condominium._id,
              unitId: { $ne: unit._id },
              status_property: { $ne: "inactive" },
            },
          },
        }).session(session);

        const ownerUpdate = await Owner.updateOne(
          {
            _id: params.ownerId,
            organizationId: req.auth.organizationId,
            status: "active",
            propertyDetails: {
              $elemMatch: {
                addressId: condominium._id,
                unitId: unit._id,
                status_property: { $ne: "inactive" },
              },
            },
          },
          {
            $set: {
              "propertyDetails.$[association].status_property": "inactive",
            },
          },
          {
            session,
            arrayFilters: [
              {
                "association.addressId": condominium._id,
                "association.unitId": unit._id,
                "association.status_property": { $ne: "inactive" },
              },
            ],
          }
        );
        if (ownerUpdate.modifiedCount !== 1) {
          const error = new Error("Active owner-unit relation not found");
          error.statusCode = 404;
          throw error;
        }

        const condominiumUpdate = await Condominio.updateOne(
          { _id: condominium._id, organizationId: condominium.organizationId },
          {
            $addToSet: { availableUnits: unit.label },
            $set: {
              "units.$[unit].availability": "AVAILABLE",
              ...(!hasOtherActiveUnit
                ? { "units_ownerId.$[owner].status": "inactive" }
                : {}),
            },
          },
          {
            session,
            arrayFilters: [
              { "unit._id": unit._id },
              ...(!hasOtherActiveUnit
                ? [{ "owner.ownerId": params.ownerId }]
                : []),
            ],
            runValidators: true,
          }
        );
        if (condominiumUpdate.matchedCount !== 1) {
          throw new Error("Condominium unit could not be released");
        }
      });

      return res.status(200).send({
        status: "success",
        message: "Unit unlinked successfully",
      });
    } catch (error) {
      return res.status(error.statusCode || 500).send({
        status: "error",
        code: error.code || "OWNER_UNIT_DELETE_FAILED",
        message: error.statusCode
          ? error.message
          : "Unit could not be unlinked",
      });
    } finally {
      await session.endSession();
    }
  },
  deactivatedUser: async function (req, res) {
    var params = req.body;
    const set_status = params.status;

    // // var user = { owner: Owner, family: Family };
    // const updated = await Owner.findOne({
    //   _id: new mongoose.Types.ObjectId(params._id),
    //   "propertyDetails.addressId": new mongoose.Types.ObjectId(params.condoId),
    // });
    // console.log("updated", updated.propertyDetails[0].status);
    // return;

    try {
      if (params.ishome) {
        await setOwnerCondominiumStatus({
          condominiumId: params.condoId,
          ownerId: params._id,
          organizationId: req.auth.organizationId,
          status: params.status,
        });

        return res.status(200).send({
          status: "success",
          message: "User property status changed successfully",
        });
      } else {
        await Owner.findOneAndUpdate(
          { _id: params._id },
          { status: set_status },
          { new: true }
        );

        return res.status(200).send({
          status: "success",
          message: "User property status changed successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).send({
        status: "error",
        message: error.message || "Server error, try again",
      });
    }
  },
  getAvatar: function (req, res) {
    var file = req.params.avatar;
    var path_file = "./uploads/owners/" + file;

    if (fs.existsSync(path_file)) {
      return res.sendFile(paths.resolve(path_file));
    } else {
      return res.status(404).send({
        status: "error",
        message: "Image does not exits",
      });
    }
  },

  getCondominiumByOwnerId: async function (req, res) {
    let ownerId = req.params.ownerId;

    try {
      const ownerCondo = await Owner.findOne({
        _id: ownerId,
        organizationId: req.auth.organizationId,
      }).populate({
        path: "propertyDetails.addressId",
        model: "Condominium",
        select:
          "avatar availableUnits alias phone street_1 street_2 sector_name city province zipcode country socialAreas mPayment status mPayment createdAt",
      });

      const ownerResponse = ownerCondo?.toObject
        ? ownerCondo.toObject()
        : ownerCondo;
      if (
        ownerResponse &&
        ["OWNER", "FAMILY"].includes(String(req.auth?.role || "").toUpperCase())
      ) {
        const allowedIds = new Set(
          (req.auth?.scope?.condominiumIds || []).map(String)
        );
        ownerResponse.propertyDetails = (
          ownerResponse.propertyDetails || []
        ).filter((property) =>
          allowedIds.has(
            String(property?.addressId?._id || property?.addressId)
          )
        );
      }

      return res.status(200).send({
        status: "success",
        message: ownerResponse,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },
  getAllOwners: async function (req, res) {
    try {
      const organizationId = req.auth.organizationId;
      const condominiumFilter = { organizationId, status: "active" };
      const scopeMode = req.auth.scope.mode || req.auth.scope.type;
      if (scopeMode === "SELECTED") {
        condominiumFilter._id = { $in: req.auth.scope.condominiumIds };
      }

      const condos = await Condominio.find(condominiumFilter)
        .select("_id units_ownerId")
        .lean();

      const condoIds = condos.map((c) => c._id);
      const condoOwnerIds = condos
        .flatMap((c) => c.units_ownerId || [])
        .map((u) => (u && u.ownerId ? u.ownerId : u))
        .filter((id) => id && mongoose.Types.ObjectId.isValid(id));

      const ownerWithCondo = await Owner.find({
        organizationId,
        $or: [
          { "propertyDetails.addressId": { $in: condoIds } },
          { _id: { $in: condoOwnerIds } },
        ],
      }).populate({
        path: "propertyDetails.addressId",
        model: "Condominium",
        select:
          "_id alias availableUnits phone street_1 street_2 sector_name city province zipcode country socialAreas status mPayment createdAt",
      });

      const ownerIds = ownerWithCondo.map((o) => o._id);
      const ownersWithInvoices = await Owner.aggregate([
        // 1️⃣ Filtrar owners (opcional si ya tienes ownerIds)
        {
          $match: {
            _id: { $in: ownerIds },
            organizationId: new mongoose.Types.ObjectId(organizationId),
          },
        },

        // 2️⃣ Lookup invoices (LEFT JOIN)
        {
          $lookup: {
            from: "invoices",
            let: { ownerId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$ownerId", "$$ownerId"] },
                      { $eq: ["$status", "pending"] },
                    ],
                  },
                },
              },
            ],
            as: "invoices",
          },
        },

        // 3️⃣ Calcular totales (aunque no tenga invoices)
        {
          $addFields: {
            totalInvoices: { $size: "$invoices" },
            totalAmount: {
              $sum: "$invoices.amount",
            },
          },
        },

        // 4️⃣ Extraer condominiumIds del owner
        {
          $addFields: {
            condominiumIdsFromOwner: {
              $map: {
                input: "$propertyDetails",
                as: "pd",
                in: "$$pd.addressId",
              },
            },
          },
        },

        // 5️⃣ Lookup condominios
        {
          $lookup: {
            from: "condominia",
            localField: "condominiumIdsFromOwner",
            foreignField: "_id",
            as: "condominiums",
          },
        },

        // 6️⃣ Proyección final
        {
          $project: {
            ownerId: "$_id",
            owner: {
              avatar: "$avatar",
              _id: "$_id",
              name: "$name",
              lastname: "$lastname",
              email: "$email",
              phone: "$phone",
              createdAt: "$createdAt",
            },

            condominiumIds: {
              $map: {
                input: "$condominiums",
                as: "condo",
                in: {
                  _id: "$$condo._id",
                  alias: "$$condo.alias",
                },
              },
            },

            totalInvoices: 1,
            totalAmount: 1,
            invoices: {
              $map: {
                input: "$invoices",
                as: "inv",
                in: {
                  _id: "$$inv._id",
                  amount: "$$inv.amount",
                  issueDate: "$$inv.issueDate",
                  dueDate: "$$inv.dueDate",
                  condominiumId: "$$inv.condominiumId",
                  status: "$$inv.status",
                },
              },
            },

            _id: 0,
          },
        },
      ]);

      return res.status(200).send({
        status: "success",
        message: ownersWithInvoices,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error retrieving condominiums for this owner",
        error: error.message,
      });
    }
  },

  getAssets: async function (req, res) {
    let id = req.params.id;

    // Owner profiles change frequently (payments, bookings, units). Returning
    // a cached 304 can leave the administrative view with stale aggregates.
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    if (Boolean(id == undefined)) {
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    try {
      const owner = await Owner.findOne({
        _id: id,
        organizationId: req.auth.organizationId,
      })
        .select("-password")
        .populate({
          path: "propertyDetails.addressId",
          model: "Condominium",
          select:
            "avatar availableUnits alias phone street_1 street_2 sector_name city province zipcode country socialAreas mPayment status mPayment createdAt",
        });

      const invoices = await Invoice.aggregate([
        {
          $match: {
            ownerId: new mongoose.Types.ObjectId(id),
            organizationId: new mongoose.Types.ObjectId(
              req.auth.organizationId
            ),
            paymentStatus: "pending",
          },
        },
        {
          $group: {
            _id: "$ownerId",
            totalAmount: { $sum: remainingBalanceExpression() },
            count: { $sum: 1 },
            invoice_paid_date: { $first: "$invoice_paid_date" },
            invoices: { $push: "$$ROOT" },
          },
        },
      ]);
      const booking = await Reserve.aggregate([
        {
          $match: { memberId: new mongoose.Types.ObjectId(id) },
        },
        {
          $group: {
            _id: "$memberId",
            count: { $sum: 1 },
            bookings: { $push: "$$ROOT" },
          },
        },
      ]);
      const invoicesPaid = await Invoice.find({
        ownerId: new mongoose.Types.ObjectId(id),
        organizationId: req.auth.organizationId,
        paymentStatus: "completed",
      }).populate({
        path: "condominiumId",
        model: "Condominium",
        select:
          "avatar availableUnits alias phone street_1 street_2 sector_name city province zipcode country socialAreas mPayment status mPayment createdAt",
      });
      const data = {
        owner: owner,
        invoices: invoices,
        bookings: booking,
        invoicePaid: invoicesPaid,
      };

      if (!owner) {
        return res.status(404).send({
          status: "error",
          message: "Owner not found",
        });
      }

      return res.status(200).send({
        success: true,
        data,
        error: null,
        code: "OWNER_ASSETS_OK",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },
  createMultipleOwner: async function (req, res) {
    const params = req.body;

    try {
      let val = params.map((p) => {
        var val_id_number = !validator.isEmpty(p.id_number);
        var val_email = validator.isEmail(p.email);
        var val_condominioId = !validator.isEmpty(p.addressId);

        return val_id_number && val_email && val_condominioId;
      });
      assert.strictEqual(val.includes(false), false, "params must be an array");
      assert.strictEqual(
        Array.isArray(params),
        true,
        "params must be an array"
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }

    const owner = await Owner.find({
      id_number: { $in: params.map((p) => p.id_number) },
    });
    const condominiumRows = await Condominio.find({
      _id: { $in: params.map((ownerParams) => ownerParams.addressId) },
      organizationId: req.ownerTokenDecoded?.organizationId,
      status: "active",
    }).lean();
    const condominiumById = new Map(
      condominiumRows.map((condominium) => [
        String(condominium._id),
        condominium,
      ])
    );
    const assignedInRequest = new Set();
    for (const ownerParams of params) {
      const condominium = condominiumById.get(String(ownerParams.addressId));
      const unitLabel = String(ownerParams.condominium_unit || "").trim();
      const normalizedLabel = unitLabel
        .normalize("NFKC")
        .replace(/\s+/g, " ")
        .toLowerCase();
      const unit = condominium?.units?.find(
        (candidate) => candidate.normalizedLabel === normalizedLabel
      );
      const reservationKey = `${ownerParams.addressId}:${
        unit?._id || "missing"
      }`;
      if (
        !condominium ||
        !unit ||
        unit.status !== "active" ||
        unit.availability !== "AVAILABLE" ||
        !(condominium.availableUnits || []).includes(unit.label) ||
        assignedInRequest.has(reservationKey)
      ) {
        return res.status(409).send({
          status: "error",
          code: "CONDOMINIUM_UNIT_NOT_AVAILABLE",
          message:
            "One or more selected units are unavailable or need reconciliation",
        });
      }
      assignedInRequest.add(reservationKey);
      ownerParams.organizationId = req.ownerTokenDecoded.organizationId;
      ownerParams.propertyDetails = [
        {
          contextType: "CONDOMINIUM_UNIT",
          addressId: condominium._id,
          unitId: unit._id,
          condominium_unit: unit.label,
          parkingsQty: Number(ownerParams.parkingsQty || 0),
        },
      ];
    }

    if (owner.length > 0) {
      return res.status(400).send({
        status: "error",
        message: "Some owners already exist",
        found: owner,
      });
    }

    try {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const newOwners = await Owner.insertMany(params, {
            session,
            ordered: true,
          });
          for (const ownerDoc of newOwners) {
            const property = ownerDoc.propertyDetails[0];
            const condominium = condominiumById.get(String(property.addressId));
            const result = await Condominio.updateOne(
              {
                _id: property.addressId,
                organizationId: req.ownerTokenDecoded.organizationId,
                availableUnits: property.condominium_unit,
                units: {
                  $elemMatch: {
                    _id: property.unitId,
                    status: "active",
                    availability: "AVAILABLE",
                  },
                },
              },
              {
                $pull: { availableUnits: property.condominium_unit },
                $set: { "units.$[unit].availability": "ASSIGNED" },
                $addToSet: {
                  units_ownerId: { ownerId: ownerDoc._id, status: "active" },
                },
              },
              {
                session,
                arrayFilters: [{ "unit._id": property.unitId }],
                runValidators: true,
              }
            );
            if (result.modifiedCount !== 1 || !condominium) {
              const error = new Error(
                "Bulk unit assignment lost its reservation"
              );
              error.code = "CONDOMINIUM_UNIT_NOT_AVAILABLE";
              error.statusCode = 409;
              throw error;
            }
          }
        });
      } finally {
        await session.endSession();
      }

      return res.status(200).send({
        status: "success",
        message: "Owners created successfully",
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
        error: error,
      });
    }
  },
};

module.exports = ownerAndSubController;
