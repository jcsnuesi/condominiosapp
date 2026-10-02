"use strict";
const { remainingInvoiceBalance } = require("../service/invoiceBalance");

var validator = require("validator");
var path = require("path");
const Condominium = require("../models/condominio");
var fs = require("fs");
let errorHandler = require("../error/errorHandler");
let checkExtensions = require("../service/extensions");
let verifyParamData = require("../service/verifyParamData");
const Owner = require("../models/owners");
const Admin = require("../models/admin");
const Family = require("../models/family");
const Invoice = require("../models/invoice");
const Staff = require("../models/staff");
const AuthorizationAudit = require("../models/authorizationAudit");
const bcrypt = require("bcrypt");
const {
  ACCOUNT_MODELS,
  canAccessCondominium,
} = require("../service/authorization");
const { match } = require("assert");
const { create } = require("../models/counter");
const {
  groupCondominiumOwners,
  setOwnerCondominiumStatus,
} = require("../service/residentPropertyAccess");

const mongoose = require("mongoose");

async function permanentDeleteImpact(
  organizationId,
  condominiumId,
  session = null
) {
  const objectId = new mongoose.Types.ObjectId(condominiumId);
  const organizationObjectId = new mongoose.Types.ObjectId(organizationId);

  const invoicePipeline = Invoice.aggregate([
    {
      $match: {
        organizationId: organizationObjectId,
        condominiumId: objectId,
        paymentStatus: "pending",
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  const unitPipeline = Owner.aggregate([
    {
      $match: {
        organizationId: organizationObjectId,
        "propertyDetails.addressId": objectId,
      },
    },
    { $unwind: "$propertyDetails" },
    {
      $match: {
        "propertyDetails.addressId": objectId,
        "propertyDetails.status_property": { $ne: "inactive" },
      },
    },
    { $group: { _id: "$propertyDetails.condominium_unit" } },
    { $count: "count" },
  ]);

  if (session) {
    invoicePipeline.session(session);
    unitPipeline.session(session);
  }

  const [invoiceTotals, unitTotals, familyAccounts, staffAccounts] =
    await Promise.all([
      invoicePipeline,
      unitPipeline,
      Family.countDocuments({
        organizationId: organizationObjectId,
        "propertyDetails.addressId": objectId,
      }).session(session),
      Staff.countDocuments({
        organizationId: organizationObjectId,
        condo_id: objectId,
        status: { $ne: "inactive" },
      }).session(session),
    ]);

  return {
    pendingInvoices: invoiceTotals[0]?.count || 0,
    pendingInvoiceAmount: invoiceTotals[0]?.totalAmount || 0,
    unitsToDeactivate: unitTotals[0]?.count || 0,
    familyAccountsToUnlink: familyAccounts,
    staffAccountsToDeactivate: staffAccounts,
  };
}

async function runPermanentDeleteTransaction(work) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

var Condominium_Controller = {
  createCondominium: async function (req, res) {
    let condominiumParams = req.body;

    // Required fields validation
    /*

     user_id
     alias
     street_1
     street_2
     sector_name
     city
     province
     mPayment

    */

    try {
      var alias_validation = !validator.isEmpty(condominiumParams.alias);
      var street_1_validation = !validator.isEmpty(condominiumParams.street_1);
      var street_2_validation = !validator.isEmpty(condominiumParams.street_2);
      var sector_name_validation = !validator.isEmpty(
        condominiumParams.sector_name
      );
      var city_validation = !validator.isEmpty(condominiumParams.city);
      var province_validation = !validator.isEmpty(condominiumParams.province);
      var mPayment_validation = !validator.isEmpty(condominiumParams.mPayment);
    } catch (error) {
      console.log("error", error);
      return res.status(400).send({
        status: "error",
        message: "Check out all fiels",
      });
    }

    //verificar la extension de archivo enviado sea tipo imagen
    var imgFormatAccepted = checkExtensions.confirmExtension(req);

    if (!imgFormatAccepted) {
      return res.status(400).send({
        status: "bad request",
        message:
          "System just accept image format '.jpg', '.jpeg', '.gif', '.png'",
      });
    }

    if (
      alias_validation &&
      street_1_validation &&
      sector_name_validation &&
      province_validation &&
      city_validation &&
      mPayment_validation &&
      street_2_validation
    ) {
      const condo = await Condominium.findOne({
        organizationId: req.auth.organizationId,
        alias: condominiumParams.alias,
        status: "active",
      });

      if (condo) {
        return res.status(400).send({
          status: "bad request",
          message: "Condominium already exists for this user",
        });
      }

      try {
        const availableUnits = Array.isArray(condominiumParams.availableUnits)
          ? condominiumParams.availableUnits
              .map((unit) => String(unit || "").trim())
              .filter(Boolean)
          : [];
        const unitLabels = new Map();
        for (const label of availableUnits) {
          const normalizedLabel = label
            .normalize("NFKC")
            .replace(/\s+/g, " ")
            .toLowerCase();
          if (normalizedLabel && !unitLabels.has(normalizedLabel)) {
            unitLabels.set(normalizedLabel, label);
          }
        }
        const uniqueAvailableUnits = [...unitLabels.values()];
        const condominio = new Condominium({
          organizationId: req.auth.organizationId,
          alias: condominiumParams.alias,
          typeOfProperty: condominiumParams.typeOfProperty,
          phone: condominiumParams.phone,
          phone2: condominiumParams.phone2 ?? "",
          street_1: condominiumParams.street_1,
          street_2: condominiumParams.street_2,
          sector_name: condominiumParams.sector_name ?? "",
          availableUnits: uniqueAvailableUnits,
          units: [...unitLabels.entries()].map(([normalizedLabel, label]) => ({
            label,
            normalizedLabel,
            status: "active",
            availability: "AVAILABLE",
          })),
          city: condominiumParams.city,
          province: condominiumParams.province,
          zipcode: condominiumParams.zipcode ?? "",
          country: condominiumParams.country,
          socialAreas: condominiumParams.socialAreas ?? [],
          mPayment: condominiumParams.mPayment,
          paymentDate: condominiumParams.paymentDate,
          createdBy: req.user.sub,
        });
        await condominio.save();

        return res.status(200).send({
          status: "success",
          message: "Condominium created successfully",
          condominium: condominio,
        });
      } catch (error) {
        console.log("error", error);
        return res.status(500).send({
          status: "error",
          message: "Error saving condominium",
          error: error.message,
        });
      }
    } else {
      return res.status(500).send({
        status: "bad request",
        message: "All field must be fill out",
      });
    }
  },

  createApartment: function (req, res) {
    var params = req.body;

    try {
      var id_address = !validator.isEmpty(params.addressId);
      var id_owner = !validator.isEmpty(req.user.sub);
      var id_parkingQty = !validator.isEmpty(params.parkingQty);
      var id_apartmentUnit = !validator.isEmpty(params.apartmentUnit);
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: "Server error, please again later.",
      });
    }

    if (id_address && id_owner && id_parkingQty && id_apartmentUnit) {
      Condominium.findOne({ _id: params.addressId }, async (err, apartment) => {
        if (err) {
          return res.status(400).send({
            status: "error",
            message: err,
          });
        }

        const duplicated = await Condominium.findOne({
          $and: [
            { "apartmentInfo.addressId": params.addressId },
            { "apartmentInfo.apartmentUnit": params.apartmentUnit },
          ],
        });

        if (duplicated != null) {
          var aptFound = apartment.apartmentInfo.filter(
            (data, index) => data.apartmentUnit == params.apartmentUnit
          );
        }

        if (apartment) {
          var addressInfo = {
            ownerId: req.user.sub,
            addressId: params.addressId,
            parkingQty: params.parkingQty,
            invoiceIssueDay: params.invoiceIssueDay,
            apartmentUnit: params.apartmentUnit,
          };

          apartment.apartmentInfo.push(addressInfo);
          Condominium.findOneAndUpdate(
            { _id: params.addressId },
            apartment,
            { new: true },
            (err, saved) => {
              if (err) {
                return res.status(400).send({
                  status: "error",
                  message: err,
                });
              }

              return res.status(200).send({
                status: "success",
                message: saved,
              });
            }
          );
        }
      });
    } else {
      return res.status(400).send({
        status: "error",
        message: "Fill out all fields.",
      });
    }
  },

  getCondominiumById: async function (req, res) {
    var params = new mongoose.Types.ObjectId(req.params.id);

    if (params == null) {
      return res.status(400).send({
        status: "error",
        message: "Invalid condominium ID",
      });
    }
    try {
      const condoFound = await Condominium.findOne({
        _id: params,
        organizationId: req.auth.organizationId,
      });

      if (!condoFound) {
        return res.status(404).send({
          status: "error",
          message: "Condominium not found",
        });
      }
      return res.status(200).send({
        status: "success",
        condominium: condoFound,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error,
      });
    }
  },
  CondominiumUpdate: async function (req, res) {
    // Si el usuario envia un archivo de imagen, se guarda en el servidor y se le asigna el nombre a la propiedad avatar
    let id = req.params.id;
    let params = req.body;

    try {
      const condominiumUpdated = await Condominium.findOneAndUpdate(
        { _id: id, organizationId: req.auth.organizationId },
        {
          $set: Object.fromEntries(
            Object.entries(params).filter(
              ([key]) =>
                !["organizationId", "createdBy", "user_id"].includes(key)
            )
          ),
        },
        { new: true }
      );

      if (!condominiumUpdated) {
        return res.status(404).send({
          status: "error",
          message: "Condominio no encontrado",
        });
      }

      return res.status(200).send({
        status: "success",
        condominium: condominiumUpdated,
      });
    } catch (error) {
      // console.log("error", error);
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el condominio",
        error: error,
      });
    }
  },
  in_activeOwnerFromCondo: async function (req, res) {
    const { condoId, ownerId, status } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(condoId) ||
      !mongoose.Types.ObjectId.isValid(ownerId)
    ) {
      return res.status(400).send({
        status: "error",
        message: "Invalid condominium or owner ID",
      });
    }

    try {
      const condominiumUpdated = await setOwnerCondominiumStatus({
        condominiumId: condoId,
        ownerId,
        organizationId: req.auth.organizationId,
        status,
      });
      return res.status(200).send({
        status: "success",
        condominium: condominiumUpdated,
      });
    } catch (error) {
      console.error("inactiveOwnerFromCondo error:", error);
      return res.status(error.statusCode || 500).send({
        status: "error",
        message: error.message || "Error al actualizar el condominio",
        error: error.message,
      });
    }
  },
  PermanentDeleteImpact: async function (req, res) {
    const condominiumId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(condominiumId)) {
      return res.status(400).send({
        status: "error",
        message: "A valid condominium ID is required",
      });
    }

    try {
      const condominium = await Condominium.findOne({
        _id: condominiumId,
        organizationId: req.auth.organizationId,
      })
        .select("_id alias status")
        .lean();

      if (!condominium) {
        return res.status(404).send({
          status: "error",
          message: "Condominium not found",
        });
      }

      const impact = await permanentDeleteImpact(
        req.auth.organizationId,
        condominiumId
      );

      return res.status(200).send({
        status: "success",
        data: {
          condominium: {
            id: condominium._id,
            alias: condominium.alias,
            status: condominium.status,
          },
          impact,
          invoicesArePreserved: true,
        },
      });
    } catch (error) {
      console.error("PermanentDeleteImpact error:", error);
      return res.status(500).send({
        status: "error",
        message: "The permanent deletion impact could not be calculated",
      });
    }
  },
  PermanentDelete: async function (req, res) {
    const condominiumId = req.params.id;
    const password = String(req.body?.password || "");
    const role = String(req.auth.role || "").toUpperCase();
    const AccountModel = ACCOUNT_MODELS[role];

    if (!mongoose.Types.ObjectId.isValid(condominiumId)) {
      return res.status(400).send({
        status: "error",
        message: "A valid condominium ID is required",
      });
    }

    if (!password) {
      return res.status(400).send({
        status: "error",
        message: "Your password is required",
      });
    }

    if (!AccountModel || !["ADMIN", "STAFF_ADMIN"].includes(role)) {
      return res.status(403).send({
        status: "forbidden",
        message: "This account cannot permanently delete condominiums",
      });
    }

    try {
      const account = await AccountModel.findOne({
        _id: req.user.sub,
        organizationId: req.auth.organizationId,
        status: "active",
      }).select("+password");

      if (!account || !(await bcrypt.compare(password, account.password))) {
        return res.status(403).send({
          status: "forbidden",
          code: "AUTH_PASSWORD_INVALID",
          message: "The password is incorrect",
        });
      }

      const deletedAt = new Date();
      const result = await runPermanentDeleteTransaction(async (session) => {
        const condominium = await Condominium.findOne({
          _id: condominiumId,
          organizationId: req.auth.organizationId,
        })
          .session(session)
          .lean();

        if (!condominium) {
          const notFound = new Error("Condominium not found");
          notFound.statusCode = 404;
          throw notFound;
        }

        const impact = await permanentDeleteImpact(
          req.auth.organizationId,
          condominiumId,
          session
        );
        const objectId = condominium._id;
        const organizationId = condominium.organizationId;

        await Owner.updateMany(
          {
            organizationId,
            "propertyDetails.addressId": objectId,
          },
          {
            $set: {
              "propertyDetails.$[unit].status_property": "inactive",
              "propertyDetails.$[unit].formerCondominiumId": objectId,
              "propertyDetails.$[unit].formerCondominiumAlias":
                condominium.alias,
            },
            $unset: { "propertyDetails.$[unit].addressId": "" },
          },
          {
            arrayFilters: [{ "unit.addressId": objectId }],
            session,
          }
        );

        await Family.updateMany(
          {
            organizationId,
            "propertyDetails.addressId": objectId,
          },
          {
            $set: {
              "propertyDetails.$[unit].family_status": "inactive",
              "propertyDetails.$[unit].formerCondominiumId": objectId,
              "propertyDetails.$[unit].formerCondominiumAlias":
                condominium.alias,
            },
            $unset: { "propertyDetails.$[unit].addressId": "" },
          },
          {
            arrayFilters: [{ "unit.addressId": objectId }],
            session,
          }
        );

        await Staff.updateMany(
          { organizationId, condo_id: objectId },
          { $set: { status: "inactive" }, $unset: { condo_id: "" } },
          { session }
        );

        await Invoice.updateMany(
          { organizationId, condominiumId: objectId },
          {
            $set: {
              condominiumSnapshot: {
                id: objectId,
                alias: condominium.alias,
                deletedAt,
              },
            },
          },
          { session }
        );

        await Condominium.deleteOne(
          { _id: objectId, organizationId },
          { session }
        );

        await AuthorizationAudit.create(
          [
            {
              organizationId,
              actorId: req.user.sub,
              actorRole: role,
              action: "condominium.permanent_delete",
              targetType: "Condominium",
              targetId: objectId,
              before: condominium,
              after: { deletedAt, impact, invoicesPreserved: true },
              ip: req.ip || "",
              userAgent: req.get("user-agent") || "",
            },
          ],
          { session }
        );

        return { alias: condominium.alias, impact };
      });

      return res.status(200).send({
        status: "success",
        data: {
          condominiumId,
          alias: result.alias,
          impact: result.impact,
          invoicesPreserved: true,
        },
      });
    } catch (error) {
      console.error("PermanentDelete error:", error);
      return res.status(error.statusCode || 500).send({
        status: "error",
        message:
          error.statusCode === 404
            ? error.message
            : "The condominium could not be permanently deleted",
      });
    }
  },
  CondominiumDelete: async function (req, res) {
    const condoId = req.params.id;

    if (!condoId) {
      return res.status(400).send({
        status: "error",
        message: "Condominium ID is required",
      });
    }

    try {
      const condominiumFound = await Condominium.findOne({ _id: condoId });
      let set_status =
        condominiumFound.status == "inactive" ? "active" : "inactive";

      // if (condominiumFound.status === "inactive") {
      //   set_status = "active";
      // }

      const condominiumDeleted = await Condominium.findByIdAndUpdate(
        condoId,
        { status: set_status },
        { new: true }
      );
      const staffDisabled = await Staff.updateMany(
        { condo_id: condoId },
        { status: set_status },
        { new: true }
      );

      const invoicesDisabled = await Invoice.updateMany(
        { condominiumId: condoId },
        { status: set_status },
        { new: true }
      );

      if (!condominiumDeleted) {
        return res.status(404).send({
          status: "error",
          message: "Condominium not found",
        });
      }

      return res.status(200).send({
        status: "success",
        condominium_deleted: condominiumDeleted,
        staff_updated: staffDisabled || [],
        invoices_updated: invoicesDisabled || [],
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error updating condominium status",
        error: error.message,
      });
    }
  },
  CondominiumPagination: function (req, res) {
    let numOfPage = req.params.page;
    var page;

    if (
      numOfPage.match("[a-zA-Z]") ||
      numOfPage == null ||
      numOfPage == undefined ||
      numOfPage == 0 ||
      numOfPage == "0"
    ) {
      page = 1;
    } else {
      page = req.params.page;
    }

    //Indicar las opciones de paginacion
    var options = {
      sort: { des: -1 },
      limit: 25,
      page: parseInt(page),
    };

    Condominium.paginate(options, (err, condominium) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al hacer la consulta",
        });
      }

      if (!condominium) {
        return res.status(500).send({
          status: "error",
          message: "No condominium",
        });
      }

      condominium.docs[0].createBy.password = null;

      return res.status(200).send({
        status: "success",
        condominium: condominium.docs,
        totalDocs: condominium.totalDocs,
        totalPages: condominium.totalPages,
      });
    });
  },
  getCondominiumsByAdmin: async function (req, res) {
    try {
      const filter = { organizationId: req.auth.organizationId };
      if (req.auth.scope.mode === "SELECTED") {
        filter._id = { $in: req.auth.scope.condominiumIds };
      }
      let condosFound = await Condominium.find(filter);

      if (condosFound.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No condominiums found for this admin",
        });
      }

      return res.status(200).send({
        status: "success",
        condominiums: condosFound,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Server error retrieving condominiums for this admin",
        error: error.message,
      });
    }
  },

  getOwnerCondoAndInvoices: async function (req, res) {
    const ownerId = new mongoose.Types.ObjectId(req.params.id);

    try {
      const ownerWithCondo = await Owner.findOne({ _id: ownerId }).populate({
        path: "propertyDetails.addressId",
        model: "Condominium",
        select:
          "_id alias availableUnits phone street_1 street_2 sector_name city province zipcode country socialAreas status mPayment createdAt",
      });

      const invoices = await Invoice.find({
        ownerId: ownerId,
        organizationId: req.auth.organizationId,
        paymentStatus: "pending",
      });

      const ownerWithCondoAndInvoices = ownerWithCondo.propertyDetails.map(
        (property) => {
          const propertyInvoices = invoices
            .filter(
              (invoice) =>
                invoice.condominiumId.equals(property.addressId._id) &&
                invoice.unitNumber.trim() === property.condominium_unit.trim()
            )
            .reduce(
              (acc, invoice) => {
                acc.pending_balance =
                  Math.round(
                    (acc.pending_balance + remainingInvoiceBalance(invoice)) *
                      100
                  ) / 100;
                acc.invoices.push(invoice);
                return acc;
              },
              { pending_balance: 0, invoices: [] }
            );

          return {
            ...property.toObject(),
            id: ownerWithCondo._id,
            owner_data: {
              name: ownerWithCondo.name,
              lastname: ownerWithCondo.lastname,
              email: ownerWithCondo.email,
              phone: ownerWithCondo.phone,
              gender: ownerWithCondo.gender,
              id_number: ownerWithCondo.id_number,
            },
            invoices: propertyInvoices.invoices,
            pending_balance: propertyInvoices.pending_balance,
          };
        }
      );

      return res.status(200).send({
        status: "success",
        condominium: ownerWithCondoAndInvoices,
      });
    } catch (error) {
      console.log("ownerWithCondo:", error);
      return res.status(500).send({
        status: "error",
        message: "Server error retrieving condominiums for this owner",
        error: error.message,
      });
    }
  },

  getBuildingDetails: async function (req, res) {
    // Validar que el id exista y sea un ObjectId válido
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid or missing id parameter",
      });
    }

    try {
      const objectId = new mongoose.Types.ObjectId(req.params.id);

      if (
        ["OWNER", "FAMILY"].includes(
          String(req.auth?.role || "").toUpperCase()
        ) &&
        !canAccessCondominium(req.auth, objectId)
      ) {
        return res.status(403).send({
          status: "error",
          message: "Resident access to this condominium is inactive",
        });
      }

      const condominiums = await Condominium.find({
        _id: objectId,
        organizationId: req.auth.organizationId,
      })
        .select("-__v") // excluir campos innecesarios
        .populate({
          path: "units_ownerId.ownerId",
          match: { status: "active" },
          select:
            "availableUnits avatar name lastname gender email phone id_number status role familyAccount propertyDetails",
          populate: {
            path: "propertyDetails.addressId",
            select:
              "_id alias phone street_1 street_2 sector_name city province zipcode country socialAreas status mPayment createdAt status_property",
          },
        })
        .lean()
        .exec();

      if (condominiums.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "Condominium not found",
        });
      }

      condominiums[0].units_ownerId = groupCondominiumOwners(
        condominiums[0].units_ownerId,
        objectId
      );

      if (req.user.role === "OWNER") {
        condominiums[0].units_ownerId = condominiums[0].units_ownerId.filter(
          (owner) =>
            owner?.ownerId?._id?.toString() === req.user.sub?.toString()
        );
      }

      if (req.user.role === "FAMILY") {
        const familyMember = await Family.findById(req.user.sub)
          .select("createdBy")
          .lean();
        const ownerId = familyMember?.createdBy?.toString();

        condominiums[0].units_ownerId = ownerId
          ? condominiums[0].units_ownerId.filter(
              (owner) => owner?.ownerId?._id?.toString() === ownerId
            )
          : [];
      }

      return res.status(200).send({
        status: "success",
        condominium: condominiums,
      });
    } catch (error) {
      console.error("getBuildingDetails error:", error);
      return res.status(500).send({
        status: "error",
        message: "Server error retrieving building details",
        error: error.message,
      });
    }
  },

  getAvatar: function (req, res) {
    var imgName = req.params.avatar;
    var paths = "./uploads/properties/" + imgName;

    if (fs.existsSync(paths)) {
      return res.sendFile(path.resolve(paths));
    } else {
      return res.status(404).send({
        status: "error",
        message: "Image does not exits",
      });
    }
  },
  getUnits: async function (req, res) {
    const id = req.params.id;

    try {
      const condominiums = await Condominium.find({
        $or: [
          { units_ownerId: { $in: [new mongoose.Types.ObjectId(id)] } },
          { createdBy: new mongoose.Types.ObjectId(id) },
        ],
      }).select("availableUnits");
      if (!condominiums) {
        return res.status(404).send({
          status: "error",
          message: "Condominium not found",
        });
      }

      return res.status(200).send({
        status: "success",
        units: condominiums,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },
  ownerByOrganization: async function (req, res) {
    try {
      const filter = {
        organizationId: req.auth.organizationId,
        status: "active",
      };
      if (req.auth.scope.mode === "SELECTED")
        filter._id = { $in: req.auth.scope.condominiumIds };
      const condosFound = await Condominium.find(filter).select("_id alias");

      if (condosFound.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No condominiums found for this organization",
        });
      }
      return res.status(200).send({
        status: "success",
        message: condosFound,
      });
      // const condominium = await Condominium.aggregate([
      //   {
      //     $match: {
      //       createdBy: new mongoose.Types.ObjectId(roleId),
      //       status: "active",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "owners", // nombre de la colección en MongoDB, no el modelo Mongoose
      //       localField: "units_ownerId",
      //       foreignField: "_id",
      //       as: "units_ownerId",
      //     },
      //   },
      // ]);

      // let storage = [];

      // condominium.forEach((condo) => {
      //   let { units_ownerId, ...rest } = condo;

      //   for (const element of units_ownerId.flat()) {
      //     storage.push({
      //       _id: element["_id"],
      //       avatar: element["avatar"],
      //       name: element["name"],
      //       lastname: element["lastname"],
      //       email: element["email"],
      //       phone: element["phone"],
      //       createdAt: element["createdAt"],
      //     });
      //   }
      // });

      // const invoice = await Invoice.aggregate([
      //   {
      //     $match: {
      //       ownerId: { $in: storage.map((item) => item._id) },
      //       paymentStatus: "pending",
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$ownerId",
      //       totalAmount: { $sum: "$amount" },
      //       count: { $sum: 1 },
      //       invoice_paid_date: { $first: "$invoice_paid_date" },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "owners", // nombre de la colección en MongoDB, no el modelo Mongoose
      //       localField: "_id",
      //       foreignField: "_id",
      //       as: "owner",
      //     },
      //   },
      //   {
      //     $unwind: "$owner",
      //   },
      //   {
      //     $project: {
      //       _id: 1,
      //       invoice_paid_date: 1,
      //       totalAmount: 1,
      //       count: 1,
      //       "owner._id": 1,
      //       "owner.name": 1,
      //       "owner.avatar": 1,
      //       "owner.lastname": 1,
      //       "owner.email": 1,
      //       "owner.phone": 1,
      //       "owner.createdAt": 1,
      //     },
      //   },
      // ]);

      // storage.forEach((item) => {
      //   const invoiceData = invoice.find((inv) => inv._id.equals(item._id));
      //   if (invoiceData) {
      //     item.totalAmount = invoiceData.totalAmount;
      //     item.count = invoiceData.count;
      //     item.invoice_paid_date = invoiceData.invoice_paid_date;
      //   } else {
      //     item.totalAmount = 0;
      //     item.count = 0;
      //     item.invoice_paid_date = null;
      //   }
      // });

      // console.log("storage:", storage);
      // return res.status(200).send({
      //   status: "success",
      //   message: storage,
      // });
    } catch (error) {
      console.error("ownerByOrganization error:", error);
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },
  createMultipleCondo: async function (req, res) {
    let params = req.body;
    delete params.unitFormatted;

    try {
      // Validar que los parámetros necesarios estén presentes
      if (!Array.isArray(params)) {
        return res.status(400).send({
          status: "error",
          message: "Invalid input data",
        });
      }

      const condoFound = await Condominium.find({
        $or: [
          { alias: { $in: params.map((p) => p.alias) } },
          { phone: { $in: params.map((p) => p.phone) } },
        ],
      });

      if (condoFound.length > 0) {
        return res.status(400).send({
          status: "error",
          message: "Condominium with the same alias or phone already exists",
          condo: condoFound,
        });
      }

      await Condominium.insertMany(
        params.map((condominium) => ({
          ...condominium,
          organizationId: req.auth.organizationId,
          createdBy: req.user.sub,
        }))
      );
      return res.status(200).send({
        status: "success",
        message: "Condominiums created successfully",
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
      return res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = Condominium_Controller;
