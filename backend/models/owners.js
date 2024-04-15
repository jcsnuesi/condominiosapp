'use strict'

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
    role: { type: String, default: 'TENANT' }
})

mongoose.model('FamilySchema', FamilySchema);

var OwnerSchema = Schema({ 

    avatar: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    fechaNacimiento: { type: String, required: true },
    phone: { type: String, required: true },
    phone2: { type: String},
    email: { type: String, required: true },
    password: { type: String, required: true },
    propertyDetails: [
        {             
            addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Condominium', required: true },
            condominium_unit: [{ type: String, required: true }],
            parkingsQty: [{ type: Number, required: true }],
            createdAt: { type: Date, default: Date.now }
        }
    ],
    familyAccount: [FamilySchema],   
    occupantId: [
        { 
            occupant: { type: mongoose.Schema.Types.ObjectId, ref: 'Occupant' }
            
        }
    ],
    role: { type: String, default: 'OWNER' },
    status: { type: String, default: 'active'},
    id_number: { type: String, required: true },
    adminId: [{ type: mongoose.Schema.Types.ObjectId, ref:'Admin'}],
    id_image_front: { type: String, required: true },
    id_image_back: { type: String, required: true }
   
        
}, 
{ timestamps: true }) 

OwnerSchema.method.toJSON = function(){
    var obj = this.toObject()
    delete obj.password
    return obj
}

module.exports = mongoose.model('Owner', OwnerSchema);

