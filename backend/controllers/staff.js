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

let deactivatedOwner = require('../service/persistencia')
let backup = require('../models/accountsDeleted');
const { v4: uuidv4 } = require('uuid');
const verifyClass = require('../service/verifyParamData')


var StaffController = {

    createStaff: function(req,res){

        var params = req.body
        var optionToVerify = new verifyClass()
         
        try {

            var val_name = !validator.isEmpty(params.name)
            var val_lastname = !validator.isEmpty(params.lastname)
            var val_email = validator.isEmail(params.email)
            var val_password = !validator.isEmpty(params.password)
            var val_phone = optionToVerify.phonesConverter(params)

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
                message: "System just accept image format '.jpg', '.jpeg', '.gif', '.png'"
            })
        }



        if (val_name && val_lastname && val_email && val_password && val_phone) {
            
        
            Staff.findOne({
                $or: [

                    { email: params.email },
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


               const admin = await Admin.findOne({ _id: req.user.sub })
            

                for (const key in params) {

                    if (key.includes('phone') && params[key].split(',') == 'object') {

                        staffAcc['phone'] = params[key].split(',').map(phoneNumber => { return phoneNumber.strim() })

                    }else{

                        staffAcc[key] = (key != 'password') ? params[key].toLowerCase() : params[key]

                    }

                }
            
                
                if (req.files != undefined) {
                    staffAcc['avatar'] = (req.files['avatar'].path.split('\\'))[2]
                }

                admin.staff.push(staffAcc)
                Admin.findOneAndUpdate({ _id: req.user.sub }, admin, { new: true }).then((success) => console.log({ status: 'success', message: 'Staff added to admin' })).catch(err => { return res.status(501).send({status:'error', message:'Staff was not added to admin'})})


                bcrypt.hash(params.password, saltRounds, (err, hash) => {

                staffAcc.password = hash

                staffAcc.save(async (err, staffSaved) => {


                    if (err) {

                        return res.status(501).send({
                                status: 'error',
                                message: 'Staff was not create, try again'


                            })
                    }

                    staffSaved.password = undefined
                    return res.status(200).send({
                            status: 'success',
                        message: staffSaved


                        })

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
    update:function(req, res){

        Staff.findOne({ _id: req.user.sub }, async (err, stafFound) => {

            
            if (err || (stafFound).length <= 0 || stafFound == undefined || stafFound == null) {

                return res.status(501).send({
                    status: 'error',
                    message: 'STAFF does not found'


                })

            }

            for (const key in req.body) {
               
                stafFound[key] = (key != 'password') ? req.body[key].toLowerCase() : stafFound[key]
            }

         
            stafFound.password = await bcrypt.hash(req.body.password, saltRounds, (err, hash) => { return hash })

            Staff.findOneAndUpdate({ _id: req.user.sub }, stafFound, { new: true }, (err, staffUpdated) => {

                var errorHandlerArr = errorHandler.update(err, staffUpdated)

                if (errorHandlerArr[0]) {

                    return res.status(
                        errorHandlerArr[1]).send({
                            status: errorHandlerArr[2],
                            message: errorHandlerArr[3]

                        })

                }


                return res.status(200).send({
                        status: 'success',
                    message: staffUpdated

                    })
           
            })

        })
       
        
    },
    avatar: function (req, res) {


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

        Staff.findOneAndUpdate({ _id: req.user.sub }, { avatar: fileName }, { new: true }, (err, updated) => {

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


        Admin.find({_id:req.user.sub}).populate('staff', 'avatar name lastname gender email phone position status role').exec((err, staffs) => {


            if (err || !staffs) {
                

                return res.status(501).send({

                    status: "error",
                    message: "Staffs was not found"
                })
            }

                    
            
            return res.status(200).send({

                status: "success",
                message: staffs[0].staff
            })

        })
    
    }
     


}

module.exports = StaffController;