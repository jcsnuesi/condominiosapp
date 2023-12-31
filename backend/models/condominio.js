'use strict'
 
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var mongooPaginate = require('mongoose-paginate-v2')

var EmployeesSchema = Schema({

    avatar: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },   
    phone: [{ type: String, required: true }],
})

const employees = mongoose.model('Employees', EmployeesSchema )

var CondominiumSchema = Schema({
   
    avatar: { type: String },
    alias: { type: String, required: true },
    type: { type: String, required: true },
    phone: [],
    street_1: { type: String, required: true },
    street_2: { type: String },    
    sector_name: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zipcode: { type: String }, 
    country: { type: String, required: true },
    socialAreas: [{ type: String }],    
    status: { type: String, default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, default: 'Admin' } ,
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true }], 
    employees: [EmployeesSchema] 
}, {timestamps:true})

CondominiumSchema.plugin(mongooPaginate);

module.exports = mongoose.model('Condominium', CondominiumSchema) 
