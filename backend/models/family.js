'use strict'


var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FamilySchema = Schema({

    avatar: { type: String, default: 'noimage1.jpeg' },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: [{ type: String, required: true }],
    status: { type: String, default: 'active' },
    role: { type: String, default: 'FAMILY' },
    permission: [{ type: String, required: true }],
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Condominium',
        required: true
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
},{timestamps: true})

module.exports = mongoose.model('Family', FamilySchema);
