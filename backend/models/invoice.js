"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongooPaginate = require("mongoose-paginate-v2");
var Counter = require("./counter");

var InvoiceSchema = Schema(
  {
    condominiumId: { type: mongoose.Schema.Types.ObjectId, ref: "Condominium" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    invoice_number: { type: Number },
    invoice_paid_date: { type: Date, default: null },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date },
    amount: { type: Number, required: true },
    status: { type: String, default: "new" },
    // invoice_type: { type: String, required: true },
    description: { type: String },
    unit: { type: String },
    paymentMethod: { type: String },
    paymentDescription: { type: String },
    paymentStatus: { type: String, default: "pending" },
  },
  { timestamps: true }
);

// Middleware para incrementar el id_invoice antes de guardar
InvoiceSchema.pre("save", async function (next) {
  const invoice = this;

  if (invoice.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "invoice_number" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    invoice.invoice_number = counter.sequence_value;
  }

  next();
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
