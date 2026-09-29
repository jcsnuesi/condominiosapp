'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema


let TaskSchema =  Schema({

    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },

    ticketId:{type: Number, required:true } ,
    ownerId: {type: 'ObjectId', ref:'owner'},
    propertyId: { type: 'ObjectId', ref: 'Property'},
    staffId: { type: 'ObjectId', ref: 'staff' },
    BookingDate: { type: Date, required:true},
    special_instruction: { type: String },
    finishedAt: { type: Date},
    paymentStatus: { type: String},
    paymentMethod: { type: String, required: true },
    paymentAmount: { type: Number, required: true },
    orderStatus: { type: String, default:'Processing'},
    createdAt: {type:Date, required:true},
    updatedAt: { type: Date, required: true }
   
})

TaskSchema.index({ organizationId: 1, orderStatus: 1, createdAt: -1 })


module.exports = mongoose.model('Task', TaskSchema)
