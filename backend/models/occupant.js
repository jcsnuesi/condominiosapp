'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var OccupantSchema = Schema({

    avatar: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: [{ type: String, required: true }],
    role: { type: String, default: "OCCUPANT" },
    status: { type: String, default: "active" },
    addressId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Condominium' }]

}, { timestamps: true })

OccupantSchema.method.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    return obj
}

module.exports = mongoose.model('Occupant', OccupantSchema)

