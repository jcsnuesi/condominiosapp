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
let emailVerification = require("../service/verificators");
const fs = require("fs");
const paths = require("path");
const generatePassword = require("generate-password");
const wsConfirmationMessage = require("./whatsappController");
var mongoose = require("mongoose");
const assert = require("assert");

// Generar una contraseña con opciones específicas
const password = generatePassword.generate({
  length: 8, // Longitud de la contraseña
  numbers: true, // Incluir números
  symbols: true, // Incluir símbolos
  uppercase: true, // Incluir letras mayúsculas
  lowercase: true, // Incluir letras minúsculas
  excludeSimilarCharacters: true, // Excluir caracteres similares
});

var ownerAndSubController = {
  emailVerification: function (req, res) {
    Owner.findOne({ email: req.params.email }, (err, userFound) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Server error, try again",
        });
      }

      if (!userFound) {
        return res.status(404).send({
          status: "error",
          message: "User not found",
        });
      }

      userFound.emailVerified = true;

      Owner.findOneAndUpdate(
        { email: req.params.email },
        userFound,
        { new: true },
        (err, userUpdated) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Server error, try again",
            });
          }

          if (!userUpdated) {
            return res.status(500).send({
              status: "error",
              message: "User not updated",
            });
          }

          return res.status(200).send({
            status: "success",
            verified: userFound.emailVerified,
          });
        }
      );
    });
  },
  createSingleOwner: async function (req, res) {
    var params = req.body;
    let pathName = null;

    // console.log("params", params);
    // return;

    try {
      var val_email = validator.isEmail(params.email);
      var val_phone = verifying.phonesTransformation(params.phone);
      var val_id_number = !validator.isEmpty(params.id_number);

      // Validamos que el condominio exista antes de crear al usuario
      // var condominioFound = await Condominio.findOne({ _id: params.addressId });
    } catch (error) {
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    // Si el usuario envia un archivo de imagen, se guarda en el servidor y se le asigna el nombre a la propiedad avatar
    if (Boolean(req.files.avatar)) {
      let { path, ...res } = req.files.avatar;
      pathName = path.split("\\")[2];
      params.avatar = pathName;
    }

    //verificar la extension de archivo enviado sea tipo imagen
    var imgFormatAccepted = checkExtensions.confirmExtension(req);

    if (imgFormatAccepted == false) {
      return res.status(400).send({
        status: "bad request",
        message: "Files allows '.jpg', '.jpeg', '.gif', '.png'",
      });
    }

    if (val_email && val_phone && val_id_number) {
      Owner.findOne(
        {
          $or: [{ email: params.email }, { id_number: params.id_number }],
        },
        async (err, userDuplicated) => {
          var errorHandlerArr = errorHandler.errorRegisteringUser(
            err,
            userDuplicated
          );

          // console.log("userDuplicated", userDuplicated._id);
          if (userDuplicated) {
            const propertyFound = userDuplicated.propertyDetails.some(
              (property) =>
                property.addressId == params.addressId &&
                property.condominium_unit == params.apartmentsUnit
            );

            if (propertyFound) {
              return res.status(400).send({
                status: "error",
                message: "This unit is already assigned to another owner",
              });
            } else {
              let propertyDetails = {
                body: {
                  ownerId: userDuplicated._id,
                  addressId: params.addressId,
                  unit: params.apartmentsUnit,
                  parkingsQty: params.parkingsQty,
                },
              };

              const propertyUpdating = await ownerAndSubController.addOwnerUnit(
                propertyDetails,
                null
              );
              // console.log("propertyUpdating", propertyUpdating);
              if (propertyUpdating.code == 200) {
                return res.status(propertyUpdating.code).send({
                  status: propertyUpdating.status,
                  message: propertyUpdating.message,
                });
              }
              if (propertyUpdating.code == 500) {
                return res.status(propertyUpdating.code).send({
                  status: propertyUpdating.status,
                  message: propertyUpdating.message,
                });
              }
            }

            if (errorHandlerArr[0]) {
              return res.status(errorHandlerArr[1]).send({
                status: "error",
                message: errorHandlerArr[2],
              });
            }
            delete params._id;
            delete params.status;
            try {
              //Instanciamos el usuario segun el tipo de usuario
              let user = new Owner();

              for (const key in params) {
                user[key] = params[key].toLowerCase();
              }

              var property_details = {
                addressId: params.addressId,
                condominium_unit: params.apartmentsUnit,
                parkingsQty: params.parkingsQty,
                isRenting: false,
              };

              user.propertyDetails.push(property_details);
              user.password = await bcrypt.hash(password, saltRounds);

              await user.save();
              condominioFound.units_ownerId.push(user._id);
              // Este código elimina la unidad asignada de la lista de unidades disponibles
              // 1. Encuentra el índice de la unidad (params.apartmentsUnit) en el array availableUnits
              // 2. Elimina 1 elemento en esa posición usando splice()
              // Esto se hace porque una vez que se asigna una unidad a un propietario,
              // ya no debe estar disponible para otros
              condominioFound.availableUnits.splice(
                condominioFound.availableUnits.indexOf(params.apartmentsUnit),
                1
              );
              await Condominio.findOneAndUpdate(
                { _id: params.addressId },
                condominioFound,
                { new: true }
              );

              user.passwordTemp = password;
              user.condominioName = condominioFound.alias;
              emailVerification.verifyRegistration(user);
              wsConfirmationMessage.sendWhatsappMessage(user);
            } catch (error) {
              console.log(error);
              return res.status(500).send({
                status: "error",
                message: "Missing params to create this user",
                error: error,
              });
            }

            return res.status(200).send({
              status: "success",
              message: "User created successfully",
            });
          }
        }
      );
    } else {
      return res.status(500).send({
        status: "error",
        message: "Fill out all fields",
      });
    }
  },

  getOwnerByIdentifier: async function (req, res) {
    let identifier = req.params.keyword;
    console.log("identifier", identifier);
    if (Boolean(identifier == undefined)) {
      return res.status(400).send({
        status: "bad request",
        message: "All fields required",
      });
    }

    try {
      const owner = await Owner.findOne({
        $or: [{ email: identifier }, { id_number: identifier }],
      })
        .select("-password")
        .select(" name lastname email phone id_number avatar ");

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

  getFamily: function (req, res) {
    Family.find({ ownerId: "66f84833006341d7843b4127" })
      .populate(
        "addressId.condominioId",
        "alias type phone street_1 street_2 sector_name city province zipcode country  status createdAt"
      )
      .exec((err, familyFound) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Server error, try again",
          });
        }

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
      });
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
          $push: { units_ownerId: params.ownerId },
        },
        { new: true }
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
          status: "success",
          message: "Unit assigned successfully",
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
      var val_newUnit = !validator.isEmpty(params.newUnit);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }

    if (val_ownerId && val_propertyId && val_unit && val_newUnit) {
      try {
        await Owner.findOneAndUpdate(
          {
            $and: [
              { _id: params.ownerId },
              { "propertyDetails.condominium_unit": params.unit },
            ],
          },
          {
            $set: {
              "propertyDetails.$.condominium_unit": params.newUnit,
            },
          },
          { new: true }
        );
        await Condominio.findOneAndUpdate(
          { _id: params.propertyId },
          { $pull: { availableUnits: params.newUnit } },
          { new: true }
        );
        await Condominio.updateOne(
          { _id: params.propertyId },
          { $push: { availableUnits: params.unit } },
          { new: true }
        );

        return res.status(200).send({
          status: "success",
          message: "Unit updated successfully",
        });
      } catch (error) {
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
          { $push: { availableUnits: params.unit } },
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

    // var user = { owner: Owner, family: Family };

    try {
      await Owner.findOneAndUpdate(
        { _id: params._id },
        { status: params.status },
        { new: true }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "User deleted successfully",
    });
  },
  getAvatar: function (req, res) {
    var file = req.params.avatar;
    var path_file = "./uploads/owners/" + file;
    console.log("path_file", path_file);
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
    console.log("ownerId", ownerId);

    try {
      const ownerCondo = await Owner.findOne({ _id: ownerId }).populate({
        path: "propertyDetails.addressId",
        model: "Condominium",
        select:
          " avatar availableUnits alias phone street_1 street_2 sector_name city province zipcode country socialAreas mPayment status mPayment createdAt",
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
            ownerId: mongoose.Types.ObjectId(id),
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
          $match: { memberId: mongoose.Types.ObjectId(id) },
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
        ownerId: mongoose.Types.ObjectId(id),
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
