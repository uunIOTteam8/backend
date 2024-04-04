const mongoose = require('mongoose');

const medsTakerSchema = new mongoose.Schema({
    supervisor: {
        type: String, //TODO ID
        required: true,
        min: 3,
        max: 255
    },
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    phone_country_code: {
        type: Number,
        required: true,
        min: 1,
        max: 2000
    },
    phone_number: {
        type: Number,
        required: true,
        min: 100,
        max: 999999999999999
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('MedsTaker', medsTakerSchema);