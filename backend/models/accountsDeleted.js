'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var AccountsDeletedSchema = Schema({

    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    phone1: { type: String, required: true },
    phone2: { type: String },
    address: { type: 'ObjectId', ref: 'Address' },
    unidadApartamental: { type: String, required: true },
    parkingQty: { type: String, required: true },
    role: { type: String, default: 'ROLE_OWNER' },
    create_at: { type: Date, default: Date.now },
    updateAt: { type: Date },
    status: { type: String, default: 'unverified' },
    id_number: { type: String, required: true },
    id_image_front: { type: String, required: true },
    id_image_back: { type: String, required: true }


})

AccountsDeletedSchema.method.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    return obj
}

module.exports = mongoose.model('AccountDeleted', AccountsDeletedSchema);