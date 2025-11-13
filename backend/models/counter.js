const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

// Export the model, checking if it already exists
module.exports =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
