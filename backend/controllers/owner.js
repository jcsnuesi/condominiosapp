"use strict";

let bcrypt = require("bcrypt");
let saltRounds = 10;
let jwtoken = require("../service/jwt");
let checkExtensions = require("../service/extensions");
let errorHandler = require("../error/errorHandler");
let deactivatedOwner = require("../service/persistencia");
let verifyDataParam = require("../service/verifyParamData");
let Condominio = require("../models/condominio");
let Owner = require("../models/owners");
let Family = require("../models/family");
const occupant = require("../models/occupant");
const verifying = new verifyDataParam();
let validator = require("validator");
let emailVerification = require("../service/verificators");
const { getAvatar } = require("./condominio");
const fs = require("fs");
const paths = require("path");
const generatePassword = require("generate-password");
const wsConfirmationMessage = require("./whatsappController");
const { model } = require("mongoose");

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

    try {
      var val_email = validator.isEmail(params.email);
      var val_phone = verifying.phonesTransformation(params.phone);
      var val_id_number = !validator.isEmpty(params.id_number);

      // Validamos que el condominio exista antes de crear al usuario
      var condominioFound = await Condominio.findOne({ _id: params.addressId });
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

          if (errorHandlerArr[0]) {
            return res.status(errorHandlerArr[1]).send({
              status: "error",
              message: errorHandlerArr[2],
            });
          }
          delete params._id;
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
      );
    } else {
      return res.status(500).send({
        status: "error",
        message: "Fill out all fields",
      });
    }
  },

  // secundaryAcc: function (req, res) {
  //   var params = req.body;

  //   if (req.user.email == params.email) {
  //     return res.status(403).send({
  //       status: "forbidden",
  //       message: "Main account cannot be the same as the secondary account",
  //     });
  //   }

  //   try {
  //     var val_email = validator.isEmail(params.email);
  //     var val_phone = verifying.phonesTransformation(params.phone);
  //   } catch (error) {
  //     return res.status(400).send({
  //       status: "bad request",
  //       message: "All fields required",
  //     });
  //   }

  //   //verificar la extension de archivo enviado sea tipo imagen
  //   // var imgFormatAccepted = checkExtensions.confirmExtension(req)

  //   // if (imgFormatAccepted == false) {

  //   //     return res.status(400).send({

  //   //         status: "bad request",
  //   //         message: "Files allows '.jpg', '.jpeg', '.gif', '.png'"
  //   //     })
  //   // }

  //   if (val_email && val_password && val_phone) {
  //     Family.findOne(
  //       { $and: [{ email: params.email }, { phone: params.phone }] },
  //       async (err, familyFound) => {
  //         var errorHandlerArr = errorHandler.errorRegisteringUser(
  //           err,
  //           familyFound
  //         );

  //         if (errorHandlerArr[0]) {
  //           return res.status(errorHandlerArr[1]).send({
  //             status: "error",
  //             message: errorHandlerArr[2],
  //           });
  //         }

  //         if (familyFound) {
  //           return res.status(500).send({
  //             status: "error",
  //             message: "Owner not updated",
  //           });
  //         }

  //         var family_model = new Family();

  //         for (const key in params) {
  //           if (key == "password" || key == "addressId") {
  //             continue;
  //           } else {
  //             family_model[key] = params[key].toLowerCase();
  //           }
  //         }
  //         const fCondominioId = {
  //           condominioId: "",
  //         };

  //         fCondominioId.condominioId = params.addressId;
  //         family_model.addressId.push(fCondominioId);

  //         // if (Object.keys(req.files).length != 0) {
  //         //     family_model['avatar'] = (req.files['avatar'].path.split('\\'))[2]
  //         // }

  //         try {
  //           const tempPass = "12345678";
  //           family_model.password = await bcrypt.hash(tempPass, saltRounds);
  //           var newMember = await family_model.save();

  //           const owner = await Owner.findOne({ _id: req.user.sub }).populate(
  //             "propertyDetails.addressId",
  //             "alias"
  //           );

  //           // Buscarmos el id correspondiente a la propiedad que se le dara acceso
  //           let addressInfo = owner.propertyDetails.filter(
  //             (prop) => prop.addressId._id == params.addressId
  //           )[0];

  //           // Alias del condominio
  //           var { addressId } = addressInfo;

  //           owner.familyAccount.push(newMember._id);
  //           await Owner.findOneAndUpdate({ _id: req.user.sub }, owner, {
  //             new: true,
  //           });

  //           family_model.passwordTemp = tempPass;
  //           family_model.condominioName = addressId.alias;
  //           emailVerification.verifyRegistration(family_model);
  //           wsConfirmationMessage.sendWhatsappMessage(family_model);
  //         } catch (error) {
  //           return res.status(500).send({
  //             status: "error",
  //             message: "Missing params to create this user",
  //           });
  //         }

  //         return res.status(200).send({
  //           status: "success",
  //           message: newMember,
  //         });
  //       }
  //     );
  //   } else {
  //     return res.status(500).send({
  //       status: "error",
  //       message: "Fill out all fields",
  //     });
  //   }
  // },

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
        { $pull: { availableUnits: params.unit } },
        { new: true }
      );
      return res.status(200).send({
        status: "success",
        message: "Unit assigned successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },
  ownerByAdmin: async function (req, res) {
    if (req.user.role.toLowerCase() != "admin") {
      return res.status(403).send({
        status: "forbidden",
        message: "You are not authorized",
      });
    }

    Owner.find({ adminId: req.user.sub })
      .populate(
        "occupantId.occupant",
        "avatar name lastname gender email phone role status"
      )
      .populate(
        "propertyDetails.addressId",
        "avatar alias type phone street_1 street_2 sector_name city province zipcode country socialAreas status"
      )
      .exec((err, found) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Server error, try again",
          });
        }

        return res.status(200).send({
          status: "success",
          message: found,
        });
      });
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
    console.log("params", params);

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
    var path_file = "./uploads/owner/" + file;
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

  getCondominiumByOwnerId: function (req, res) {
    const user = { owner: Owner, family: Family };
    let param = req.params.ownerId;
    let userModel = "";

    if (param.includes("properties")) {
      userModel = user["owner"];
      param = param.split("-")[0];
    } else {
      userModel = user[req.user.role.toLowerCase()];
      param = req.user.sub;
    }

    userModel
      .find({ _id: param })
      .select("-password")
      .populate({
        path: "propertyDetails.addressId",
        model: "Condominium",
        select:
          " avatar availableUnits alias phone street_1 street_2 sector_name city province zipcode country socialAreas mPayment status mPayment createdAt",
      })
      .exec((err, condominiumFound) => {
        var errorHandlerArr = errorHandler.newUser(err, condominiumFound);
        console.log("errorHandlerArr", condominiumFound);
        if (errorHandlerArr[0]) {
          return res.status(errorHandlerArr[1]).send({
            status: errorHandlerArr[2],
            message: errorHandlerArr[3],
            errors: err,
          });
        }
      });
  },
};

module.exports = ownerAndSubController;
