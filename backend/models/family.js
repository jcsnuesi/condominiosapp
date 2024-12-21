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
    phone: { type: String, required: true },
    status: { type: String, default: 'active' },
    role: { type: String, default: 'FAMILY' },
    propertyDetails: [{
        _id: false,
        condominioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Condominium' },
        unit: { type: String, required: true },
        family_status: { type: String, default: 'authorized' },
        lastUpdate: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now }
    }],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
},{timestamps: true})

module.exports = mongoose.model('Family', FamilySchema);
