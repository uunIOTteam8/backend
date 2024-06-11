const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
    {
        serialNumber: {
            type: String,
            required: true,
            min: 1,
            max: 50,
        },
        battery: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 100
        },
        pairingCode: {
            type: String,
            required: false,
            min: 1,
            max: 5
        },
        pairingDate: {
            type: Date,
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);