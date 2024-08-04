'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
 

var AdminsSchema = Schema({

    avatar: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: [{ type: String, required: true }],
    position: { type: String, required: true },
    status: { type: String, default:'active' },
    role: { type: String, default: 'STAFF' },
    permissions: [{ type: String, default: ['read','write','delete'] , required: true }]

})

StaffSchema.method.toJSON = function () {

    var obj = this.toObject()
    delete obj.password
    return obj
};


module.exports = mongoose.model('Administrators', StaffSchema);