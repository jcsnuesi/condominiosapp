'use strict'

var validator = require('validator') 
var path = require('path')
var Condominium = require('../models/condominio')
var fs = require('fs')
let errorHandler = require('../error/errorHandler')
let checkExtensions = require('../service/extensions')
let verifyParamData = require('../service/verifyParamData')


var Condominium_Controller = {
    
  
    createCondominium:async function (req, res) {

        let CondominiumParams = req.body
        var verifing = new verifyParamData()

        try {

            var alias_validation = !validator.isEmpty(CondominiumParams.alias)
            var street_1_validation = !validator.isEmpty(CondominiumParams.street_1)
            var sector_name_validation = !validator.isEmpty(CondominiumParams.sector_name)
            var province_validation = !validator.isEmpty(CondominiumParams.province)
            var city_validation = !validator.isEmpty(CondominiumParams.city)        
            var val_phone = verifing.phonesConverter(CondominiumParams)   
            
        } catch (error) {

            return res.status(400).send({
                status: 'error',
                message: 'Fill out all fiels'
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

        if (
            alias_validation &&
            street_1_validation &&
            sector_name_validation &&
            province_validation &&
            city_validation &&
            val_phone
            ) {

            Condominium.findOne({ $and: [
                { alias: CondominiumParams.alias},
                { street_1: CondominiumParams.street_1 },
                { sector_name: CondominiumParams.sector_name }
                ]}, (err, condominioFound) => {
        

                if (err || condominioFound != null) {

                        return res.status(500).send({

                            status: "bad request",
                            message: "Error finding condominio"
                        })
                        
                    }

                    var condominio = new Condominium()

                for (const key in CondominiumParams) {

                    if (key.includes('phone') && typeof ((CondominiumParams['phone']).split(',')) == 'object') {

                        condominio['phone'] = CondominiumParams['phone'].split(',').map(number => { return number.trim() })

                    } else if(key == 'socialAreas'){

                        condominio['socialAreas'] = typeof ((CondominiumParams['socialAreas']).split(',')) == 'object' ? CondominiumParams['socialAreas'].split(',').map(sociales => {
                            return sociales.trim().toLowerCase()
                        }) : CondominiumParams['socialAreas'].toLowerCase()

                    }else{

                        condominio[key] = CondominiumParams[key].toLowerCase()

                    }
                      
                }

                if (req.files != undefined) {

                    for (const fileKey in req.files) {
                        condominio[fileKey] = (req.files[fileKey].path.split('\\'))[2]
                    }
                }

                condominio.createdBy = req.user.sub

                condominio.save((err, newCondominio) => {

                    if (err) {

                        return res.status(500).send({

                            status: "bad request",
                            message: "Error finding condominio"
                        })
                        
                    }

                    return res.status(200).send({

                        status: "succes",
                        message: newCondominio 
                    })


                })

            })

        }else{

            return res.status(500).send({

                status: "bad request",
                message: "All field must be fill out"
            })

        }

    },

    createApartment: function (req, res) {

        var params = req.body

        try {

            var id_address = !validator.isEmpty(params.addressId)
            var id_owner = !validator.isEmpty(req.user.sub)
            var id_parkingQty = !validator.isEmpty(params.parkingQty)
            var id_apartmentUnit = !validator.isEmpty(params.apartmentUnit)
            
        } catch (error) {

            return res.status(400).send({
                status: 'error',
                message: "Server error, please again later."
            });

            
        }
       
        if (id_address && id_owner && id_parkingQty && id_apartmentUnit) {
            
            Condominium.findOne({ _id: params.addressId }, async (err, apartment) => {

                if (err) {
                    
                    return res.status(400).send({
                        status: 'error',
                        message: err
                    });
                }
                              
                const duplicated = await Condominium.findOne({
                    $and:[
                    { "apartmentInfo.addressId": params.addressId },
                    { "apartmentInfo.apartmentUnit": params.apartmentUnit}
                ]})

                if (duplicated != null){

                    var aptFound = apartment.apartmentInfo.filter((data, index) => data.apartmentUnit == params.apartmentUnit )
                  
                   
                    console.log(aptFound)
               
                    

                } 
              
                return
                
               
              
                if (apartment) {
                    
                    
                    var addressInfo = {
                        ownerId: req.user.sub,
                        addressId: params.addressId,
                        parkingQty: params.parkingQty,
                        invoiceIssueDay: params.invoiceIssueDay,
                        apartmentUnit: params.apartmentUnit

                    }

                    
                    apartment.apartmentInfo.push(addressInfo)
                    Condominium.findOneAndUpdate({ _id: params.addressId }, apartment,{ new: true }, (err, saved) => {

                        if (err) {

                            return res.status(400).send({
                                status: 'error',
                                message: err
                            });
                        }

                        return res.status(200).send({
                            status: 'success',
                            message: saved
                        });

                    })

               
                    
                }

               


            })
        }else{

            return res.status(400).send({
                status: 'error',
                message: "Fill out all fields."
            });
        }
     


     
        
    },

    getCondominiumByAdmin: function (req, res) {
      
        Condominium.find({ createdBy:req.user.sub})            
            .populate('createdBy', 'company lastname email')
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
     

    },
    getCondominiumById: function (req, res) {

        var params = req.body

        try {
            var vel_idCondominio = !validator.isEmpty(params.id)
        } catch (error) {

            return res.status(500).send({
                status: 'error',
                message: error
            });
            
        }

        Condominium.findOne(({ _id: params.id}), (err, condominiumFound) => {


            var loginErrorHandlerArr = errorHandler.loginExceptions(err, condominiumFound)

            if (loginErrorHandlerArr[0]) {

                return res.status(loginErrorHandlerArr[1])
                    .send({
                        status: loginErrorHandlerArr[2],
                        message: loginErrorHandlerArr[3]


                    })

            }

              
                return res.status(200).send({
                    status: 'succes',
                    condominium: condominiumFound
                });



            })

    },
    CondominiumUpdate: function (req, res) {

        let CondominiumParams = req.body

     
        try {
            var id_validation = !validator.isEmpty(CondominiumParams.id)
          
        } catch (error) {

            return res.status(401).send({
                status: 'error',
                message: "Some entries have mistakes."
            });

        }

        var imgFormatAccepted = checkExtensions.confirmExtension(CondominiumParams)

        if (imgFormatAccepted == false) {

            return res.status(400).send({

                status: "bad request",
                message: "System just accept images format 'jpg', 'jpeg', 'gif', 'png'"
            })
        }

            Condominium.findOne({ _id: CondominiumParams.id }, (err, CondominiumFound) => {

                var loginErrorHandlerArr = errorHandler.loginExceptions(err, CondominiumFound)

                if (loginErrorHandlerArr[0]) {

                    return res.status(
                        loginErrorHandlerArr[1])
                        .send({
                            status: loginErrorHandlerArr[2],
                            message: loginErrorHandlerArr[3]


                        })

                }
             
              
                if (req.user.role == "ROLE_ADMIN") {

                    CondominiumFound.updatedByAdmin = req.user.sub
               
                   
                }else{
                    CondominiumFound.updatedByStaff = req.user.sub
                 
                }

               
                

                for (const key in CondominiumParams) {
                   
                    if (key == "socialAreas") {

                        let areas = CondominiumParams[key].split(",")

                        for (let index = 0; index < areas.length; index++) {
                           
                            CondominiumFound[key].push(areas[index].trim()) 
                        }
                       
                    }else{

                        CondominiumFound[key] = CondominiumParams[key]
                    }


                }

             
              
                
                Condominium.findOneAndUpdate(
                    { _id: CondominiumParams.id }, 
                    CondominiumFound, 
                    { new: true }, 
                    (err, CondominiumUpdated) => {

                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: "Server error while updating Condominium, please again later."
                        });

                    }

                    return res.status(200).send({
                        status: 'succes',
                        condominium: CondominiumUpdated
                    });

                })


            })

      
    },
    CondominiumDelete: function (req, res) {

        let condominiumId = req.body


        try {
            
            var id_validation = !validator.isEmpty(condominiumId.id)

        } catch (error) {

            return res.status(401).send({
                status: 'error',
                message: "Some entries have mistakes."
            });

        }

        if (id_validation) {

            Condominium.findOneAndDelete({ _id: condominiumId.id }, (err, condominiumDeleted) => {

                var loginErrorHandlerArr = errorHandler.loginExceptions(err, condominiumDeleted)

                if (loginErrorHandlerArr[0]) {

                    return res.status(
                        loginErrorHandlerArr[1])
                        .send({
                            status: loginErrorHandlerArr[2],
                            message: loginErrorHandlerArr[3]


                        })

                }

                return res.status(200).send({
                    status: 'succes',
                    condominium_deleted: condominiumDeleted
                });

            })


        } else {

            return res.status(401).send({
                status: 'error',
                message: "Fill fiels out properly."
            });
        }

    },
    CondominiumPagination: function (req, res) {

        let numOfPage = req.params.page
        var page;


        if (numOfPage.match('[a-zA-Z]') || numOfPage == null || numOfPage == undefined || numOfPage == 0 || numOfPage == "0") {

            page = 1;

        } else {
            page = req.params.page
        }

        //Indicar las opciones de paginacion
        var options = {
            sort: { des: -1 },
            limit: 25,
            page: parseInt(page)

        }


        Condominium.paginate(options, (err, condominium) => {

            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Error al hacer la consulta'
                });
            }


            if (!condominium) {

                return res.status(500).send({
                    status: 'error',
                    message: 'No condominium'
                });

            }


            condominium.docs[0].createBy.password = null

            return res.status(200).send({
                status: 'success',
                condominium: condominium.docs,
                totalDocs: condominium.totalDocs,
                totalPages: condominium.totalPages
            });


        })


    }



}

module.exports = Condominium_Controller