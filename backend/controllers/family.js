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

      let query = typeof params.addressId === 'string' ? [params.addressId] : params.addressId
 
      const {  propertyDetails, ...ownerdata} = await Owner.findOne({
        $and: [
          { _id: params.ownerId },
          { "propertyDetails.addressId": { $in: query } }
        ]
      });

      let condoInfoId = {addressId:"", unit:""}
      const familyMember = new Family();

      propertyDetails.forEach((property) => {
        condoInfoId.addressId = property.addressId,
        condoInfoId.unit = property.condominium_unit
        familyMember.propertyDetails.push(condoInfoId)
      });
      
      delete params.addressId;
      for (const key in params) {
        familyMember[key] = params[key];
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
  getFamilyByOwnerId: function (req, res) {
    let params = req.params.id;

    Family.find({
      ownerId: params,
    })
      .select("-password")
      .populate({
        path: "propertyDetails.addressId",
        model: "Condominium",
        select:
          "alias type phone street_1 street_2 sector_name city province zipcode country socialAreas condominium_unit",
      })   
      .populate({
        path: "ownerId",
        model: "Owner",
        select: "name lastname email propertyDetails",
        populate: {
          path: "propertyDetails.addressId",
          model: "Condominium",
          select: "alias type phone street_1 street_2 sector_name city province zipcode country socialAreas condominium_unit",
        },
      })
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
        delete familyFound.password;
        return res.status(200).send({
          status: "success",
          message: familyFound,
        });
      });
  },
  getFamilyMemberByCondoId: async function (req, res) {
    let params = req.params.condoId;

    const familyInfo = await Family.find({
      "propertyDetails.addressId": { $in: [params] },
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

    if (Boolean(req.files.avatar)) {
      let { path, ...res } = req.files.avatar;
      params.avatar = path.split("\\")[2];
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
      const member = await Family.findOne({
        $and: [{ _id: params.memberId }, { ownerId: params.ownerId }],
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
      }else{
        member.name = params.name;
        member.lastname = params.lastname;
        member.email = params.email;
        member.gender = params.gender
        member.phone = params.phone;

        let propertyDetail = {               
          addressId: "",
          condominium_unit:  ""            
         
        }
        let condos = params.addressId.split(",")
        condos.pop()
        let unitss = params.unit.split(",")
        unitss.pop()

        member.propertyDetails = []

        propertyDetail.addressId = condos.find((con) =>  con)
        member.propertyDetails.push(propertyDetail)
       
          
       //  TERMINAR EL METODO PARA AGREGAR LAS UNIDADES Y LAS PROPIEDADES
        console.log(condos)
        // console.log(condos.pop())
        // console.log(condos)
        return 


              params.addressId.split(",").splice(-1,1).forEach((condo, index) => {
                params.unit.split(",").splice(-1,1).forEach((unt, index) => {
                  if (index === 0) {
                    propertyDetail.push({               
                      addressId: element.condo,
                      condominium_unit:  ""            
                     
                    }) = element;
                  } else {
                    propertyDetails.condominium_unit = element;
                  }
                });
                
              });
             
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

    console.log(params);
  },
};

module.exports = familyController;
