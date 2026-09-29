

'use strict'

var mongoose = require('mongoose')
var mongooPaginate = require('mongoose-paginate-v2')
var Schema = mongoose.Schema
 

var PersonnelSchema = Schema({

    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
        address:{
            street_1: { type: String, required: true },
            street_2: { type: String },
            aptOrNum: { type: String },
            sector_name: { type: String, required: true },
            province: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
        },
        phone1: { type: String, required: true },
        phone2: { type: String },
        avatar:{type:String},
        cargo:{type:String, required: true},
        role: { type: String , default: "ROLE_PERSONNEL"},
        createdAt: { type: Date, default: Date.now },
        shift: {
            days:String,
            schedule: Number
        },
        status:{type:String, default: "INACTIVE"}
        
    


})

PersonnelSchema.method.toJSON = function () {
    var obj = this.toObject()
    delete obj.password
    return obj
}

PersonnelSchema.plugin(mongooPaginate);

module.exports = mongoose.model('personnel', PersonnelSchema);
