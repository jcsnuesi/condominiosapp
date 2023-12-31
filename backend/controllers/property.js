'use strict'

var validator = require('validator')
var path = require('path')
var Property = require('../models/property')

var Task = require('../models/task')
var fs = require('fs')
const { find } = require('../models/property')


var propertyController = {

    prueba: function (req, res) {

        return res.status(200).send({
            message: "enviado!!"
        })
    },
    createProperty:function(req, res){

        let propertyParams = req.body
      
        try {

            var alias_validation = !validator.isEmpty(propertyParams.alias)
            var street_1_validation = !validator.isEmpty(propertyParams.street_1)
            var sector_name_validation = !validator.isEmpty(propertyParams.sector_name)
            var province_validation = !validator.isEmpty(propertyParams.province)
            var city_validation = !validator.isEmpty(propertyParams.city)

            
        } catch (error) {

            return res.status(400).send({
                status: 'error',
                message: 'Fill out all fiels'
            })
        }


        let img = propertyParams.file0.length > 0 ? propertyParams.file0 : "noimage.jpg";

      
        if (alias_validation && street_1_validation && sector_name_validation && province_validation && city_validation) {

            Property.findOne({ alias: propertyParams.alias, street_1: propertyParams.street_1, sector_name: propertyParams.sector_name }, (err, propertyFound) =>{


                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        message: "Server error, please again later."
                    });
                    
                }

                if (propertyFound) {

                    return res.status(201).send({
                        status: 'error',
                        message: "Property already exists."
                    });

                }
            

                let properties = new Property()

                properties.ownerId = req.user.sub
                properties.avatar = img; 
                properties.alias = propertyParams.alias
                properties.street_1 = propertyParams.street_1
                properties.street_2 = propertyParams.street_2
                properties.aptOrNum = propertyParams.aptOrNum
                properties.sector_name = propertyParams.sector_name
                properties.province = propertyParams.province
                properties.city = propertyParams.city
                properties.country = propertyParams.country
                properties.RoomsNum = propertyParams.RoomsNum
                properties.BathNum = propertyParams.BathNum
               
             
                properties.save((err, newproperty) => {

                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: "Server error, please again later."
                        });

                    }

                    

                    return res.status(200).send({
                        status: 'success',
                        property: newproperty
                    });
                })



            })


            
        }

    }, 
        getPropery: function (req, res) {

                     
       

                Property.find({ ownerId: req.user.sub  })
                .populate('ownerId', 'name lastname email')
                .exec((err, propertyFound)=>{


                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: "Server error, please again later."
                        });

                    }

                    if (!propertyFound) {

                        return res.status(404).send({
                            status: 'error',
                            message: "Property does not exits."
                        });

                    }



                    return res.status(200).send({
                        status: 'succes',
                        properties: propertyFound
                    });



                })
                
            


    },
    getProperies: function (req, res) {

            Property.find()
                .populate('ownerId', 'name lastname email')
                .exec((err, propertyFound) => {


                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: "Server error, please again later."
                        });

                    }

                    if (!propertyFound) {

                        return res.status(404).send({
                            status: 'error',
                            message: "Property does not exits."
                        });

                    }



                    return res.status(200).send({
                        status: 'succes',
                        properties: propertyFound
                    });



                })

    },
    propertyUpdate: function(req,res){

        let propertyParams = req.body
      
        let avatarpath = req.files.file0 ? req.files.file0.path : ''
        let avatarname = req.files.file0 ? req.files.file0.name : propertyParams.file0
        let avatarExt = avatarname.split("\.")
        let extension = ['jpg', 'jpeg', 'gif', 'png']        
        let check_extension = extension.includes(avatarExt[1].toLowerCase())
        
       
        try {
            var id_validation = !validator.isEmpty(propertyParams.id)
        } catch (error) {

            return res.status(401).send({
                status: 'error',
                message: "Some entries have mistakes."
            });
            
        }

        if (check_extension != true) {

            fs.unlink(avatarpath, (err)=>{
                return res.status(500).send({
                    status: 'error',
                    message: 'Doc are not allowed, you just can upload images'
                });
            })
            
        }

        if (id_validation) {

            Property.findOne({ _id: propertyParams.id }, (err, propertyFound) => {

                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        message: "Server error, please again later."
                    });

                }

                if (!propertyFound) {

                    return res.status(404).send({
                        status: 'error',
                        message: "Property does not exits."
                    });

                }

                propertyParams.avatar = avatarname.toLowerCase()
                propertyParams.updateAt = new Date()

                Property.findOneAndUpdate({ _id: propertyParams.id, ownerId: req.user.sub }, propertyParams, {new:true}, (err, propertyUpdated) => {

                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: "Server error while updating property, please again later."
                        });

                    }

                    return res.status(200).send({
                        status: 'succes',
                        properties: propertyUpdated
                    });

                } )


            })
            
        }else{

            return res.status(401).send({
                status: 'error',
                message: "Fill fiels out properly."
            });

        }
    },
    propertyDelete:function(req, res){

        let propertyId = req.params.id


        try {
            var id_validation = !validator.isEmpty(propertyId)
        } catch (error) {

            return res.status(401).send({
                status: 'error',
                message: "Some entries have mistakes."
            });

        }

        if (id_validation) {

         Task.findOne({ propertyId: propertyId }, (err, taskExist) => {

             if (taskExist.orderStatus != 'Completed') {

                 return res.status(500).send({
                     status: 'error',
                     message: "There is a task in process,please cancel it before delete this property."
                 });
                
            }
          
             Property.findOneAndDelete({ _id: propertyId, ownerId: req.user.sub }, (err, propertyDeleted) => {

                 if (err) {

                     return res.status(500).send({
                         status: 'error',
                         message: "Server error, please again later."
                     });

                 }


                 let addtoDelete = new DeletedProperty()

                 addtoDelete.ownerId = propertyDeleted.email
                 addtoDelete.avatar = propertyDeleted.avatar
                 addtoDelete.alias = propertyDeleted.alias
                 addtoDelete.street_1 = propertyDeleted.street_1
                 addtoDelete.street_2 = propertyDeleted.street_2
                 addtoDelete.aptOrNum = propertyDeleted.aptOrNum
                 addtoDelete.sector_name = propertyDeleted.sector_name
                 addtoDelete.province = propertyDeleted.province
                 addtoDelete.city = propertyDeleted.city
                 addtoDelete.country = propertyDeleted.country
                 addtoDelete.createAt = propertyDeleted.createAt

                 addtoDelete.save()

                 if (!propertyDeleted) {

                     return res.status(404).send({
                         status: 'error',
                         message: "Property does not deleted."
                     });

                 }



                 return res.status(200).send({
                     status: 'succes',
                     property_deleted: propertyDeleted
                 });



             })
           
               
            })
          
            
         
            
        }else{

            return res.status(401).send({
                status: 'error',
                message: "Fill fiels out properly."
            });
        } 

    },
    propertyPagination:function(req, res){

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
            populate: 'ownerId',
            limit: 5,
            page: parseInt(page)

        }

   
        Property.paginate({ ownerId: req.user.sub  }, options, (err, properties) => {
          
            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Error al hacer la consulta'
                });
            }
         

            if (!properties) {

                return res.status(500).send({
                    status: 'error',
                    message: 'No properties'
                });

            }
            
          
            properties.docs[0].ownerId.password = null
         
            return res.status(200).send({
                status: 'success',
                properties: properties.docs,
                totalDocs: properties.totalDocs,
                totalPages: properties.totalPages
            });


        })


    }



}

module.exports = propertyController