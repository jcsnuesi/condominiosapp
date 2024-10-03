'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema
var mongooPaginate = require('mongoose-paginate-v2')
var Counter = require('./counter')

var InvoiceSchema = Schema({

    invoice_number: { type: Number},
    invoice_paid_date: { type: Date, default:null },
    invoice_issue: { type: Date, required: true },
    invoice_due: { type: Date, required: true },
    invoice_amount: { type: Number, required: true },
    invoice_status: { type: String, default:"new" },
    // invoice_type: { type: String, required: true },
    invoice_description: { type: String },
    condominiumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Condominium' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner'},
    paymentMethod: { type: String },
    paymentDescription: { type: String },
    paymentStatus: { type: String, default:"pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
}, {timestamps:true})
 
// Middleware para incrementar el id_invoice antes de guardar
InvoiceSchema.pre('save', async function (next) {
    const invoice = this;

    if (invoice.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { _id: 'invoice_number' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );

        invoice.invoice_number = counter.sequence_value;
    }

    next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema)
