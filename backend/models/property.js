'use strict'

var mongoose = require('mongoose')
var Schema =  mongoose.Schema
var mongooPaginate = require('mongoose-paginate-v2')


var PropertySchema =  Schema({

    ownerId: { type: 'ObjectId', ref: 'owner' },
    avatar: { type: String },
    alias: { type: String, required: true },
    street_1: { type: String, required: true },
    street_2: { type: String },
    aptOrNum: { type: String },
    sector_name: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date },
    RoomsNum: { type: String, required: true },
    BathNum: { type: String, required: true }
  
})

PropertySchema.plugin(mongooPaginate);

module.exports = mongoose.model('Property', PropertySchema) 