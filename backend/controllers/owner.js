'use strict'

let bcrypt = require('bcrypt');
let saltRounds = 10;
let jwtoken= require('../service/jwt');
let checkExtensions = require('../service/extensions');
let errorHandler = require('../error/errorHandler');
let deactivatedOwner = require('../service/persistencia');
let verifyDataParam = require('../service/verifyParamData');
let Condominio = require('../models/condominio');
let Owner = require('../models/owners');
let Family = require('../models/family');
const occupant = require('../models/occupant');
const verifying = new verifyDataParam();
let validator = require('validator');
let emailVerification = require('../service/emailVerification');
const { getAvatar } = require('./condominio');
const fs = require('fs');
const paths = require('path');
const generatePassword = require('generate-password');
const wsConfirmationMessage = require('./whatsappController')

// Generar una contraseña con opciones específicas
const password = generatePassword.generate({
    length: 8,       // Longitud de la contraseña
    numbers: true,    // Incluir números
    symbols: true,    // Incluir símbolos
    uppercase: true,  // Incluir letras mayúsculas
    lowercase: true,  // Incluir letras minúsculas
    excludeSimilarCharacters: true,  // Excluir caracteres similares
});

 
var ownerAndSubController = {

    emailVerification: function (req, res) {

        Owner.findOne({ email: req.params.email }, (err, userFound) => {

            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Server error, try again'
                })
            }

            if (!userFound) {

                return res.status(404).send({
                    status: 'error',
                    message: 'User not found'
                })
            }

            userFound.emailVerified = true

            Owner.findOneAndUpdate({ email: req.params.email }, userFound, { new: true }, (err, userUpdated) => {

                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'Server error, try again'
                    })
                }

                if (!userUpdated) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'User not updated'
                    })
                }

                return res.status(200).send({

                    status: 'success',
                    verified: userFound.emailVerified
                })

            })

        })
    },

    createSingleOwner: async function (req, res) {


        var params = req.body        
     
        try {

            var val_email = validator.isEmail(params.email)
            var val_phone = verifying.phonesTransformation(params.phone)
            var val_id_number = !validator.isEmpty(params.id_number)

            // Validamos que el condominio exista antes de crear al usuario        
            var condominioFound = await Condominio.findOne({ _id: params.addressId })

        } catch (error) {
          
            return res.status(400).send({

                status: "bad request",
                message: "All fields required"
            })

        }
      
        //verificar la extension de archivo enviado sea tipo imagen
        var imgFormatAccepted = checkExtensions.confirmExtension(req)
        

        if (imgFormatAccepted == false) {

            return res.status(400).send({

                status: "bad request",
                message: "Files allows '.jpg', '.jpeg', '.gif', '.png'"
            })
        }

     
        if (val_email && val_phone  && val_id_number) {

          

            Owner.findOne(
                {
                    $and: [                      
                        { email: params.email },
                        { id_number: params.id_number }

                    ]
                },async (err, userDuplicated) => {

            
                    var errorHandlerArr = errorHandler.errorRegisteringUser(err, userDuplicated)

                    if (errorHandlerArr[0]) {

                        return res.status(
                            errorHandlerArr[1]).send({
                                status: 'error',
                                message: errorHandlerArr[2]


                            })

                    }

                    //Instanciamos el usuario segun el tipo de usuario
                    let user = new Owner()
                 
                    try {

                        for (const key in params) {

                            if (key == 'propertyDetails') {
                                continue
                            }else{
                                user[key] = params[key].toLowerCase()

                            }
                        }

                        var property_details = {

                            addressId: "",
                            condominium_unit: "",
                            parkingsQty: "",
                            isRenting: false,

                        }

                        // # Me quede aqui
                        property_details.addressId = params.addressId
                        property_details.condominium_unit = params.apartmentUnit
                        property_details.parkingsQty = params.parkingsQty
                        property_details.isRenting = params.isRenting
                        user.propertyDetails.push(property_details)
                        user.password = await bcrypt.hash(password, saltRounds)

                        if (Object.keys(req.files).length != 0) {
                         
                            user["avatar"] = (req.files['avatar'].path.split('\\'))[2]
                         
                            
                        }


                        await user.save()
                        condominioFound.units_ownerId.push(user._id)
                        await Condominio.findOneAndUpdate({ _id: params.addressId }, { units_ownerId: condominioFound.units_ownerId }, { new: true })
                        
                        user.passwordTemp = password
                        user.condominioName = condominioFound.alias
                        emailVerification.verifyRegistration(user)
                        wsConfirmationMessage.sendWhatsappMessage(user)
                        
                        
                    } catch (
                        error
                    ) {
                        console.log(error)
                        return res.status(500).send({
                            status: 'error',
                            message: 'Missing params to create this user',
                            error:error
                        })
                    }


                    return res.status(200).send({
                            status: 'success',
                            message: 'User created successfully'

                        })
                                 

                })


        } else {

            return res.status(500).send({
                status: 'error',
                message: 'Fill out all fields'
            })
        }
        
        
    }, 
    
    secundaryAcc: function(req, res) {

        if (req.user.role.toLowerCase() != 'owner') {

            return res.status(403).send({

                status: "forbidden",
                message: "You are not authorized"
            })

        }

        var params = req.body

        if (req.user.email == params.email) {

            return res.status(403).send({

                status: "forbidden",
                message: "Main account cannot be the same as the secondary account"
            })
            
        }


      

        try {

            var val_email = validator.isEmail(params.email)
            var val_password = !validator.isEmpty(params.password)
            var val_phone = verifying.phonesTransformation(params.phone)

        } catch (error) {

            return res.status(400).send({

                status: "bad request",
                message: "All fields required"
            })

        }

      
        //verificar la extension de archivo enviado sea tipo imagen
        // var imgFormatAccepted = checkExtensions.confirmExtension(req)
      
        // if (imgFormatAccepted == false) {

        //     return res.status(400).send({

        //         status: "bad request",
        //         message: "Files allows '.jpg', '.jpeg', '.gif', '.png'"
        //     })
        // }

        if (
            val_email  &&
            val_password &&
            val_phone
            ) {


            Family.findOne({$and:[
                { email: params.email },
                { phone: params.phone }
            ]
            }, async (err, familyFound) => {


                var errorHandlerArr = errorHandler.errorRegisteringUser(err, familyFound)

                if (errorHandlerArr[0]) {

                    return res.status(

                        errorHandlerArr[1]).send({
                            status: 'error',
                            message: errorHandlerArr[2]

                        })

                }  
                
                if (familyFound) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'Owner not updated'
                    })

                }

             
                var family_model = new Family()

                for (const key in params) {
                   
                    if (key == 'password' || key == 'addressId'){
                        continue;
                    }else{

                        family_model[key] = params[key].toLowerCase() 
                       
                    }
                    
                }
                const fCondominioId = {
                   
                    condominioId: ""
                }

                fCondominioId.condominioId = params.addressId
                family_model.addressId.push(fCondominioId)
                
                // if (Object.keys(req.files).length != 0) {
                //     family_model['avatar'] = (req.files['avatar'].path.split('\\'))[2]
                // }              
               
              
                try {

                    const tempPass = '12345678'
                    family_model.password = await bcrypt.hash(tempPass, saltRounds)
                    var newMember = await family_model.save()

                    const owner = await Owner.findOne({ _id: req.user.sub }).populate('propertyDetails.addressId', 'alias')
                   
                    // Buscarmos el id correspondiente a la propiedad que se le dara acceso
                    let addressInfo = owner.propertyDetails.filter(prop => prop.addressId._id == params.addressId)[0]

                    // Alias del condominio
                    var { addressId } = addressInfo
                 
                    owner.familyAccount.push(family_model._id)
                    Owner.findOneAndUpdate({ _id: req.user.sub }, owner, { new: true })
                  
                    family_model.passwordTemp = tempPass
                    family_model.condominioName = addressId.alias
                    emailVerification.verifyRegistration(family_model)
                    wsConfirmationMessage.sendWhatsappMessage(family_model)

                    
                } catch (error) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'Missing params to create this user'
                    })
                    
                }

                return res.status(200).send({
                    status: 'success',
                    message: newMember
                })



            })
            
        }else{

            return res.status(500).send({
                status: 'error',
                message: 'Fill out all fields'
            })

        }
        
    },   
    getFamily: function(req, res) {
      
            if (req.user.role.toLowerCase() != 'owner') {
    
                return res.status(403).send({
    
                    status: "forbidden",
                    message: "You are not authorized"
                })
    
            }
    
         
        Family.find({ ownerId: req.user.sub })
            .populate('addressId.condominioId', 'alias type phone street_1 street_2 sector_name city province zipcode country  status createdAt').exec((err, familyFound) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Server error, try again"
                })
            }

            if (!familyFound) {
                return res.status(404).send({
                    status: "error",
                    message: "Family not found"
                })
            }

            return res.status(200).send({
                status: "success",
                message: familyFound
            })

        })
    },

    addFamilyProperty: function(req, res) {

      
       
        if (req.user.role.toLowerCase() != 'owner') {

            return res.status(403).send({

                status: "forbidden",
                message: "You are not authorized"
            })
        }

        var params = req.body

        Family.findOne({ _id: params.id__ }, async (err, familyFound) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Server error, try again"
                })
            }

            if (!familyFound) {
                return res.status(404).send({
                    status: "error",
                    message: "Family not found"
                })
            }

            const fCondominioId = {
                condominioId: ""
            }

            fCondominioId.condominioId = params.addressId
            familyFound.addressId.push(fCondominioId)
            await Family.findOneAndUpdate({ _id: params.__id }, familyFound, { new: true })

            return res.status(200).send({
                status: "success",
                message: familyFound
            })

        })
    },
    ownerByAdmin: async function (req, res) {

       
        if (req.user.role.toLowerCase() != 'admin') {

            return res.status(403).send({
                status: "forbidden",
                message: "You are not authorized"
            })
            
        }
       
        Owner.find({ adminId: req.user.sub })
            .populate('occupantId.occupant', 'avatar name lastname gender email phone role status')
            .populate('propertyDetails.addressId', 'avatar alias type phone street_1 street_2 sector_name city province zipcode country socialAreas status').exec((err,found) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Server error, try again"
                })
            }


            return res.status(200).send({
                status: "success",
                message: found
            })

        })
        
       
        
    }, 
    update: function (req, res) {

        const allow = ['owner','occupant']
      
        if (!allow.includes(req.user.role.toLowerCase())) {
            return res.status(403).send({

                status: "forbidden",
                message: "Not authorized"
            })
        }

        var params = req.body
        var user = {owner : Owner,
                    occupant: Occupant}
          

             
        user[params.account].findOne({ email: req.user.email},(err, userFound) => {
      
            
            if (err) {
                
                return res.status(500).send({

                    status: "error",
                    message: "Server error, try again"
                })
            }
            if (!userFound) {
                
                return res.status(404).send({

                    status: "error",
                    message: "User was not found"
                })
            }

            for (const key in params) {
        
                userFound[key] = key != 'id_number' ? params[key] : userFound[key] 
            }

        
            user[params.account].findOneAndUpdate({ email: req.user.email},userFound,{new:true}, (err, updated) => {

                if (err) {

                    return res.status(500).send({

                        status: "error",
                        message: "Server error updating, try again"
                    })
                }

                if (!updated) {

                    return res.status(304).send({

                        status: "error",
                        message: "User was not updated, check all field out and try again"
                    })
                    
                }

                return res.status(200).send({

                    status: "success",
                    message: updated
                })


            })


        })


      
        

    
        


    },
    deleteOccupantByOwner:function(req,res){

        const allow = ['owner', 'occupant']

        if (!allow.includes(req.user.role.toLowerCase())) {
            
            return res.status(403).send({

                status: "forbidden",
                message: "Not authorized"
            })
        }

        var params = req.body
        
        Owner.findOne({_id:req.user.sub}, async (err,owerFound)=>{

            var errorHandlerArr = errorHandler.loginExceptions(err, owerFound)
            
            if (errorHandlerArr[0]) {
                
                return res.status(errorHandlerArr[1]).send({
                    status: errorHandlerArr[2],
                    message: errorHandlerArr[3]
                })
                
            }
            
            var queriesResponses = owerFound.occupantId.map(async (occupants, index) => {

                if (occupants.occupant == params.id) {

                    const ownerOccupant =  await Occupant.findOne({ _id: params.id })  
                    ownerOccupant.status = 'inactive'
                    owerFound.occupantId.splice(index, 1)

                    return await Promise.all([

                        Occupant.findOneAndUpdate({ _id: params.id }, ownerOccupant, { new: true }),
                        Owner.findOneAndUpdate({ _id: req.user.sub }, owerFound, { new: true })

                    ]).then(([acc,ow])=>{ return acc})
                }

                return [false]
            })
            
          

            if (queriesResponses[0] == false) {


                return res.status(501).send({

                    status: "error",
                    message: "Occupant was not deleted, try again"
                })
                
            }

            const occupantDel = await queriesResponses[0]

            return res.status(200).send({

                status: "success",
                message: occupantDel
            })
           
           
          
           
        })

    },
    getAvatar: function (req, res) {
        console.log(req.params.avatar)
        var file = req.params.avatar
        var path_file = './uploads/owner/' + file

        if (fs.existsSync(path_file)) {

            return res.sendFile(paths.resolve(path_file))

        } else {

            return res.status(404).send({

                status: "error",
                message: "Image does not exits"
            })
        }

    },

    getCondominiumByOwnerId: function (req, res) {

        Owner.find({ _id: req.user.sub })
            .populate('propertyDetails.addressId', 'avatar alias phone street_1 street_2 sector_name city province zipcode country socialAreas mPayment status mPayment createdAt')
            .exec((err, condominiumFound) => {

                var errorHandlerArr = errorHandler.newUser(err, condominiumFound)

                if (errorHandlerArr[0]) {

                    return res.status(

                        errorHandlerArr[1]).send({
                            status: errorHandlerArr[2],
                            message: errorHandlerArr[3]
                        })

                }


            })
        // 654af792af898fdd1ea3a266

    },

};

module.exports = ownerAndSubController;