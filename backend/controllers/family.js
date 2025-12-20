"use strict";

const Family = require("../models/family");
const Owner = require("../models/owners");
const Condominium = require("../models/condominio");
let fs = require("fs");
let path = require("path");
let validator = require("validator");
let bcrypt = require("bcrypt");
let saltRounds = 10;
const generatePassword = require("generate-password");
// Generar una contraseña con opciones específicas
const password = generatePassword.generate({
  length: 8, // Longitud de la contraseña
  numbers: true, // Incluir números
  symbols: true, // Incluir símbolos
  uppercase: true, // Incluir letras mayúsculas
  lowercase: true, // Incluir letras minúsculas
  excludeSimilarCharacters: true, // Excluir caracteres similares
});
const mongoose = require("mongoose");
const emailVerification = require("../service/generateVerification");
const wsConfirmationMessage = require("./whatsappController");
let checkExtensions = require("../service/extensions");

const familyController = {
  createAccount: async (req, res) => {
    let params = req.body;

    if (Boolean(req.files)) {
      params.avatar = req.file.filename;
    }

    try {
      var val_ownerId = !validator.isEmpty(params.ownerId);
      var val_addressId = !validator.isEmpty(params.addressId);
      var val_email = validator.isEmail(params.email);
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: "Missing data to send",
      });
    }

    if (val_ownerId && val_addressId && val_email) {
      const familyFound = await Family.findOne({
        $and: [{ email: params.email }, { ownerId: params.ownerId }],
      });

      if (familyFound) {
        // Eliminar la imagen subida si no se crea el usuario o si ya existe
        if (Boolean(req.file)) {
          await fs.unlinkSync(path.resolve(req.file.path));
        }
        return res.status(203).send({
          status: "error",
          message: "This email is already in use",
        });
      }

      try {
        const familyMember = new Family({
          avatar: params.avatar ?? "noimage.jpeg",
          name: params.name,
          lastname: params.lastname,
          gender: params.gender,
          email: params.email,
          password: password,
          phone: params.phone,
          createdBy: params.ownerId,
          propertyDetails: [
            {
              addressId: params.addressId,
              unit: params.unit,
            },
          ],
          accountAvailabilityDate: params.accountAvailabilityDate ?? null,
          accountExpirationDate: params.accountExpirationDate ?? null,
        });

        //Creamos al usuario
        const newMember = await familyMember.save();
        // Buscamos el condominio para enviar el nombre del condominio por whatsapp y correo
        let condoinfo = await Condominium.findById(
          mongoose.Types.ObjectId(params.addressId)
        )
          .select("alias")
          .lean();
        newMember.condominioName = condoinfo.alias;
        // Enviar correo de verificación
        emailVerification.verifyRegistration(newMember);
        // Enviar mensaje de confirmación por whatsapp
        wsConfirmationMessage.sendWhatsappMessage(newMember);
        return res.status(200).send({
          status: "success",
          message: newMember,
        });
      } catch (error) {
        // Eliminar la imagen subida si no se crea el usuario o si ya existe
        console.log("Error creating family member:", error);
        if (Boolean(req.file)) {
          await fs.unlinkSync(path.resolve(req.file.path));
        }
        return res.status(500).send({
          status: "error",
          message: "Missing params to create this user",
        });
      }
    }
  },
  getFamilyByOwnerId: async function (req, res) {
    let params = mongoose.Types.ObjectId(req.params.id);

    try {
      const familyFound = await Family.find({
        $and: [{ createdBy: params }, { delete: false }],
      })
        .select("-password")
        .populate({
          path: "propertyDetails.addressId",
          model: "Condominium",
          select:
            "alias type phone street_1 street_2 sector_name city province zipcode country socialAreas condominium_unit status",
        })
        .exec();

      if (!familyFound) {
        return res.status(404).send({
          status: "error",
          message: "Family not found",
        });
      }
      delete familyFound.password;
      return res.status(200).send({
        status: "success",
        message: familyFound,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },
  getFamilyMemberByCondoId: async function (req, res) {
    let params = req.params.condoId;

    const familyInfo = await Family.find({
      $and: [
        { "propertyDetails.addressId": { $in: [params] } },
        { delete: false },
      ],
    })
      .select("-password")
      .populate({
        path: "propertyDetails.addressId",
        model: "Condominium",
        select:
          "alias type phone street_1 street_2 sector_name city province zipcode country socialAreas condominium_unit",
      });

    if (!familyInfo) {
      return res.status(404).send({
        status: "error",
        message: "Family not found",
      });
    }

    return res.status(200).send({
      status: "success",
      message: familyInfo,
    });
  },
  authFamily: async function (req, res) {
    let params = req.body;

    // Buscamos al miembro de la familia por el id de la familia y el id de la propiedad
    const familyMember = await Family.findOne({
      $and: [
        { _id: params.familyId },
        { "propertyDetails.addressId": { $in: [params.propertyId] } },
      ],
    });

    if (familyMember.status === "inactive") {
      return res.status(200).send({
        status: "error",
        message: "Inactive user",
      });
    }

    // Actualizamos el estado de la familia: autorizado o no autorizado
    if (params.status === "authorized") {
      familyMember.propertyDetails[0].family_status = "unauthorized";
    } else {
      familyMember.propertyDetails[0].family_status = "authorized";
    }

    try {
      // Actualizamos el documento de la familia
      await Family.findOneAndUpdate(
        {
          $and: [
            { _id: params.familyId },
            { "propertyDetails.addressId": { $in: [params.propertyId] } },
          ],
        },
        familyMember,
        {
          new: true,
        }
      );

      return res.status(200).send({
        status: "success",
        message: familyMember,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },

  updateFamilyMember: async function (req, res) {
    let params = req.body;
    let allowExtension = ["jpg", "jpeg", "gif", "png"];

    // Verificamos si se subió una imagen
    if (Boolean(req.files.avatar)) {
      let { path, ...res } = req.files.avatar;
      let extension = path.split(".")[1];
      if (allowExtension.some((ext) => ext === extension)) {
        params.avatar = path.split("\\")[2];
      } else {
        return res.status(500).send({
          status: "error",
          message: "Invalid file extension",
        });
      }
    }

    try {
      var val_familyId = !validator.isEmpty(params.memberId);
      var val_addressId = !validator.isEmpty(params.addressId);
      var val_ownerId = !validator.isEmpty(params.ownerId);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Missing data to send",
      });
    }

    if (val_familyId && val_addressId && val_ownerId) {
      // Buscamos al miembro de la familia por el id de la familia y el id del propietario
      const member = await Family.findOne({
        $and: [{ _id: params.memberId }, { ownerId: params.ownerId }],
      }).populate({
        path: "ownerId",
        model: "Owner",
        select: "propertyDetails ",
      });

      // Si el miembro de la familia cambia a estatus inactivo, se desautoriza de todas las propiedades
      //**
      // En caso de que vuelva hacer activado, se debera autorizar nuevamente en las propiedades que desee
      // */
      if (params.memberStatus === "inactive") {
        member.propertyDetails.forEach((property) => {
          property.family_status = "unauthorized";
        });
        member.status = "inactive";
      } else {
        member.avatar = params.avatar;
        member.name = params.name;
        member.lastname = params.lastname;
        member.email = params.email;
        member.gender = params.gender;
        member.phone = params.phone;
        member.propertyDetails = [];

        // Si el addressId es un string, se busca la propiedad y se asigna a la familia
        if (typeof params.addressId === "string") {
          member.propertyDetails.push({
            addressId: params.addressId,
            unit: params.unit,
          });
        } else {
          // Si el addressId es un array, se busca las propiedades y se asigna a la familia
          params.addressId.forEach((condoID, index) => {
            member.propertyDetail = member.propertyDetails.filter(
              (condo) => condo.addressId === condoID
            );
          });
        }
      }

      try {
        // Actualizamos el documento de la familia
        await Family.findOneAndUpdate(
          {
            $and: [{ _id: params.memberId }, { ownerId: params.ownerId }],
          },
          member,
          {
            new: true,
          }
        );

        return res.status(200).send({
          status: "success",
          message: member,
        });
      } catch (error) {
        if (Boolean(req.files.avatar)) {
          await fs.unlinkSync(path.resolve(req.files.avatar.path));
        }
        return res.status(500).send({
          status: "error",
          message: "Server error, try again",
        });
      }
    }
  },
  hideFamilyMember: async function (req, res) {
    const id = req.params.id;

    try {
      // Buscamos al miembro de la familia por el id de la familia y actualizamos el campos delete a true
      const member = await Family.findById(id);
      member.delete = true;
      await Family.findByIdAndUpdate({ _id: id }, member, { new: true });

      return res.status(200).send({
        status: "success",
        message: "Member deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "error",
        message: "Server error, try again",
      });
    }
  },
};

module.exports = familyController;
