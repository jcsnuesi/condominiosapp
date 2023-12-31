'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DocsSchema = Schema({

    title:{type:String, required:true},
    description:{type:String, required:true},
    addressId: { type: 'ObjectId', ref: 'Address' },
    createdByAdmin: { type: 'ObjectId', ref:'Admin'},
    createdByStaff: { type: 'ObjectId', ref:'Staff'},
    
}, { timestamps: true })


module.exports = mongoose.model('Docs', DocsSchema)