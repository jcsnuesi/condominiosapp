'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var guestSchema =  Schema({

    fullname:{type:String, required:true},
    concept: { type: String, default: "N/A" },
    access: { type: String, required: true }, 
    comment: { type: String, default: "N/A" },
    authByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }, 
    createAt: { type: Date, default: Date.now },
    expirationDate: { type: Number, required: true },
    updateAt: { type: Date },
    updateByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
    status: { type: String, default:'Scheduled' },
    role: { type: String, default: 'ROLE_GUEST' }
})

module.exports = mongoose.model('Guest', guestSchema);