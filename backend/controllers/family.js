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
const emailVerification = require("../service/verificators");
const wsConfirmationMessage = require("./whatsappController");

const familyController = {
  createAccount: async (req, res) => {
    let params = req.body;

    if (Boolean(req.files.avatar)) {
      let { path, ...res } = req.files.avatar;
      params.avatar = path.split("\\")[2];
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
        if (Boolean(req.files.avatar)) {
          await fs.unlinkSync(path.resolve(req.files.avatar.path));
        }
        return res.status(203).send({
          status: "error",
          message: "This email is already in use",
        });
      }

      const familyMember = new Family();

      for (const key in params) {
        if (key == "addressId") {
          familyMember["propertyDetails"].push({
            addressId: params.addressId,
            unit: params.unit,
          });
        } else {
          familyMember[key] = params[key];
        }
      }

      let newMember;
      // asignamos una contraseña temporal
      familyMember.password = password;

      try {
        //Creamos al usuario
        newMember = await familyMember.save();
        // Buscamos el condominio para enviar el nombre del condominio por whatsapp y correo
        let condoinfo = await Condominium.findById(params.addressId);
        newMember.condominioName = condoinfo.alias;
        // Enviar correo de verificación
        emailVerification.verifyRegistration(newMember);
        // Enviar mensaje de confirmación por whatsapp
        wsConfirmationMessage.sendWhatsappMessage(newMember);
      } catch (error) {
        // Eliminar la imagen subida si no se crea el usuario o si ya existe
        if (Boolean(req.files.avatar)) {
          await fs.unlinkSync(path.resolve(req.files.avatar.path));
        }
        return res.status(500).send({
          status: "error",
          message: "Missing params to create this user",
        });
      }

      return res.status(200).send({
        status: "success",
        message: newMember,
      });
    }
  },
};

module.exports = familyController;
