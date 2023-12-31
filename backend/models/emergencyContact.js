
var mongoose = require('mongoose')
var Schema = mongoose.Schema


var EmergencySchema = Schema({
    userInfo: { type: mongoose.Schema.Types.ObjectId, ref:'Owner'},
    emergencyContact:[{
        name: { type: String, required: true },
        phone: { type: String, required: true },
        phone2: { type: String, required: true },
        relationship: { type: String, required: true }}]
  
})

module.exports = mongoose.model('EmergencyContact', EmergencySchema);