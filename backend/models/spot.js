'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var mongooPaginate = require('mongoose-paginate-v2')
var AutoIncrementModel = require('./autoIncrement')

var spotDetails = Schema({

    id: { type: Number, default: 0 },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    phone1: { type: String, required: true },
    phone2: { type: String },
    email: { type: String, required: true },
    address: { type: 'objectId', ref: 'Condominium' },
    aptNum:{type:String, required:true},
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date },
    spot_status: { type: String, default: 'unverified' }

})

spotDetails.pre('save', async function (next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const counter = await AutoIncrementModel.findOneAndUpdate(
            { _id: spotDetails.id },
            { $inc: { sequence_value: 1 } },
            { upsert: true, new: true }
        );

        this.autoIncrementField = counter.sequence_value;

        return next();
    } catch (err) {
        return next(err);
    }
});



spotDetails.plugin(mongooPaginate);

module.exports = mongoose.model('SpotDetails', spotDetails) 