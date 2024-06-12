const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    phone_country_code: {
        type: String,
        required: true,
        min: 1,
        max: 4
    },
    phone_number: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);