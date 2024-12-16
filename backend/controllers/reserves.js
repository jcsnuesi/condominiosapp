'use strict'

let Reserves = require('../models/reserves')
let Owners = require('../models/owners')
let Family = require('../models/family')
// const uuid = uuidv4();
let validator = require('validator')
let errorHandler = require('../error/errorHandler')
let moment = require('moment')
// const {v4:uuidv4} = require('uuid')
let isDateConflict = require('../service/dateConflict')
let codeVerification = require('../service/verificators')
let generateRandomCode = require('../service/codeGenerator')


var reservesController = {

    createBooking:async function(req, res){

     
        if (req.user.role == 'ADMIN'){
            return res.status(403).send({
                status: 'error',
                message: 'Forbidden'
            });
        }

        //Capturar los datos 
        var params = req.body      

        try {
            var val_memberId = !validator.isEmpty(params.memberId)
            var val_condoId = !validator.isEmpty(params.condoId)


        } catch (error) {

            return res.status(400).send({
                status:'error',
                message: 'All field must be fill out'
            })
        }             

        if (val_memberId && val_condoId) {

          
            try {

                const ownerInfo = await Owners.findOne({ _id: params.memberId })
                if (!ownerInfo) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Owner not found'
                    });
                }

                const reservation = new Reserves();


                if (params.isguest) {

                    reservation.condoId = params.condoId;
                    reservation.apartmentUnit = params.unit;
                    reservation.memberId = params.memberId;
                    reservation.guest.push({
                        fullname: params.fullname,
                        phone: params.phone,
                        notificationType: params.notifing,
                        verificationCode: generateRandomCode()
                    })
                    reservation.status = 'Guest';
                    reservation.checkIn = params.checkIn;
                   
                    await reservation.save();
                    // Enviarmos el correo con los 4 digitos de verificación
                    codeVerification.CodeVerification(params.notifing, reservation.guest[0].verificationCode);

                } else {

                    const dateConflict = await isDateConflict(params.checkIn, params.checkOut, params.condoId, params.areaId);
                 
                    if (dateConflict.length > 0) {

            
                        return res.status(409).send({
                            status: 'error',
                            message: 'The reservation dates conflict with an existing reservation',
                            conflictingReserves: dateConflict

                        });
                    }

                    reservation.condoId = params.condoId;
                    reservation.apartmentUnit = params.unit;
                    reservation.memberId = params.memberId;
                    reservation.areaToReserve = params.areaId;
                    reservation.checkIn = params.checkIn;
                    reservation.checkOut = params.checkOut;
                    reservation.visitorNumber = params.visitorNumber;
                    await reservation.save();
                }

            } catch (errors) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error creating reservation',
                    error: errors
                });
                
            }

            return res.status(201).send({
                status: 'success',
                message: 'Reservation created successfully'
            });
  
            
            
        }

    },    
    getAllBookingByCondoAndUnit:async function(req,res){

        let id = req.params.id
        // let unit = req.params.unit

        if(id != req.user.sub){
            return res.status(403).send({
                status: 'error',
                message: 'Forbidden'
            });
        }

        let reservations = null;
       
        try {

             reservations = await Reserves.find({ memberId: id })               
            .populate('condoId', 'alias phone1 street_1 sector_name province city country')
            .exec();

            if (reservations.length == 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No reservations found'
                });
                                   
            }
            
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                status: 'error',
                message: 'Error fetching data'
            });
        }
         
        return res.status(200).send({
            status: 'success',
            message: reservations
        });
        
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