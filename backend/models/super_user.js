
'use strict'
 
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SuperUserSchema = Schema({

    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }, 
    role: { type: String, default: 'SUPERUSER' }


}, { timestamps: true })

SuperUserSchema.method.toJSON = function(){

    var obj = this.toObject()
    delete obj.password
    return obj
}

module.exports = mongoose.model('Superuser', SuperUserSchema);