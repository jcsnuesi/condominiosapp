'use strict'

let validator = require('validator')
let bcrypt = require('bcrypt')
let saltRounds = 10;
let jwtoken= require('../service/jwt');
let checkExtensions = require('../service/extensions')
let errorHandler = require('../error/errorHandler')
let deactivatedOwner = require('../service/persistencia')
let verifyDataParam = require('../service/verifyParamData')
let Condominio = require('../models/condominio')
let Owner = require('../models/owners')
let Occupant = require('../models/occupant');
const occupant = require('../models/occupant');
const verifying = new verifyDataParam()
 
var ownerAndSubController = {

    createUser: async function (req, res) {

        if (req.user.role.toLowerCase() != 'admin') {

            return res.status(403).send({

                status: "forbidden",
                message: "You are not authorized"
            })
            
        }

        var params = req.body
     
        try {

            var val_email = verifying.hasEmail(params)
            var val_password = !validator.isEmpty(params.password)
            var val_phone = verifying.phonesConverter(params)

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


        if (val_email && val_password && val_phone) {


            Owner.findOne(
                {
                    $or: [                      
                        { email: params.email },
                        { phone: params.phone }

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

                    var property_details = {

                        addressId: "",
                        apartment: [],
                        parkingsQty: []

                    }
                      
                    for (const key in params) {
                    

                        if (key.includes('phone') && typeof ((params['phone']).split(',')) == 'object') {

                            user['phone'] = params['phone'].split(',').map(number => { return number.trim() })

                        } else if (key.includes("addressId") || key.includes("apartment") || key.includes("parkingsQty")){
        

                            if (key.includes('addressId')) {

                                property_details['addressId'] = (params[key].split(',')).length == 1 ? params[key] : (params[key].split(',')).map((info) => { return info })

                            } else if (key.includes('apartment')){

                                property_details['apartment'] = (params[key].split(',')).length == 1 ? params[key] : (params[key].split(',')).map((info) => { return info })


                            } else if (key.includes('parkingsQty')){

                                property_details['parkingsQty'] = (params[key].split(',')).length == 1 ? params[key] : (params[key].split(',')).map((info) => { return info })

                                user.propertyDetails.push(property_details)
                               
                            }
                          
                            
                            

                        } else {

                            user[key] = key != 'password' ? params[key].toLowerCase() : params[key]
                        }


                     
                    }

                   
                 
                    user.adminId.push(req.user.sub) 
                    
                    if (req.files != undefined) {

                        for (const fileKey in req.files) {
                            user[fileKey] = (req.files[fileKey].path.split('\\'))[2].toLowerCase()
                        }
                    }
               
           
                    const condominioFound = await Condominio.findOne({ _id: params.addressId })

                    condominioFound.owners.push(user._id)

                    await Condominio.findOneAndUpdate({ _id: params.addressId }, condominioFound, { new: true })

                    bcrypt.hash(params.password, saltRounds, (err, hash) => {

                        user.password = hash

                        if (err) {

                            return res.status(500).send({
                                status: 'error',
                                message: 'Encrypting error, please try again'
                            })

                        }

                        user.save((err, newUserCreated) => {

                            let verifyNewUserException = errorHandler.newUser(err, newUserCreated)

                            if (verifyNewUserException[1] == 200) {
                                verifyNewUserException[3].password = undefined
                            }

                            if (verifyNewUserException[0]) {

                                return res.status(verifyNewUserException[1]).send({
                                    status: verifyNewUserException[2],
                                    message: verifyNewUserException[3]

                                })

                            }


                        })

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

        try {

            var val_email = verifying.hasEmail(params)
            var val_password = !validator.isEmpty(params.password)
            var val_phone = verifying.phonesConverter(params)

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

        if (
            val_email  &&
            val_password &&
            val_phone
            ) {


            Occupant.findOne({email:params.email}, async (err, ownerFound) => {


                var errorHandlerArr = errorHandler.errorRegisteringUser(err, ownerFound)

                if (errorHandlerArr[0]) {

                    return res.status(

                        errorHandlerArr[1]).send({
                            status: 'error',
                            message: errorHandlerArr[2]

                        })

                }          
             
                const occupant = new Occupant()

                for (const key in params) {
                   
                    if (key.includes('phone')) {

                        occupant[key] = ((typeof ((params['phone']).split(',')) == 'object') ? params['phone'].split(',').map(number => { return number.trim() }) : params['phone'].trim())
                        
                    }else{

                        occupant[key] = key != 'password' ? params[key].toLowerCase() : params[key]

                    }
                    
                }
         
                if (req.files != undefined) {
                    occupant['avatar'] = (req.files['avatar'].path.split('\\'))[2]
                }               
                
               const owner = await Owner.findOne({ _id:req.user.sub})

                owner.occupantId.push({occupant:occupant._id})
            
                
               const ownerUpdated = await Owner.findOneAndUpdate({ _id: req.user.sub }, owner, {new:true})
               
                if (!ownerUpdated) {


                    return res.status(500).send({
                        status: 'error',
                        message: 'Owner not updated'
                    })
                    
                }

               
                

               bcrypt.hash(params.password, saltRounds,(err, hash) => {

                   
                   if (err) {

                       return res.status(500).send({
                           status: 'error',
                           message: 'Error encrypting'
                       })
                       
                }

                
                   occupant.password = hash

                   occupant.save((err, account_saved) => {


                       if (err) {

                           return res.status(500).send({
                               status: 'error',
                               message: 'Error saving'
                           })

                       }


                       return res.status(200).send({

                           status: "success",
                           message: account_saved
                })

                   })


              
               })
             
                


            })
            
        }else{

            return res.status(500).send({
                status: 'error',
                message: 'Fill out all fields'
            })

        }
        
    },   
    
    ownerByAdim: async function (req, res) {

       
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








    }


};

module.exports = ownerAndSubController;