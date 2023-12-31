'use strict'

let validator = require('validator')
let Task = require('../models/task') 

let Property =  require('../models/property')
let dateObj = new Date()
let dateTime = { "Day": dateObj.getDate(), "Month": dateObj.getMonth() , "Year": dateObj.getFullYear(), "Hour": dateObj.getHours(), "Minutes": dateObj.getMinutes() }


let taskControllers = {


    prueba:function(req, res){

        return res.status(200).send({
            message: "enviado 2023!!"
        })
    },
    createTask:function(req, res){

        let taskParams = req.body

       
        try {

            var ownerId_validation = !validator.isEmpty(req.user.sub)
            var propertyId_validation = !validator.isEmpty(taskParams.propertyId)
            var BookingDate_validation = !validator.isEmpty(taskParams.BookingDate)
          
            
        } catch (error) {
            
            return res.status(401).send({

                status: 'error',
                message:'Check out all fields before submit'
            })
        }

  
        if (ownerId_validation && propertyId_validation && BookingDate_validation) {

            Property.findOne({ _id: taskParams.propertyId  },(err, results) => {

                if (err) {
                    return res.status(500).send({

                        status: 'error',
                        message: 'Server error, please try again later.'
                    })
                }

             
            
                if (!results) {

                    return res.status(201).send({

                        status: 'error',
                        message: 'Make sure your address is correctly typed.'
                    })
                    
                }

             
             Task.findOne({ propertyId: results._id}, async (err, propertyFound) =>{


               let idIncremente = await Task.find()
                .then(response =>  response)
                .then(data => { return data.length })
                .catch(error => console.log(error))
            
                 let tasker = new Task()

                 let dateMaker = taskParams.BookingDate
                 let dateSpliter = dateMaker.split(/[ :-]/)

                 let mongoDateTime = new Date(dateSpliter[0], dateSpliter[1], dateSpliter[2], (dateSpliter[3] - 4), dateSpliter[4])

                 tasker.ticketId = idIncremente == null ? 1 : idIncremente + 1
                 tasker.ownerId = req.user.sub
                 tasker.propertyId = taskParams.propertyId
                 tasker.staffId = taskParams.staffId
                 tasker.BookingDate = mongoDateTime
                 tasker.special_instruction = taskParams.special_instruction
                 tasker.paymentMethod = taskParams.paymentMethod
                 tasker.paymentAmount = taskParams.paymentAmount
                 tasker.createdAt = new Date(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour - 4, dateTime.Minutes)
                 tasker.updatedAt = new Date(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour - 4, dateTime.Minutes)

                 if (propertyFound) {

                     return res.status(201).send({

                         status: 'error',
                         message: 'There is a ticket open, you have to wait or cancel it to create a new one.'
                     })

                 }



                 tasker.save((err, taskCreated) => {

                     if (err) {
                         return res.status(500).send({

                             status: 'error',
                             message: 'Server error in task, please try again later.'
                         })
                     }

                     return res.status(200).send({
                         status: 'success',
                         taskCreated: taskCreated
                     })


                 })


             })
                  

               

            
            })

            
        }

    },
    taskupdate:function(req, res){

        let updateParams = req.body
       
        try {

            
            var Id_validator = !validator.isEmpty(updateParams._id)
            
        } catch (error) {
            
            return res.status(401).send({

                status: 'error',
                message: 'Check out all fields before submit'
            })
        }

        if (Id_validator) {

            Task.findOne({ _id: updateParams._id }, (err, taskFound) => {


                if (err) {
                    return res.status(500).send({

                        status: 'error',
                        message: 'Server error in task updating, please try again later.'
                    })
                }


                if (!taskFound) {
                    return res.status(404).send({

                        status: 'error',
                        message: 'Task does not exits.'
                    })
                }

                updateParams.updatedAt = new Date(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour - 4, dateTime.Minutes)
                

                Task.findOneAndUpdate({ _id: updateParams._id }, updateParams, {new:true}, (err, taskUpdated) =>{

                    if (err) {
                        return res.status(500).send({

                            status: 'error',
                            message: 'Server error in task updating, please try again later.'
                        })
                    }

                    if (!updateParams) {
                        return res.status(201).send({

                            status: 'error',
                            message: 'Server error in task updating, please try again later.'
                        })
                    }

                    return res.status(200).send({
                        status: 'success',
                        taskupdated: updateParams
                    })



                })


            })
            
        }
    }
    
    
    ,getTask:function(req, res){

        let paramsTask = req.params.id

        Task.find({ _id: paramsTask })
            .populate('propertyId', '_id alias street_1 street_2 aptOrNum sector_name province city country').populate('ownerId', 'name lastname email role authorized_personnel')
            .populate('staffId', 'name lastname email role phone1 staff_status').exec((err, taskFound) => {

            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Server error finding task id, please try again later.'
                })
                
            }

            return res.status(200).send({
                status: 'success',
                taskFound: taskFound
            })

        })


    }, getTasks: function (req, res) {

     

        Task.find()
            .populate('propertyId', '_id alias street_1 street_2 aptOrNum sector_name province city country')
            .populate('ownerId', 'name lastname email role authorized_personnel').populate('staffId', 'name lastname email role phone1 staff_status').exec((err, taskFound) => {

                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'Server error finding task id, please try again later.'
                    })

                }

                return res.status(200).send({
                    status: 'success',
                    tasksFound: taskFound
                })

            })


    }

    
}


module.exports =  taskControllers