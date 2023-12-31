'use strict'
  
var mongoose = require('mongoose')
var Schema = mongoose.Schema

// var AddressSchema = Schema({

//     addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
//     parkingQty: { type: Number, required: true, default: "0" },
//     invoiceIssueDay: { type: String, required: true },
//     apartmentUnit: { type: String, required: true },
//     ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner'},
    
// }, { timestamps: true })

// var AddressInfo = mongoose.model('AddressSchame', AddressSchema)


var DireccionSchema = Schema({

    alias: { type: String, required: true },  
    monthlyPayment: { type: Number, required: true },
    phone1: { type: String},
    phone2: { type: String },
    street_1: { type: String, required: true },
    street_2: { type: String }, 
    sector_name: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },   
    socialAreas: [{ type: String}],    
    updatedByAdmin: {
        idAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
        date: { type: Date, default: Date.now }
    },
    updatedByStaff: {
        idStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
        date: { type: Date, default: Date.now }
    } ,
   
    status:{type:String, default:'active'},
    createByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
 
}, { timestamps: true })

module.exports = mongoose.model('Address', DireccionSchema );