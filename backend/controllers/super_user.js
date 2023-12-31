'use strict'

let validator = require('validator')
let bcrypt = require('bcrypt')
let saltRounds = 10;
let path = require('path')
let fs = require('fs')
let jwtoken = require('../service/jwt')
let verifyDataParam = require('../service/verifyParamData')
let errorHandler = require('../error/errorHandler')
let SUPERUSERMODEL = require('../models/super_user')

var SUPERUSER = {


    create: function(req, res){

        var params = req.body

        try {

            var email_val = validator.isEmail(params.email)
            var password_val = !validator.isEmpty(params.password)
            var phone_val = !validator.isEmpty(params.phone)
            
        } catch (error) {


            return res.status(400).send({

                status: "bad request",
                message: "All fields required"
            })
            
        }


        if (
            email_val &&
            password_val &&
            phone_val
        ) {

            SUPERUSERMODEL.findOne({$or:[
                { email: params.email },
                {phone: params.phone}
            ]},  (err, user) => {


                if (err) {

                    return res.status(500).send({

                        status: "error",
                        message: "Server error, try again"
                    })
                    
                }

                if (user) {

                    return res.status(500).send({

                        status: "error",
                        message: "User already exit"
                    })
                    
                }


                const user_user = new SUPERUSERMODEL()

                for (const key in params) {
                    user_user[key] = key != 'password' ? params[key].toLowerCase() : params[key]
                }

                if (req.files != undefined) {

                    for (const fileKey in req.files) {
                        user[fileKey] = (req.files[fileKey].path.split('\\'))[2]
                    }
                }

                bcrypt.hash(params.password, saltRounds, async  (err,hash)=>{
                    
                    user_user.password = hash

                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: 'Encrypting error, please try again'
                        })

                    }

               const super_user_created = await user_user.save()

                    if (super_user_created) {

                            return res.status(200).send({
                                status: 'success',
                                message: super_user_created
                            })
            
                    }else{

                            return res.status(501).send({
                                status: 'error',
                                message: 'Server error, user was not found'
                            })


                    }



                })
            })
            
        }else{


            return res.status(501).send({
                status: 'error',
                message: 'Check all fields out'
            })

        }
    },
    login: function(req, res){

        var params = req.body

        try {

            var email_val = validator.isEmail(params.email)
            var password_val = !validator.isEmpty(params.password)
         
        } catch (error) {


            return res.status(400).send({

                status: "bad request",
                message: "All fields required"
            })

        }

        if (
            
            email_val &&
            password_val
        ) {

            SUPERUSERMODEL.findOne({ email: params.email }, (err, superuser) => {

                if (err) {

                    return res.status(501).send({

                        status: "error",
                        message: "Server error, try again"
                    })
                    
                }


                if (!superuser) {

                    return res.status(404).send({

                        status: "error",
                        message: "User does not exits"
                    })
                    
                }

                bcrypt.compare(params.password, superuser.password, (err, verified) => {

                    if (err) {
                        
                        return res.status(500).send({

                            status: "error",
                            message: "Error verifying password"
                        })
                    }

                    if (!verified) {
                        
                        return res.status(500).send({

                            status: "error",
                            message: "Password was not verify"
                        })
                    }


                    if (verified) {

                        //Generar token jwt y devolverlo
                        if (params.gettoken) {


                            return res.status(200).send({

                                token: jwtoken.createToken(superuser)

                            })

                        } else {

                            //Limpiar el objeto para que no se muestre el resultado de la password
                            superuser.password = undefined;


                            //Devolver datos

                            return res.status(200).send({
                                status: 'success',
                                message: superuser

                            });

                        }


                    } else {

                        return res.status(200).send({
                            message: "Invalid credentials."
                        });
                    }


                })

              


            })
            
        }
    }



}

module.exports = SUPERUSER;