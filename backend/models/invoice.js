'use strict'


var {mongoose,autoIncrement} = require('../index')
var Schema = mongoose.Schema
var mongooPaginate = require('mongoose-paginate-v2')

var InvoiceSchema = Schema({

    invoice_number: { type: String, required: true },
    invoice_date: { type: Date, required: true },
    invoice_due: { type: Date, required: true },
    invoice_amount: { type: Number, required: true },
    invoice_status: { type: String, required: true },
    // invoice_type: { type: String, required: true },
    invoice_description: { type: String, required: true },
    condominiumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Condominium', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
    status: { type: String, default: 'active' },
    paymentMethod: { type: String, required: true },
    paymentDescription: { type: String, required: true },
    paymentStatus: { type: String, default:"pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, {timestamps:true})

InvoiceSchema.plugin(autoIncrement.plugin, 
    { 
        model: 'Invoice', 
        field: 'invoice_number', 
        startAt: 1, 
        incrementBy: 1 

    });

exports.module = mongoose.model('Invoice', InvoiceSchema)
