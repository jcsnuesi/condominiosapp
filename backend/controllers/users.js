'use strict'

let validator = require('validator')
let bcrypt = require('bcrypt')
let saltRounds = 10;
let path = require('path')
let fs = require('fs')
let jwtoken = require('../service/jwt')
let checkExtensions = require('../service/extensions')
let verifyDataParam = require('../service/verifyParamData')
let userCreaterModel = require('../models/userCreater')
let errorHandler = require('../error/errorHandler')
let Admin = require('../models/admin')
let Staff = require('../models/staff')
let Owner = require('../models/owners')
let Condominio = require('../models/condominio')
let Occupant = require('../models/occupant')
let deactivatedOwner = require('../service/persistencia')
let backup = require('../models/accountsDeleted');
const { throws } = require('assert');
const uuid = require('uuid')
const mailer = require('nodemailer')
var jwebtoken = require('../service/jwt')


var controller = {

    verify: function(req, res){

        var params = req
       
        if (req?.params?.id) {

         Admin.findOneAndUpdate(
             { _id: params.emailTokensVelidation.id },
             { verified: true},
             {new:true},
             (err, emailVeried) => {

                   
                    if (err) {

                        return res.status(500).send({

                            status: "error",
                            message: "Server error!"

                        })
                        
                    }

                    return res.status(200).send({

                        status: "success",
                        message: "verified"

                    })
                })

           
            
        }
        
        const transporter = mailer.createTransport({
            service:'gmail',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'jcsnuesi@gmail.com',
                pass: 'flzu iyrl zhbw brak'
            }
        });

     
        // Enviar correo electrónico de verificación
        const enlaceVerificacion = `http://localhost:3993/api/verify/${params}`;
        const mensajeCorreo = `Por favor, haz clic en el siguiente enlace para verificar tu cuenta: ${enlaceVerificacion}`;

        const mailOptions = {
            from: 'jcsnuesi@gmail.com' ,
            to: 'kapeg19192@roborena.com',
            subject: 'Verificación de cuenta',
            text: mensajeCorreo
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error al enviar el correo de verificación');
            } else {
                console.log('Correo de verificación enviado: ' + info.response);
                // res.status(200).send('Por favor, verifica tu correo electrónico para completar el registro.');
            }
        });

      
    },
    createUser: async function (req, res) {

        var params = req.body        
             
        const verifying = new verifyDataParam()
     
        try {
            
            var val_password = !validator.isEmpty(params.password)
            var val_phone = verifying.phonesConverter(params)
            var val_terms = !validator.isEmpty(toString(params.terms))
            var val_email = verifying.hasEmail(params)

            if (val_phone.name == 'Error' || val_email.name == 'Error') {

                return res.status(400).send({

                    status: "bad request",
                    message: "All fields required",
                    details: {
                       phone_valitation: val_phone.message,
                        email_valitation: val_email.message
                    }
                })
                
            }

           
        } catch (error) {

            return res.status(400).send({

                status: "bad request",
                message: "All fields required",
                details: val_phone.message
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

    
        
       
        if (val_email && val_password && val_phone && val_terms) {


            Admin.findOne(
                {
                    $or: [
                        { company: params.company },
                        { email_company: params.email },
                        { phone: params.phone }

                    ]
                }, (err, userDuplicated) => {

                    var errorHandlerArr = errorHandler.errorRegisteringUser(err, userDuplicated)

                  
                    if (errorHandlerArr[0]) {

                        return res.status(

                            errorHandlerArr[1]).send({
                                status: 'error',
                                message: errorHandlerArr[2]

                            })

                    }

                 

                    //Instanciamos el usuario segun el tipo de usuario
                    let user = new Admin()
                
                 
                    for (const key in params) {

                        if (key.includes('phone') && typeof ((params['phone']).split(',')) == 'object') {

                            user['phone'] = params['phone'].split(',').map(number => { return number.trim() })

                        } else if(key.includes('terms')){
                            
                            user[key] = params[key]

                        }else{
                            user[key] = key != 'password' ? params[key].toLowerCase() : params[key]
                        }

                    }

                               
                    var contactPerson = {

                        name_contact: params['name_contact'].toLowerCase(),
                        lastname_contact: params['lastname_contact'].toLowerCase(),
                        gender_contact: params['gender_contact'].toLowerCase(),
                        email_contact: params['email_contact'].toLowerCase(),
                        phone_contact: ((typeof ((params['phone_contact']).split(',')) == 'object') ? params['phone_contact'].split(',').map(number => { return number.trim() }) : params['phone_contact'].trim()),
                        role_contact: params['role_contact'].toLowerCase()
                    }

                    user.contact_person.push(contactPerson)

                

                    if (Object.keys(req.files) .length != 0) {

                        for (const fileKey in req.files) {
                            user[fileKey] = (req.files[fileKey].path.split('\\'))[2]
                        }

                    }else{

                        user.avatar = 'noimage.jpeg'
                    }


                    if (user.terms == false) return res.status(403).send({ status: 'forbidden', message: "Terms must be accept to complete the contract" })

                   


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

                            var newUuid = uuid.v4();
                         
                            var paylaod = {
                                uid: newUuid,
                                id: newUserCreated._id
                           }
                     
                           
                           const emailToken = jwebtoken.emailVerification(paylaod)

                            
                            controller.verify(emailToken)
                            
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

    login: async function (req, res) {

        let params = req.body

        try {
            var val_email = validator.isEmail(params.email)
            var val_password = !validator.isEmpty(params.password)

        } catch (error) {

            return res.status(500).send({
                status: 'error',
                message: 'Missing data'
            })
        }


        if (val_email && val_password) {

            const userFound = await Promise.all([
                Admin.findOne({ email_company: params.email }),
                Staff.findOne({ email: params.email }),
                Owner.findOne({ email: params.email }),
                Occupant.findOne({ email: params.email }),
            ])

            let foundUser = null;

            const response = userFound.some(user => {

                if (user) {
                    foundUser = user;
                    return true;

                }
                return false

            });

            if (response == false) {

                return res.status(404).send({

                    status: "error",
                    message: "Account not found"
                })
            }



            if (foundUser?.status?.includes("inactive")) {

                return res.status(403).send({

                    status: "error",
                    message: "Account terminated"
                })

            }


            bcrypt.compare(params.password, foundUser.password, (err, verified) => {


                if (verified) {

                    //Generar token jwt y devolverlo
                    if (params.gettoken) {


                        return res.status(200).send({
                            token: jwtoken.createToken(foundUser)

                        })

                    } else {

                        //Limpiar el objeto para que no se muestre el resultado de la password
                        foundUser.password = undefined;


                        //Devolver datos

                        return res.status(200).send({
                            status: 'success',
                            message: foundUser

                        });

                    }


                } else {

                    return res.status(200).send({
                        message: "Invalid credentials."
                    });
                }


            })



        } else {

            return res.status(401).send({
                status: "error",
                message: "Fill out all fields."
            });
        }


    },

    reactiveAccount:function(req, res){

     Admin.findOneAndUpdate({_id:req.body.id},
        {status:'active'},
        {new:true},
        (err, actived) => {

            if (err) {
                
                return res.status(500).send({
                    status: 'error',
                    message: 'Fill out all fields'
                })
            }
            if (!actived) {
                
                return res.status(404).send({
                    status: 'error',
                    message: 'User not found'
                })
            }

            return res.status(200).send({
                status: 'success',
                message: 'User reactived'
            })


        })

    },

    update: function (req, res) {

        var params = req.body
                       
        Admin.findOne(
            { _id: params._id }, (err, accountFound) => {

                
                var errorHandlerArr = errorHandler.loginExceptions(err, accountFound)

                if (errorHandlerArr[0]) {

                    return res.status(errorHandlerArr[1]).send({
                        status: 'error',
                        message: (errorHandlerArr[2])
                    })

                }

             
                
                /**
                 * -Campos permitidos para modificar:
                 *  Avatar
                 *  Telefonos
                 *  Direccion
                 * - Persona de contacto (todos sus campos)
                 *  
                 * -Acceso a la plataforma
                 *      Email
                 *      Password
                 * 
                 */

         
                for (const key in params) {

            
                accountFound[key] = params[key]
                   
                    
                }

                if (req.files.avatar) {
                    accountFound['avatar'] = (req.files.avatar.path).split('\\')[2]
                }

                var contactPerson = {

                    name_contact: params['name_contact'].toLowerCase(),
                    lastname_contact: params['lastname_contact'].toLowerCase(),
                    gender_contact: params['gender_contact'].toLowerCase(),
                    email_contact: params['email_contact'].toLowerCase(),
                    phone_contact: ((typeof ((params['phone_contact']).split(',')) == 'object') ? params['phone_contact'].split(',').map(number => { return number.trim() }) : params['phone_contact'].trim()),
                    role_contact: params['role_contact'].toLowerCase()
                }

                accountFound.contact_person[0] = contactPerson
           

                Admin.findOneAndUpdate({ _id: params._id }, accountFound, { new: true }, (err, updated) => {

                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: 'Server error, please try again'
                        })

                    }
                   
         
                    return res.status(200).send({
                        status: 'success',
                        message: updated
                    })
                })


                

            })


    },

    suspendedAccount: async function (req, res) {

        Admin.findOneAndUpdate(
            { _id: req.body.id }, 
            { status: 'suspended' }, 
            { new: true }, 
            (err, updated) => {
              
                
            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Server, please try again'
                })

            }

            
            return res.status(200).send({
                status: 'success',
                message: updated.status
            })
        })
        
        



    },
    deleteOwner: async function (req, res) {


        var params = req.body


        Owner.findOne({ _id: params.id }, async (err, ownerFound) => {


            if (err) {

                return res.status(500).send({

                    status: "error",
                    message: "Server error"
                })

            }

            if (!ownerFound) {

                return res.status(404).send({

                    status: "error",
                    message: "User was not found"
                })

            }


            if (!ownerFound.adminId.includes(req.user.sub)) {

                return res.status(400).send({

                    status: "forbidden",
                    message: "You are not authorized"
                })

            }

            /// ELIMINAR OWNER DEL CONDOMINIO
            const condominio = await Condominio.findOne({ _id: params.idCondominio })

            condominio.owners.splice(condominio.owners.indexOf(params.idCondominio), 1)
            const condominioUpdated = await Condominio.findOneAndUpdate({ _id: params.idCondominio }, condominio, { new: true })

         


            ownerFound.adminId.splice(ownerFound.adminId.indexOf(req.user.sub), 1)
            const ownerUpdated = await Owner.findOneAndUpdate({ _id: params.id }, ownerFound, { new: true })




            return res.status(200).send({

                status: "success",
                message: ownerUpdated
            })

        })



    },
    avatar: async function (req, res) {


        var params = req.files.avatar
        var fileName = params.path.split('\\')[2]


        //verificar la extension de archivo enviado sea tipo imagen
        var imgFormatAccepted = checkExtensions.confirmExtension(req)

        if (imgFormatAccepted == false) {

            return res.status(400).send({

                status: "bad request",
                message: "Files allows '.jpg', '.jpeg', '.gif', '.png'"
            })
        }

        Admin.findOneAndUpdate({ _id: req.user.sub }, { avatar: fileName }, { new: true }, (err, updated) => {

            if (err) {


                return res.status(500).send({

                    status: "bad request",
                    message: "Avatar was not updating, try again."
                })

            }

            return res.status(200).send({

                status: 'success',
                message: updated
            })

        })




    }, 
    getAdmins:function(req, res){

        Admin.find().exec((err, admins) => {

          
            if (err) {

                return res.status(500).send({
                    status:'success',
                    message:'server error, try again'
                })
                
            }

            if (Object.keys(admins).length == 0) {

                return res.status(404).send({
                    status: 'success',
                    message: 'no users found'
                })
                
            }

            admins.forEach(admin => {
                delete admin.password;
            });
          
            const adm = admins.map(keys => {
               
                keys.password =  null
               
                           
                return keys

            });


            return res.status(200).send({
                status: 'success',
                message: adm
            })
        })


    },
    getAdminById:function (req, res) {
        
        let params = req.params.id

        Admin.findOne({_id:params}, (err, customer) => {

            if (err) {

                return res.status(500).send({

                    status: 'error',
                    message: err
                })

                
            }
            if (!customer) {

                return res.status(404).send({

                    status: 'error',
                    message: 'User not found'
                })

                
            }
            customer.password = undefined
            return res.status(200).send({

                status: 'success',
                message: customer
            })


        })
    },
    getAvatar:function(req, res){

        var imgName = req.params.fileName
        var paths = './uploads/users/' + imgName
          
        if (fs.existsSync(paths)) {

            return res.sendFile(path.resolve(paths))

        } else {

            return res.status(404).send({

                status: "error",
                message: "Image does not exits"
            })
        }

       
    }  
    


}

module.exports = controller