'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var counterSchema = Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }

})

const Counter = mongoose.model('Counter', counterSchema);


const CxcSchema = Schema({

    InvoiceNumber: { type: Number, unique: true },
    type_of_payment: { type: String, required:true},    
    customer: { type: String, required:true },   
    status:{type:String, default: "normal"},
    PendingBalance:[{type:Number}],
    TotalPendingBalance: { type: Number },
    issueDate:{type:String, required:true},
    dateOverDue:{type:String},
    qtyOfDaysOverDue:{type:String},

}, { timestamps: true })

CxcSchema.pre('save', async function (next) {

    const doc = this;
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: doc._id },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        doc.numeroFactura = counter.sequence_value;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('Cxc', CxcSchema)

