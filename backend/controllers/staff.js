'use strict'

var validator = require('validator')
var fs = require('fs')
var path = require('path')
let bcrypt = require('bcrypt')
let saltRounds = 10;
var Staff = require('../models/staff')
var Admin = require('../models/admin')
let errorHandler = require('../error/errorHandler')
let checkExtensions = require('../service/extensions')
const { v4: uuidv4 } = require('uuid');
const verifyClass = require('../service/verifyParamData')
const sendEmailVerification = require('../service/emailVerification')


var StaffController = {

    createStaff: function(req,res){

        var params = req.body
        var optionToVerify = new verifyClass()
        
       
        try {

            var val_name = !validator.isEmpty(params.name)
            var val_lastname = !validator.isEmpty(params.lastname)
            var val_email = validator.isEmail(params.email)
            var val_password = !validator.isEmpty(params.password)
            var val_phone = optionToVerify.phonesTransformation(params.phone)

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
        //         message: "System just accept image format '.jpg', '.jpeg', '.gif', '.png'"
        //     })
        // }

       

        if (val_name && val_lastname && val_email && val_password && val_phone) {
            
                   
            Staff.findOne({
                $or: [

                    { email: params.email },
                    { government_id: params.government_id },
                    { phone: params.phone }

                ]
            }, async (err, staffound) => {

                
                var errorHandlerArr = errorHandler.errorRegisteringUser(err, staffound, params)

                if (errorHandlerArr[0]) {

                    return res.status(
                        errorHandlerArr[1]).send({
                            status: 'error',
                            message: errorHandlerArr[2]


                        })

                }

                var staffAcc = new Staff()               
              
                for (const key in params) {

                    if (key == 'password' || key == 'permissions'){
                        continue;
                    }
                    staffAcc[key] = params[key].toLowerCase() 

                }
                // Se le asigna el id del admin que lo creo
                staffAcc.createdBy = req.user.sub

                // Se asignan los permisos
                params.permissions.split(',').forEach(element => {
                    staffAcc.permissions.push(element)
                })
                
                // if (Boolean(req.files.avatar != undefined ) ) {
                //     staffAcc['avatar'] = (req.files['avatar'].path.split('\\'))[2]
                // }

                staffAcc.password = await bcrypt.hash(params.password, saltRounds)
                
                staffAcc.save(async (err, staffSaved) => {


                    if (err) {

                        return res.status(501).send({
                            status: 'error',
                            message: 'Staff was not create, try again',
                            errors: err

                        })
                    }

                    // // Se busca el admin y se le agrega el staff
                    // var admin = await Admin.findOne({ _id: req.user.sub })
                    // admin.staff.push(staffSaved._id)

                    // await Admin.findOneAndUpdate({ _id: req.user.sub }, admin, { new: true })

                    staffSaved.password = undefined

                    try {

                        sendEmailVerification.verifyRegistration(staffSaved.email)

                    } catch (error) {

                        return res.status(500).send({
                            status: 'error',
                            message: error


                        })

                    }


                    return res.status(200).send({
                        status: 'success',
                        message: staffSaved


                    })

                })
            })
                
           



        }else{

            return res.status(400).send({

                status: "bad request",
                message: "Missing required fields"
            })

        }

    },    
    update:async function(req, res){

        try {

            const staffId = req.params.staffId;
            const stafFound = await Staff.findOne({ _id: staffId });

            if (!stafFound) {
                return res.status(404).send({
                    status: 'error',
                    message: 'STAFF not found'
                });
            }

            const avatarExist = fs.existsSync('../uploads/staff/' + stafFound.avatar) ? true : false;
            
            if (!avatarExist) {
                fs.unlinkSync('../uploads/staff/' + stafFound.avatar);
            }

            for (const key in req.body) {

                if (key !== 'password') {
                    stafFound[key] = req.body[key].toLowerCase();
                }

            }

            if (req.body.password) {
                stafFound.password = await bcrypt.hash(req.body.password, saltRounds);
            }

            const staffUpdated = await Staff.findOneAndUpdate({ _id: staffId }, stafFound, { new: true });

            if (!staffUpdated) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error updating staff'
                });
            }

            

            return res.status(200).send({
                status: 'success',
                message: staffUpdated
            });

        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Server error',
                error: err
            });
        }
        
    },
    getAvatar: function (req, res) {


        var avatarParams = req.params.avatar
        var filePath = './uploads/staff/' + avatarParams
       

        fs.access(filePath, fs.constants.F_OK, (err, exist) => {

            if (err) {
                console.error(`${filePath} does not exist ${err}`);
              
            } else {
              
                return res.sendFile(path.resolve(filePath))
                
            }
        });


    },
    delete:async function(req, res){

       
        var params = req.body
       
        
        if (req.user.role.toLowerCase() != 'admin') {

            return res.status(403).send({

                status: "forbidden",
                message: "Denied"
            })
            
        }

        // Hacer el bloque de codigo para eliminar del Schema ADMIN

        if (params.permanent) {


            Staff.findOne({ _id: params.id }, async (err, staff) => {

                if (err) {

                    res.status(500).send({

                        status: 'error',
                        message: 'Staff could not be deleted'
                    })
                    
                }
       
               
                if (!staff) {
                    
                    res.status(404).send({

                        status: 'error',
                        message: 'Staff not found'
                    })
                }

                const admin = await Admin.findOne({ _id: req.user.sub })
                admin.staff.splice(admin.staff.indexOf(staff._id), 1) 

                const adminUpdated = await Admin.findOneAndUpdate({ _id: req.user.sub }, admin, {new:true})

                if (!adminUpdated) {

                    res.status(404).send({

                        status: 'error',
                        message: 'Admin does not upload'
                    })
                    
                }else{
                    
                    await Staff.findOneAndDelete({ _id: params.id })
                    res.status(200).send({

                        status: 'success',
                        message: 'Staff deleted permanently'
                    })

                }

              
               
           
            })

        }else{
  
            Staff.findOneAndUpdate({ _id: params.id }, { status: 'inactive' }, {new:true}, (err, deleted) => {

                if (err) {

                    return res.status(500).send({

                        status: 'error',
                        message: 'Error deleting'
                    })
                    
                }

                return res.status(200).send({

                    status: 'success',
                    message: deleted
                })


            })



        }

       
    },
    getStaffByAdmin:function(req,res){
     
        
        Staff.find({ createdBy:req.user.sub},(err, staffs) => {

          
            if (err || !staffs) {
                

                return res.status(501).send({

                    status: "error",
                    message: "Staffs was not found"
                })
            }
                    
                console.log(staffs)
            return res.status(200).send({

                status: "success",
                message: staffs
            })

        })
    
    }
     


}

module.exports = StaffController;