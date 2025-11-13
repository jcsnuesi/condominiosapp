"use strict";

const mongoose = require("mongoose");

// Check if Counter model already exists before creating it
let Counter;
try {
  Counter = mongoose.model("Counter");
} catch (error) {
  // Define Counter schema only if it doesn't exist
  const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 },
  });

  Counter = mongoose.model("Counter", CounterSchema);
}

const CxcSchema = new mongoose.Schema(
  {
    InvoiceNumber: { type: Number, unique: true },
    type_of_payment: { type: String, required: true },
    customer: { type: String, required: true },
    status: { type: String, default: "normal" },
    PendingBalance: [{ type: Number }],
    TotalPendingBalance: { type: Number },
    issueDate: { type: String, required: true },
    dateOverDue: { type: String },
    qtyOfDaysOverDue: { type: String },
  },
  { timestamps: true }
);

CxcSchema.pre("save", async function (next) {
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

// Check if CxC model already exists
let CxC;
try {
  CxC = mongoose.model("CxC");
} catch (error) {
  CxC = mongoose.model("CxC", CxcSchema);
}

module.exports = CxC;
