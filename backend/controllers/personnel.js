'use strict'

let jwt = require('jwt-simple');
let bcrypt = require('bcrypt');
let salt = 10;
let Personnel = require('../models/personnel')
let validation = require('validator')

var personnelController = {

    createPersonnel: async function name(req, res) {

        var params = req.body;

        try {
         
           var emailval = await checkEmail.findEmail(params.email)
           var passwordVal = !validation.isEmpty(params.password);
                       
        } catch (error) {

            return res.status(500).send({

                status: "error",
                message: "All field must be fill out"


            })

                        
        }

      
        if (emailval) {

            return res.status(409).send({

                status: "error",
                message: "User already exits in our database"
            })  
            
        }
       
           
        Personnel.findOne({email: params.email, phone1: params.phone1}, (err, personnelFound) => {
           
        
            if (err) {
                return res.status(500).send({

                    status: "error",
                    message: "User was not saved"


                })
            }

            if (personnelFound) {

                return res.status(409).send({

                    status: "error",
                    message: "User already exits"


                })             

                
            }

            var personnel = new Personnel();
            personnel.name = params.name;
            personnel.lastname = params.lastname;
            personnel.gender = params.gender;
            personnel.dob = params.dob;
            personnel.email = params.email;
            personnel.password = params.password;
            personnel.address.street_1 = params.street_1;
            personnel.address.street_2 = params.street_2;
            personnel.address.aptOrNum = params.aptOrNum;
            personnel.address.sector_name = params.sector_name;
            personnel.address.province = params.province;
            personnel.address.city = params.city;
            personnel.address.country = params.country;
            personnel.phone1 = params.phone1;
            personnel.phone2 = params.phone2;
            personnel.avatar = params.avatar;
            personnel.cargo = params.cargo;

            bcrypt.hash(params.password, salt,(err, hash) => {

               
                personnel.password = hash;
  
               
                 personnel.save((err, personnelSaved) => {
                
                    if (err) {
                        return res.status(500).send({

                            status: "error",
                            message: "User was not saved, due to server error"


                        })
                    }

                    return res.status(200).send({

                        status: "success",
                        personnel: personnelSaved

                    })


                })

            })

           

        })

    },

    loginPersonnel: function login(req, res){

        let loginParam = req.body

        try {
            var val_email = validation.isEmail(loginParam.email)
            var val_password = !validation.isEmpty(loginParam.password)

        } catch (error) {

            return res.status(500).send({
                status: 'error',
                message: 'Missing data'
            })
        }

        Personnel.findOne({email:loginParam.email.toLowerCase()}, (err, accountFound) => {


            if (err) {

                return res.status(500).send({

                    status: "error",
                    message: "Server error"
                })

            }


            if (!accountFound) {

                return res.status(401).send({

                    status: "error",
                    message: "No users found"
                })

            }

            bcrypt.compare(loginParam.password, accountFound.password, (err, verified) => {

                if (loginParam.gettoken) {
                    return res.status(200).send({
                        token: jwt.createToken(accountFound)

                    })
                    
                }else{

                    accountFound.password = undefined;
                    accountFound.dob = undefined;
                    accountFound.email = undefined;
                    accountFound.address.street_1 = undefined;
                    accountFound.address.street_2 = undefined;
                    accountFound.address.aptOrNum = undefined;
                    accountFound.address.sector_name = undefined;
                    accountFound.address.province = undefined;
                    accountFound.address.city = undefined;
                    accountFound.address.country = undefined;
                    accountFound.phone1 = undefined;
                    accountFound.phone2 = undefined;
                    accountFound.avatar = undefined;
                    accountFound.cargo = undefined;
                    accountFound.role = undefined;

                    //Devolver datos


                    return res.status(200).send({
                        status: 'success',
                        accountFound

                    });



                }
            })

        })



    },

    getPersonnel: function getPersonnel(req, res){

        var num =  req.params.page
        var page;

        if (num.match('[a-zA-Z]') || num == null || num == undefined || num == 0 || num == "0") {

            page = 1;

        } else {
            page = req.params.page
        }
        
        //Indicar las opciones de paginacion
        var options = {
            sort: { des: -1 },            
            limit: 5,
            page: parseInt(page)

        }

        Personnel.paginate({},options,(err, personnels) => {

            if (err) {

                return res.status(500).send({

                    status: "error",
                    message: "Server error" 
                })
                
            }


            if (!personnels) {

                return res.status(401).send({

                    status: "error",
                    message: "No users found"
                })

            }


            return res.status(200).send({

                status: 'success',
                properties: personnels.docs,
                totalDocs: personnels.totalDocs,
                totalPages: personnels.totalPages

            })


        })



     


    },
    getPersonnelId: function getPersonnelId(req, res) {
       

        try {
            req.params.id 
        } catch (error) {

            return res.status(500).send({

                status: "error",
                message: "Missing ID param"
            })
            
        }

        let param = req.params.id 

        Personnel.find({ _id: param },(err, personnels) => {

            if (err) {

                return res.status(500).send({

                    status: "error",
                    message: "No users found"
                })

            }


            return res.status(200).send({

                status: "success",
                personnel: personnels

            })


        })



    },
    updatePersonnel: function update(req, res){

        let params =  req.body
             
       
        try {

            
            (Object.keys(params).length >= 13)
            var userId = req.user.sub ?? false
          
          
            
        } catch (error) {

            return res.status(500).send({

                status: "error",
                message: "Please fill all fields out."


            })

            
            
        }
        

        Personnel.findOneAndUpdate({ _id: params._id }, params, { new: true }, (err, personnelUpdated) => {

                if (err) {
                    return res.status(500).send({

                        status: "error",
                        message: "Server error. User was not updated"


                    })
                }

                return res.status(200).send({

                    status: "success",
                    userUpdated: personnelUpdated


                })


            })

    },

    deletePersonnel: function deletePersonnel(req, res) {
       
        let param = req.params.id
        let validation = [null, undefined]
        
        try {

            if (!(param.length >= 9)) {

                throw new Error("Missing user ID");
                
            }
          
          
            
        } catch (error) {

            return res.status(500).send({

                status: "error",
                message: error


            })

            
        }

        Personnel.findOneAndDelete({_id:param}, (err, personnelDeleted) =>{

            if (err) {
                return res.status(500).send({

                    status: "error",
                    message: "User was not deleted"


                })
            }

            if (!personnelDeleted) {

                return res.status(500).send({

                    status: "error",
                    message: "User not found"


                })


            }


            return res.status(200).send({

                status: "success",
                personnelDeleted: personnelDeleted


            })

        })

        
    } 
    

}

module.exports = personnelController;