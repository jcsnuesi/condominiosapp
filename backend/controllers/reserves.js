'use strict'

let Reserves = require('../models/reserves')
let validator = require('validator')
let errorHandler = require('../error/errorHandler')
let moment = require('moment')
const {v4:uuidv4} = require('uuid')
const uuid = uuidv4();

var reservesController = {

    createBooking:function(req, res){

        //Capturar los datos

        var params = req.body

        try {
            var val_areaToReserve = !validator.isEmpty(params.areaToReserve)
            var val_startReservationDate = !validator.isEmpty(params.startReservationDate)
            var val_endReservationDate = !validator.isEmpty(params.endReservationDate)

        } catch (error) {

            return res.status(400).send({
                status:'error',
                message: 'All field must be fill out'
            })
        }             

        if (val_areaToReserve || val_startReservationDate || val_endReservationDate) {
          
            Reserves.findOne({ 
                $and:[
                    { address: params.address },                   
                    { areaToReserve: params.areaToReserve },
                    { startReservationDate: params.startReservationDate },
                    { endReservationDate: params.endReservationDate }
            ] 
            }, (err, reservation) => {
              
                               
                var loginErrorHandlerArr = errorHandler.reserveException(err, reservation)

                if (loginErrorHandlerArr[0]) {

                    return res.status(
                        loginErrorHandlerArr[1])
                        .send({
                            status: loginErrorHandlerArr[2],
                            message: loginErrorHandlerArr[3]


                        })

                }

                let reservaAreaComunModel = new Reserves()

                //Establecer la fecha de creacion
                    if (reservation == null) {
                    reservaAreaComunModel.createAt = new Date()
                }

                
                    for (const key in params ) {
                   
                  
                  // Aqui le damos formato a las fechas para guar
                        if (key.includes("startReservationDate") || key.includes("endReservationDate") ) {

                        let startDate = params[key].split(/[' :/']/)
                        let year = startDate[2]
                        let month = (startDate[1] - 1)
                        let day = startDate[0]
                        let hour = startDate[3]
                        let minutes = startDate[4]
                         
                        //new Date(year, month, date, hours, minutes, seconds, ms)

                        let startDateFormated = new Date(year, month, day, hour, minutes)

                        const fechaFormateada = moment(startDateFormated).format('DD-MM-YY HH:mm'); 
                      
                         reservaAreaComunModel[key] = fechaFormateada
                     
                        } else{

                            reservaAreaComunModel[key] = params[key]

                        
                       } 

                }
                                   
                //Establecemos quien hizo la reservacion
                    if (req.user.role == "ROLE_OWNER") {

                        reservaAreaComunModel.ownerid = req.user.sub
                       
                    }else{

                        reservaAreaComunModel.subownerid = req.user.sub

                    }
                    // Establecemos la fecha en la que se produjo algun cambio
                    reservaAreaComunModel.updateAt = new Date()

                    reservaAreaComunModel.save((err, reserved) => {
                     
                     
                        if (err) {

                            return res.status(500).send({
                                status:"error",
                                message:"Error saving reservation"
                            })
                            
                        }


                        const start = (reserved.startReservationDate).toISOString();
                        const end = (reserved.endReservationDate).toISOString();

                        let startDate = moment(start).format('DD-MM-YY HH:mm');
                        let endDate = moment(end).format('DD-MM-YY HH:mm');


                      
                        reserved.startReservationDate = undefined
                        reserved.endReservationDate = undefined
                     
                        
                        return res.status(200).send({
                            message: "success",
                            message: reserved,
                            reserveDate: startDate,
                            reserveExpire: endDate
                        })


                    })

                
            })
            
        }

    },
    getAllReservation:function(req,res){

        let authUsers = ['ROLE_ADMIN', 'ROLE_STAFF']
        
        if (!authUsers.includes(req.user.role)) {

            return res.status(403).send({

                status: 'error',
                message: 'Forbbiden'
            })
            
        }
      
        Reserves.find()
            .populate("ownerid", "name lastname email phone1")
            .populate("subownerid","name lastname email phone1")
            .populate('owner', 'name lastname email')
            .populate('subowner', 'name lastname email')
            .populate('admin', 'name lastname email')
            .populate('address','alias phone1 street_1 sector_name province city country')
            .exec((err,reservations) => {
            
            
            if (err != null || reservations == null || reservations.length == 0) {
                
                return res.status(500).send({

                    status:'error',
                    message:'Error fetching data'
                })
            }

                var data_obj_response = {}
                var doc_pipeline = []

            //Darle formate a la fecha, horas
                reservations.forEach((element, index) => {
                    
                    Object.keys(element._doc).forEach((cols, indx) => {
                      

                        if (cols.includes("startReservationDate") || cols.includes("endReservationDate")) {
                             
                            let dateFormatted = moment(reservations[cols]).format('DD-MM-YY HH:mm'); 
                            
                            data_obj_response[cols] = dateFormatted
                            
                            
                        }else{

                            data_obj_response[cols] = element[cols]
                          
                        }                    
                       
                    })
                    doc_pipeline.push(data_obj_response)

            });
           
            
            return res.status(200).send({

                status: 'success',
                message: doc_pipeline
            })

        })
        
    },
    getReservationByBooker: function(req, res){

        let aparmentNum = req.params.apartment
        let addressId = req.params.addressId
      
        try {

            var val_apt = !validator.isEmpty(aparmentNum)
            var val_address_id = !validator.isEmpty(addressId)
            
        } catch (error) {
            
            return res.status(500).send({

                status:"error",
                message:"Fill out all fields (required)"
                
            })
        }

       
        if (val_apt && val_address_id) {

            Reserves.find({
                $and:[
                    { address: addressId },
                    { apartmentUnit: aparmentNum }
                    
                ]
            })
                .populate('ownerid', 'name lastname email')
                .populate('subownerid', 'name lastname email')
                .populate('owner', 'name lastname email')
                .populate('subowner', 'name lastname email')
                .populate('admin', 'name lastname email')
                .populate('address', 'alias street_1 sector_name province city country')
        
                .exec( (err, reservationFound) => {

                var reservationErrorHandlerArr = errorHandler.newUser(err, reservationFound)
                   
                
                if (reservationErrorHandlerArr[0]) {

                  
                    return res.status(
                        reservationErrorHandlerArr[1])
                        .send({
                            status: reservationErrorHandlerArr[2],
                            message: reservationErrorHandlerArr[3]


                        })

                }

            })
            
        }else{

            return res.status(400).send({

                status: "error",
                message: "Fill out all fields (required)"
            })

        }


    },
    updateReservation:function(req, res){

        let params = req.body

        try {

            var areaToReserve_val = !validator.isEmpty(params.areaToReserve)
            var startReservationDate_val = !validator.isEmpty(params.startReservationDate)
            var endReservationDate_val = !validator.isEmpty(params.endReservationDate)
            var address_val = !validator.isEmpty(params.address)
            var apartmentUnit_val = !validator.isEmpty(params.apartmentUnit)
            var id_reservation_val = !validator.isEmpty(params.id_reservation)
            
        } catch (error) {

            return res.status(400).send({

                status: "error",
                message: "Fill out all fields (required)"
            })
            
        }

        if (areaToReserve_val && startReservationDate_val && 
            endReservationDate_val && address_val && apartmentUnit_val && id_reservation_val) {
            
             // ROLE_OWNER          
            let user_role = req.user.role.substring(5).toLowerCase()

            params[user_role] = req.user.sub
          

         
          
            Reserves.findOneAndUpdate({ _id: params.id_reservation }, params, {new:true}, (err, dataUpdated) => {

                var reservationErrorHandlerArr = errorHandler.newUser(err, dataUpdated)

                if (reservationErrorHandlerArr[0]) {


                    return res.status(
                        reservationErrorHandlerArr[1])
                        .send({
                            status: reservationErrorHandlerArr[2],
                            message: reservationErrorHandlerArr[3]


                        })

                }

            })
            
        } else {

            return res.status(400).send({

                status: "error",
                message: "Fill out all fields (required)"
            })

        }
    },
    deleteReservation: function(req, res){

        let deleteId =  req.params.id

        try {
            
            var id_delete = !validator.isEmpty(deleteId)

        } catch (error) {

            return res.status(500).send({

                status: "error",
                message: "Fill out all fields (required)"
            })
            
        }

        if (id_delete) {

           
            if (!["ROLE_ADMIN", "ROLE_STAFF"].includes(req.user.role)) {
                return res.status(403).send({

                    status: "error",
                    message: "Reservation could not be deleted, you are no authorized"
                })
            }

           
            Reserves.findOneAndDelete({ _id: deleteId }, (err, deleted) => {

                if (err) {
                    return res.status(500).send({

                        status: "error",
                        message: "Reservation could not be deleted"
                    })
                }

                return res.status(200).send({

                    status: "success",
                    message: deleted
                })
            })

            
        }else{

            return res.status(400).send({

                status: "error",
                message: "Fill out all fields (required)"
            })
        }
    }

}

module.exports = reservesController;