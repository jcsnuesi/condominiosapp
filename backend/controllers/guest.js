'use strict'

let Guest = require('../models/guest')
let validator = require('validator')
let jwtoken = require('../service/jwt')
let errorHandler = require('../error/errorHandler')

var guestController = {

    createGuest: function(req, res){

        let params = req.body

        try {


            var val_fullname = !validator.isEmpty(params.fullname)
            
        } catch (error) {

            return res.status(401).send({
                status:'error',
                message:'All field must be fill out.'
            })
        }

      

        Guest.findOne({ fullname : params.fullname}, (err,  guestFound) => {

            let errorHandlerGuest = errorHandler.errorRegisteringUser(err, guestFound)

            if (errorHandlerGuest[0]) {

                return res.status(
                    errorHandlerGuest[1]).send({
                        status: errorHandlerGuest[2],
                        message: errorHandlerGuest[3]


                    })

            }    

            let guest = new Guest()
           
            for (const key in params) {
               
                guest[key] = params[key]
                
            }
       
            
            guest.save((err, guestSaved) => {

                let errorHandlerGuest = errorHandler.newUser(err, guestSaved)

                if (errorHandlerGuest[0]) {

                    return res.status(
                        errorHandlerGuest[1]).send({
                            status: errorHandlerGuest[2],
                            message: errorHandlerGuest[3]


                        })

                }    

                
            })


        })
        

    },
    getGuest:function(req,res){

        if (req.user.role == "ROLE_ADMIN" || req.user.role == "ROLE_STAFF") {
            
            Guest.find()
                .populate("authByUser", "name lastname email unidadApartamental")
                .exec((err, guest) => {
    
                let errorHandlerGuest = errorHandler.newUser(err, guest)
    
                if (errorHandlerGuest[0]) {
    
                    return res.status(
                        errorHandlerGuest[1]).send({
                            status: errorHandlerGuest[2],
                            message: errorHandlerGuest[3]
    
    
                        })
    
                }    
            })
        } else if (req.user.role == "ROLE_OWNER"){
           
            Guest.find({ authByUser: req.user.sub})
            .exec((err, guest) => {

                let errorHandlerGuest = errorHandler.newUser(err, guest)

                if (errorHandlerGuest[0]) {

                    return res.status(
                        errorHandlerGuest[1]).send({
                            status: errorHandlerGuest[2],
                            message: errorHandlerGuest[3]


                        })

                }
            })
        }else{


            return res.status(403).send({
                status: "error",
                message: "Do not have authorization."
            })
        }

        

    },
     getGuestById: function (req, res) {

        var params = req.body

        try {
            var val_id = !validator.isEmpty(params.id)

        } catch (error) {
            return res.status(401).send({
                status:'error',
                message:'All field must be fill out'
            })
        }

        if (req.user.role == "ROLE_ADMIN" || req.user.role == "ROLE_STAFF") {

            Guest.findOne({_id:params.id})
                .populate("authByUser", "name lastname email unidadApartamental")
                .exec((err, guest) => {

                let errorHandlerSearching = errorHandler.loginExceptions(err, guest)

                if (errorHandlerSearching[0]) {

                    return res.status(
                        errorHandlerSearching[1]).send({
                            status: errorHandlerSearching[2],
                            message: errorHandlerSearching[3]


                        })

                }
          

                return res.status(200).send({
                    status: "success",
                    message: guest
                })
               
                
            })
        } else if (req.user.role == "ROLE_OWNER"){

            Guest.findOne({
                $and: [
                    { _id: params.id },
                    { authByUser: req.user.sub }
                ]
                }).exec((err, guest) => {

                let errorHandlerSearching = errorHandler.loginExceptions(err, guest)

                if (errorHandlerSearching[0]) {

                    return res.status(
                        errorHandlerSearching[1]).send({
                            status: errorHandlerSearching[2],
                            message: errorHandlerSearching[3]


                        })

                }


                return res.status(200).send({
                    status: "success",
                    message: guest
                })


            })
          
        }else{

            return res.status(403).send({
                status: "error",
                message: "Do not have authorization."
            })
        }



    },
    
    updateGuest:function(req, res){

        var params = req.body

        try {
            var val_id = !validator.isEmpty(params.id)
        } catch (error) {
            return res.status(401).send({
                status: 'error',
                message: 'All field must be fill out'
            })
        }

        if (req.user.role == "ROLE_OWNER") {
     
            params.updateByUser = req.user.sub
            params.updateAt = new Date();
            
            Guest.findOneAndUpdate({ $and: [
                { _id: params.id },
                { authByUser: req.user.sub }
            ] }, params, { new: true }, (err, guesUpdated) => {
    
                
                let errorHandlerUpdating = errorHandler.UpdateGuest(err, guesUpdated)
              
                
                if (errorHandlerUpdating[0]) {
    
                    return res.status(
                        errorHandlerUpdating[1]).send({
                            status: errorHandlerUpdating[2],
                            message: errorHandlerUpdating[3]
    
    
                        })
                    }
    
            })
            
        }else{

            return res.status(403).send({
                status: 'error',
                message: 'Does not have authorization'
            })

        }


      
    },deleteGuest:function(req,res){

        var params = req.body

        try {
            var val_id = !validator.isEmpty(params.id)
        } catch (error) {

            return res.status(401).send({
                status: 'error',
                message: 'All field must be fill out'
            })
            
        }

        Guest.findOneAndDelete({$and:[
            { _id:params.id},
            { updateByUser: req.user.sub }
        ]}, (err, guestDeleted) =>{
                     
            let errorHandlerDeleting = errorHandler.UpdateGuest(err, guestDeleted)

            if (errorHandlerDeleting[0]) {

                return res.status(
                    errorHandlerDeleting[1]).send({
                        status: errorHandlerDeleting[2],
                        message: errorHandlerDeleting[3]


                    })
            }



        })
    }
        

}

module.exports = guestController;