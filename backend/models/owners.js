'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var OwnerSchema = Schema({

    avatar: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: [{ type: String, required: true }],
    propertyDetails: [
        {
            addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Condominium' },
            apartment: [{ type: String }],
            parkingsQty: [{ type: Number }],
            createdAt: { type: Date, default: Date.now }

        }
    ],   
    occupantId: [
        { 
            occupant: { type: mongoose.Schema.Types.ObjectId, ref: 'Occupant' }
            
           
    }],
    role: { type: String, default: 'OWNER' },
    status: { type: String, default: 'active'},
    id_number: { type: String, required: true },
    adminId: [{ type: mongoose.Schema.Types.ObjectId, ref:'Admin'}],
    id_image_front: { type: String, required: true },
    id_image_back: { type: String, required: true }
   
        
}, { timestamps: true }) 

OwnerSchema.method.toJSON = function(){
    var obj = this.toObject()
    delete obj.password
    return obj
}

module.exports = mongoose.model('Owner', OwnerSchema);