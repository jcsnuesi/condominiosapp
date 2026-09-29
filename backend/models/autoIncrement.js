const mongoose = require('mongoose');

const AutoIncrementSchema = new mongoose.Schema({
    // Otros campos del documento
    autoIncrementField: {
        type: Number,
        default: 0,
    },
});

const AutoIncrementModel = mongoose.model('AutoIncrement', AutoIncrementSchema);

module.exports = AutoIncrementModel;
