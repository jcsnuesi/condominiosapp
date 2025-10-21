"use strict";

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
const { match } = require("assert");
const { create } = require("../models/counter");

const mongoose = require("mongoose");

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
      var user_id_validation = !validator.isEmpty(condominiumParams.user_id);
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
    console.log(
      alias_validation +
        "&&" +
        street_1_validation +
        "&&" +
        sector_name_validation +
        "&&" +
        province_validation +
        "&&" +
        city_validation +
        "&&" +
        mPayment_validation +
        "&&" +
        user_id_validation +
        "&&" +
        street_2_validation
    );

    if (
      alias_validation &&
      street_1_validation &&
      sector_name_validation &&
      province_validation &&
      city_validation &&
      mPayment_validation &&
      user_id_validation &&
      street_2_validation
    ) {
      const condo = await Condominium.findOne({
        $and: [
          { alias: condominiumParams.alias },
          { status: "active" },
          { createdBy: condominiumParams.user_id },
        ],
      });

      if (condo) {
        return res.status(400).send({
          status: "bad request",
          message: "Condominium already exists for this user",
        });
      }

      try {
        const condominio = new Condominium({
          alias: condominiumParams.alias,
          typeOfProperty: condominiumParams.typeOfProperty,
          phone: condominiumParams.phone,
          phone2: condominiumParams.phone2 ?? "",
          street_1: condominiumParams.street_1,
          street_2: condominiumParams.street_2,
          sector_name: condominiumParams.sector_name ?? "",
          availableUnits: condominiumParams.availableUnits,
          city: condominiumParams.city,
          province: condominiumParams.province,
          zipcode: condominiumParams.zipcode ?? "",
          country: condominiumParams.country,
          socialAreas: condominiumParams.socialAreas ?? [],
          mPayment: condominiumParams.mPayment,
          paymentDate: condominiumParams.paymentDate,
          createdBy: condominiumParams.user_id,
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

  getCondominiumById: function (req, res) {
    var params = req.body;

    try {
      var vel_idCondominio = !validator.isEmpty(params.id);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: error,
      });
    }

    Condominium.findOne({ _id: params.id }, (err, condominiumFound) => {
      var loginErrorHandlerArr = errorHandler.loginExceptions(
        err,
        condominiumFound
      );

      if (loginErrorHandlerArr[0]) {
        return res.status(loginErrorHandlerArr[1]).send({
          status: loginErrorHandlerArr[2],
          message: loginErrorHandlerArr[3],
        });
      }

      return res.status(200).send({
        status: "succes",
        condominium: condominiumFound,
      });
    });
  },
  CondominiumUpdate: async function (req, res) {
    // Si el usuario envia un archivo de imagen, se guarda en el servidor y se le asigna el nombre a la propiedad avatar
    let id = req.params.id;
    let params = req.body;

    try {
      const condominiumUpdated = await Condominium.findOneAndUpdate(
        { _id: id },
        params,
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
      let set_status = "inactive";

      if (condominiumFound.status === "inactive") {
        set_status = "active";
      }

      const condominiumDeleted = await Condominium.findByIdAndUpdate(
        condoId,
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
  getCondominiumsByAdmin: function (req, res) {
    let params = req.params.id;

    Condominium.find(
      {
        $and: [
          {
            $or: [
              { createdBy: params },
              { units_ownerId: mongoose.Types.ObjectId(params) },
            ],
          },
        ],
      },
      (err, condominiumFound) => {
        var errorHandlerArr = errorHandler.newUser(err, condominiumFound);

        if (errorHandlerArr[0]) {
          return res.status(errorHandlerArr[1]).send({
            status: errorHandlerArr[2],
            message: errorHandlerArr[3],
          });
        }
      }
    );
  },

  getBuildingDetails: async function (req, res) {
    const { id } = req.params;

    // Validar que el id exista y sea un ObjectId válido
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid or missing id parameter",
      });
    }

    try {
      const objectId = mongoose.Types.ObjectId(id);

      // Buscar condominios donde el id sea _id, createdBy o esté en units_ownerId
      const condominiums = await Condominium.find({
        $or: [
          { _id: objectId },
          { createdBy: objectId },
          { units_ownerId: { $in: [objectId] } },
        ],
      })
        .select("-__v") // excluir campos innecesarios
        .populate({
          path: "units_ownerId",
          match: { status: "active" },
          select:
            "availableUnits avatar name lastname gender email phone id_number status role familyAccount propertyDetails",
          populate: {
            path: "propertyDetails.addressId",
            select:
              "availableUnits alias phone street_1 street_2 sector_name city province zipcode country socialAreas status mPayment createdAt",
          },
        })
        .lean()
        .exec();

      if (!condominiums || condominiums.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "Condominium not found",
        });
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
          { units_ownerId: { $in: [mongoose.Types.ObjectId(id)] } },
          { createdBy: mongoose.Types.ObjectId(id) },
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
      const condominium = await Condominium.find()
        .populate({
          model: "Owner",
          path: "units_ownerId",
          match: { status: "active" },
          select: ` _id name lastname  email phone createdAt avatar`,
        })
        .select("-password")
        .exec();

      let storage = [];

      condominium.forEach((condo) => {
        let { units_ownerId, ...rest } = condo;

        for (const element of units_ownerId.flat()) {
          storage.push({
            _id: element["_id"],
            avatar: element["avatar"],
            name: element["name"],
            lastname: element["lastname"],
            email: element["email"],
            phone: element["phone"],
            createdAt: element["createdAt"],
          });
        }
        return storage;
      });

      const invoice = await Invoice.aggregate([
        {
          $match: {
            ownerId: { $in: storage.map((item) => item._id) },
            paymentStatus: "pending",
          },
        },
        {
          $group: {
            _id: "$ownerId",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
            invoice_paid_date: { $first: "$invoice_paid_date" },
          },
        },
        {
          $lookup: {
            from: "owners", // nombre de la colección en MongoDB, no el modelo Mongoose
            localField: "_id",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $unwind: "$owner",
        },
        {
          $project: {
            _id: 1,
            invoice_paid_date: 1,
            totalAmount: 1,
            count: 1,
            "owner._id": 1,
            "owner.name": 1,
            "owner.avatar": 1,
            "owner.lastname": 1,
            "owner.email": 1,
            "owner.phone": 1,
            "owner.createdAt": 1,
          },
        },
      ]);

      storage.forEach((item) => {
        const invoiceData = invoice.find((inv) => inv._id.equals(item._id));
        if (invoiceData) {
          item.totalAmount = invoiceData.totalAmount;
          item.count = invoiceData.count;
          item.invoice_paid_date = invoiceData.invoice_paid_date;
        } else {
          item.totalAmount = 0;
          item.count = 0;
          item.invoice_paid_date = null;
        }
      });

      return res.status(200).send({
        status: "success",
        message: storage,
      });
    } catch (error) {
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

      await Condominium.insertMany(params);
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
