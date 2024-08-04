'use strict'

var mongoose = require('mongoose') 
var Schema = mongoose.Schema

var ContactPerson = Schema({

    name_contact: { type: String, required: true },
    lastname_contact: { type: String, required: true },
    gender_contact: { type: String, required: true },
    email_contact: { type: String, required: true },   
    phone_contact: [],
    role_contact: { type: String, required: true }
 
 
}, { timestamps :true})

var contactP = mongoose.model('ContactPerson', ContactPerson)
 
var AdminSchema = Schema({

    avatar: { type: String },
    company: { type: String, required: true },
    rnc: { type: String },
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref:'Staff' }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref:'Administrators' }],
    phone: [],    
    street_1: { type: String, required: true },
    street_2: { type: String},
    city: { type: String, required: true },
    state: { type: String, required: true }, 
    zipcode: { type: String }, 
    country: { type: String, required: true },
    email_company: { type: String, required: true },    
    password: { type: String, required: true }, 
    contact_person: [ContactPerson],   
    role: { type: String, default: 'ADMIN'},  
    status: { type: String, default: 'active'},
    verified: { type: Boolean, default: false},
    terms: { type: Boolean, default: false }
   
}, { timestamps: true })

AdminSchema.method.toJSON = function(){

    var obj = this.toObject()
    delete obj.password
    return obj
}



module.exports = mongoose.model('Admin', AdminSchema);