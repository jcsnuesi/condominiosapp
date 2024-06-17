'use strict'

const { max } = require('moment');
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FamilySchema = Schema({
 
    avatar: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: [{ type: String, required: true }],
    status: { type: String, default: 'active'},
    role: { type: String, default: 'FAMILY' }
})

mongoose.model('FamilySchema', FamilySchema);

var OwnerSchema = Schema({ 

    avatar: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String },
    phone: { type: String, required: true, unique: true },
    phone2: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    propertyDetails: [
        {
            _id: false,          
            addressId: {                 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Condominium', 
                required: true},                
            condominium_unit: {
                type: String, required: true, max: 5
                },
            parkingsQty: { type: Number, required: true, max: 5 },
            isRenting: { type: Boolean, default: false },
            occupantId: [{ occupant: { type: mongoose.Schema.Types.ObjectId, ref: 'Occupant' } }],
            createdAt: { type: Date, default: Date.now }
        }
    ],
    familyAccount: [FamilySchema],     
    role: { type: String, default: 'OWNER' },
    status: { type: String, default: 'active'},
    emailVerified: { type: Boolean, default: false },
    id_number: {
        type: String, required: true, max: 11, min: 11},
    id_image_front: { type: String },
    id_image_back: { type: String }
   
        
}, 
{ timestamps: true }) 

OwnerSchema.method.toJSON = function(){
    var obj = this.toObject()
    delete obj.password
    return obj
}

module.exports = mongoose.model('Owner', OwnerSchema);

