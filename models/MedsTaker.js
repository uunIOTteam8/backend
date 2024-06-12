const mongoose = require('mongoose');
const { Schema } = mongoose;

const medsTakerSchema = new mongoose.Schema({
    supervisor: {
        type: Schema.Types.ObjectId,
        required: true,
        min: 24,
        max: 24
    },
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    phone_country_code: {
        type: String,
        required: false,
        min: 1,
        max: 4
    },
    phone_number: {
        type: String,
        required: false,
        min: 3,
        max: 15
    },
    device: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Device'
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('MedsTaker', medsTakerSchema);