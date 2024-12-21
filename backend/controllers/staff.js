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
const sendEmailVerification = require('../service/verificators')
const generatePassword = require('generate-password');
const Owner = require('../models/owners');
const Family = require('../models/family');
// Generar una contraseña con opciones específicas
const password = generatePassword.generate({
    length: 8,       // Longitud de la contraseña
    numbers: true,    // Incluir números
    symbols: true,    // Incluir símbolos
    uppercase: true,  // Incluir letras mayúsculas
    lowercase: true,  // Incluir letras minúsculas
    excludeSimilarCharacters: true,  // Excluir caracteres similares
});

var StaffController = {

    createStaff: function(req,res){

        var params = req.body
      
        var optionToVerify = new verifyClass()  
          
     
        try {

            var val_name = !validator.isEmpty(params.name)
            var val_lastname = !validator.isEmpty(params.lastname)
            var val_email = validator.isEmail(params.email)
            var val_phone = optionToVerify.phonesTransformation(params.phone)

        } catch (error) {

            return res.status(400).send({

                status: "bad request",
                message: "All fields required"
            })

        }

        // Image settings

        let avatarPath = req.files.avatar.path
        let avatarFullname = avatarPath.split("\\")[2]
        params.avatar = avatarFullname

       
        //verificar la extension de archivo enviado sea tipo imagen
        var imgFormatAccepted = checkExtensions.confirmExtension(req)

        if (imgFormatAccepted == false) {

            return res.status(400).send({

                status: "bad request",
                message: "System just accept image format '.jpg', '.jpeg', '.gif', '.png'"
            })
        }

     
        if (val_name && val_lastname && val_email  && val_phone) {
            
                   
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

                    if(typeof params[key] == 'string'){

                        staffAcc[key] = params[key].toLowerCase() 
                    }else{
                        staffAcc[key] = params[key]
                    }

                }

            
                // Se le asigna el id del admin que lo creo
                staffAcc.createdBy = req.user.sub              

                // // Se asignan los permisos
                // const permission = params.permissions.split(',')
                // permission.pop()              
                // permission.forEach(element => {
                //     staffAcc.permissions.push(element)
                // })
                
                // if (Boolean(req.files.avatar != undefined ) ) {
                //     staffAcc['avatar'] = (req.files['avatar'].path.split('\\'))[2]
                // }

                staffAcc.password = await bcrypt.hash(password, saltRounds)
             
                
               
                staffAcc.save(async (err, staffSaved) => {

                    if (err) {

                        return res.status(501).send({
                            status: 'error',
                            message: 'Staff was not create, try again',
                            errors: err

                        })
                    }
                   

                    try {

                      
                        sendEmailVerification.StaffRegistration({email:staffSaved.email, password:password})
                        
                        staffSaved.password = undefined

                        return res.status(200).send({
                            status: 'success',
                            message: staffSaved


                        })

                    } catch (error) {

                        return res.status(500).send({
                            status: 'error',
                            message: error


                        })

                    }

                    

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
        
        let staffParams = req.body;
        const avatarPath = req?.files?.avatar?.path?.split('\\')[2];
        var filePath = null;

        if (Boolean(avatarPath != undefined)) {
            staffParams.avatar = avatarPath;
            filePath = './uploads/staff/' + avatarPath;
        }

    
          
        try {          
       
       
            let stafFound = await Staff.findOne({ _id: staffParams._id });
            
            
            if (Boolean(staffParams.currentPassword != undefined)) {
                var passChecked = await bcrypt.compare(staffParams.currentPassword, stafFound.password)             

                if (passChecked) {
                    staffParams.password = await bcrypt.hash(staffParams.password, saltRounds)
                    console.log("passChecked", staffParams.password)
                } else {
                    return res.status(400).send({
                        status: 'error',
                        message: 'Password incorrect'
                    });
                }
            }

            if (!stafFound) {

                this.unlikeImage(filePath);
                return res.status(404).send({
                    status: 'error',
                    message: 'STAFF not found'
                });
            }

            
            for (const key in staffParams) {

                if (key != 'password') {
                    stafFound[key] = staffParams[key].toLowerCase();
                } 
                

            }

            stafFound.password = staffParams.password;


            const staffUpdated = await Staff.findOneAndUpdate({ _id: staffParams._id }, stafFound, { new: true });
            staffUpdated.password = undefined;
       

            return res.status(200).send({
                status: 'success',
                message: staffUpdated
            });

        } catch (err) {
            if (Boolean(avatarPath != undefined)) this.unlikeImage(filePath);
           
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
        Staff.findOneAndUpdate({ _id: params._id }, { status: 'inactive' }, { new: true }, (err, deleted) => {

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

        
        

       
    },
    deleteBatch: async function (req, res) {
    
        try {

            const updateData = req.body;
            const userIds = updateData.map(user => user._id); // Extraer los IDs de los usuarios a eliminar del cuerpo de la solicitud


            if (!Array.isArray(updateData) || userIds.length === 0) {
                return res.status(400).send({ message: 'No se proporcionaron IDs válidos' });
            }
            // Realizar la eliminación por lotes
            const result = await Staff.updateMany({ _id: { $in: userIds } }, { status: 'inactive' }, { new: true });

            if (result.deletedCount === 0) {
                return res.status(404).send({ 
                    status: 'error',
                    message: 'No se encontraron usuarios para eliminar' });
            }       
            
            return res.status(200).send({ 
                status: 'success',
                message: 'Usuarios eliminados correctamente', 
                deletedCount: result.deletedCount 
            });

                
        } catch (err) {
            console.error('Error en la eliminación:', err);
            return res.status(500).send({ message: 'Error en la petición' });
        }
    },
    getStaffByOwnerAndCondoId:async function(req,res){

        let _user = req.params.ownerId
        const user = await Promise.all([Owner.findOne({ _id: _user }).exec(),
        Family.find({ _id: _user }).exec()])

      
        const condosId = user.map((userinfo) => {
            return userinfo.propertyDetails
        
        });

        
        let [obj1, ...resto] = condosId.flat(2)
        
        console.log(obj1)
        return
        try {

         

          

            console.log(condosId)

            
        } catch (error) {
            console.log(error)
            
        }
       
        
    }
    ,getStaffByCondoId:async function(req,res){
     
        let _id = req.params.id
        
        Staff.find({           
            condo_id: _id
        }).populate('condo_id', 'alias')
          .exec((err, staffs) => {
     
          
            if (err || !staffs) {                

                return res.status(501).send({

                    status: "error",
                    message: "Staffs was not found"
                })
            }  
                
           // Ocultamos la password
            for (const index in staffs) {
             
                staffs[index].password = undefined

             }
                       
            return res.status(200).send({

                status: "success",
                message: staffs
            })

        })
    
    },
    getStaffByAdmin:async function(req,res){
     
        let _id = req.params.id
   
        Staff.find({           
            createdBy: _id
        }).populate('condo_id', 'alias')
        .exec((err, staffs) => {

          
            if (err || !staffs) {                

                return res.status(501).send({

                    status: "error",
                    message: "Staffs was not found"
                })
            }  
                
           // Ocultamos la password
            for (const index in staffs) {
             
                staffs[index].password = undefined

             }
                       
            return res.status(200).send({

                status: "success",
                message: staffs
            })

        })
    
    },
    unlikeImage: function (filePath){
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error al eliminar el archivo: ${err.message}`);
            } else {
                console.log('Archivo eliminado correctamente.');
            }
        });
    }, 
    verifyPasswordStaff: async function (req, res) {

        let params = req.body;

        if (params.currentPassword.length < 8) {
            return res.status(400).send({
                status: 'error',
                message: 'Password too long'
            });
        }    
        
        
    
        try {

            let staffInfo = await Staff.findOne({
                _id: params._id
            });

          
            var passChecked = await bcrypt.compare(params.currentPassword, staffInfo.password)

       
            if(passChecked){
                return res.status(200).send({
                    status: 'success',
                    message: 'Password correct'
                }); 
            }else{
                return res.status(400).send({
                    status: 'error',
                    message: 'Wrong password'
                });
            }
            
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                message: error
            });
            
        }
    }
     


}

module.exports = StaffController;