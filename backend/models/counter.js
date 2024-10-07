var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterSchema = Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, required: true }
});

var Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);
// var Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;