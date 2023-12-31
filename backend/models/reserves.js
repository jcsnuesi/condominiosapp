'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reserveSchema =  Schema({

    
    ownerid: { type: mongoose.Schema.Types.ObjectId, ref:'Owner'},
    subownerid: { type: mongoose.Schema.Types.ObjectId, ref: 'SubOwner'},
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    apartmentUnit: { type: String, required: true },
    areaToReserve: { type: String, required: true },
    startReservationDate: { type: Date, required: true },
    endReservationDate: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref:'Owner'},
    subowner: { type: mongoose.Schema.Types.ObjectId, ref: 'SubOwner' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    status: { type: String, default: 'Reserved', required:true },
    

}, { timestamps: true })

module.exports = mongoose.model('Reserve', reserveSchema)