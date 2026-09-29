"use strict";

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

      if (!Number.isInteger(parkingsQty) || parkingsQty < 0 || parkingsQty > 5) {
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

      const propertyDetails = {
        addressId: params.addressId,
        condominium_unit: params.apartmentsUnit,
        parkingsQty,
        isRenting,
      };

      const releaseUnit = () =>
        Condominio.updateOne(
          { _id: reservedCondominium._id, organizationId },
          { $addToSet: { availableUnits: params.apartmentsUnit } }
        );

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
        void emailVerification.verifyRegistration(user).catch((error) => {
          console.log("Owner registration email failed", error.message);
        });
        void Promise.resolve()
          .then(() => wsConfirmationMessage.sendWhatsappMessage(user))
          .catch((error) => {
            console.log("Owner registration WhatsApp failed", error.message);
          });

        return res.status(201).send({
          status: "success",
          message: "User created successfully",
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
    var params = req.body;
    // console.log("params", params);
    // return;

    try {
      let propertyDetails = {
        addressId: params.addressId,
        condominium_unit: params.unit,
        parkingsQty: params.parkingsQty,
        isRenting: ["yes", "true", "1"].includes(
          String(params.isRenting || "").toLowerCase()
        ),
      };

      await Owner.findOneAndUpdate(
        { _id: params.ownerId },
        { $push: { propertyDetails: propertyDetails } },
        { new: true }
      );

      await Condominio.findOneAndUpdate(
        { _id: params.addressId },
        {
          $pull: { availableUnits: params.unit },
          $addToSet: {
            units_ownerId: { ownerId: params.ownerId, status: "active" },
          },
        },
        { new: true, runValidators: true }
      );

      if (res == null) {
        return {
          status: "success",
          message: "Unit assigned successfully",
          code: 200,
        };
      }
      return res.status(200).send({
        status: "success",
        message: "Unit assigned successfully",
      });
    } catch (error) {
      console.log(error);
      if (res == null) {
        return {
          status: "error",
          message: "Unit could not be assigned",
          code: 500,
        };
      }
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
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

    if (val_ownerId && val_propertyId && val_unit && val_newUnit) {
      try {
        const OwnerFound = await Owner.findOneAndUpdate(
          {
            $and: [
              { _id: params.ownerId },
              { "propertyDetails.condominium_unit": params.unit },
            ],
          },
          {
            $set: {
              "propertyDetails.$.condominium_unit": params.newUnit,
              "propertyDetails.$.parkingsQty": params.parkingsQty,
            },
          },
          { new: true }
        );

        const condoFound = await Condominio.findOne({
          $and: [
            { _id: params.propertyId },
            { availableUnits: { $in: [params.newUnit] } },
          ],
        });

        if (!condoFound) {
          return res.status(200).send({
            status: "success",
            message: "Property updated successfully",
            owner: OwnerFound,
          });
        }

        await Condominio.updateOne(
          { _id: params.propertyId },
          { $pull: { availableUnits: params.newUnit } }
        );

        await Condominio.updateOne(
          { _id: params.propertyId },
          { $addToSet: { availableUnits: params.unit } } // evita duplicados
        );

        return res.status(200).send({
          status: "success",
          message: "Unit updated successfully",
          owner: OwnerFound,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          status: "error",
          message: "Server error, try again",
        });
      }
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

    if (val_ownerId && val_propertyId && val_unit) {
      try {
        await Owner.findOneAndUpdate(
          { _id: params.ownerId },
          { $pull: { propertyDetails: { condominium_unit: params.unit } } },
          { new: true }
        );
        await Condominio.findOneAndUpdate(
          { _id: params.propertyId },
          {
            $set: { status: "inactive" },
            $push: { availableUnits: params.unit },
          },
          { new: true }
        );

        return res.status(200).send({
          status: "success",
          message: "Unit deleted successfully",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          status: "error",
          message: "Server error, try again",
        });
      }
    }
  },
  deactivatedUser: async function (req, res) {
    var params = req.body;
    let set_status = params.status == "inactive" ? "active" : "inactive";

    // // var user = { owner: Owner, family: Family };
    // const updated = await Owner.findOne({
    //   _id: new mongoose.Types.ObjectId(params._id),
    //   "propertyDetails.addressId": new mongoose.Types.ObjectId(params.condoId),
    // });
    // console.log("updated", updated.propertyDetails[0].status);
    // return;

    try {
      if (params.ishome) {
        // Actualiza el status del elemento correcto dentro de propertyDetails en una sola operación atómica
        await Owner.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(params._id),
            "propertyDetails.addressId": new mongoose.Types.ObjectId(
              params.condoId
            ),
          },
          [
            {
              $set: {
                propertyDetails: {
                  $map: {
                    input: "$propertyDetails",
                    as: "pd",
                    in: {
                      $cond: [
                        {
                          $eq: [
                            "$$pd.addressId",
                            new mongoose.Types.ObjectId(params.condoId),
                          ],
                        },
                        {
                          $mergeObjects: [
                            "$$pd",
                            {
                              status: {
                                $cond: [
                                  { $eq: ["$$pd.status", "active"] },
                                  "inactive",
                                  "active",
                                ],
                              },
                            },
                          ],
                        },
                        "$$pd",
                      ],
                    },
                  },
                },
              },
            },
          ],
          { new: true }
        );

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
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
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
      const ownerCondo = await Owner.findOne({ _id: ownerId }).populate({
        path: "propertyDetails.addressId",
        model: "Condominium",
        select:
          "avatar availableUnits alias phone street_1 street_2 sector_name city province zipcode country socialAreas mPayment status mPayment createdAt",
      });

      return res.status(200).send({
        status: "success",
        message: ownerCondo,
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

    if (Boolean(id == undefined)) {
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    try {
      const owner = await Owner.findOne({ _id: id })
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
            paymentStatus: "pending",
          },
        },
        {
          $group: {
            _id: "$ownerId",
            totalAmount: { $sum: "$amount" },
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
        paymentStatus: "paid",
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
        status: "success",
        message: data,
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
    const condominio = await Condominio.find({
      addressId: { $in: params.map((p) => p.addressId) },
    });
    condominio.forEach((c) => {
      const existe = params.some((p) =>
        c.availableUnits.includes(p.condominium_unit)
      );
      if (!existe) {
        return res.status(400).send({
          status: "error",
          message: `Unit ${params.map(
            (p) => p.condominium_unit
          )} not available in condominium ${c.alias}`,
        });
      }
    });

    if (owner.length > 0) {
      return res.status(400).send({
        status: "error",
        message: "Some owners already exist",
        found: owner,
      });
    }

    try {
      params.forEach((ownerObj) => {
        let propertyDetails = {
          addressId: "",
          condominium_unit: "",
          parkingsQty: "",
        };
        let { addressId, condominium_unit, parkingsQty, ..._ } = ownerObj;
        propertyDetails.addressId = addressId;
        propertyDetails.condominium_unit = condominium_unit;
        propertyDetails.parkingsQty = parkingsQty;
        ownerObj["propertyDetails"] = [propertyDetails];
      });

      delete params.addressId;
      delete params.condominium_unit;
      delete params.parkingsQty;
      const newOwners = await Owner.insertMany(params);

      await Promise.all(
        newOwners.map(async (usuario) => {
          const addressId = usuario.propertyDetails[0].addressId;
          const unidad = usuario.propertyDetails[0].condominium_unit.trim();

          if (!addressId || !unidad) {
            console.warn(`Datos incompletos para usuario ${usuario._id}`);
            return;
          }

          const result = await Condominio.updateOne(
            { _id: addressId },
            {
              $pull: { availableUnits: unidad },
              $push: { units_ownerId: usuario._id },
            }
          );

          if (result.modifiedCount === 0) {
            console.warn(`No se actualizó condominio para unidad ${unidad}`);
          }
        })
      );

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
