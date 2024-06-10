require('dotenv').config();
const fetch = require('node-fetch');

/*
    Použití:
    --------------------------------------------------
    const { sendSMS } = require('../utils/SMS');

    await sendSMS(cislo (string), zprava (string));
*/

const sendSMS = async (phone, message) => {
    try {
        if (process.env.SMS_SEND === "0") {
            console.log(`Sending SMS to ${phone} with message: ${message}`);
            return;
        }

        const body = {
            apikey: process.env.SMS_API_KEY,
            number: phone,
            message: message
        };

        const response = await fetch('https://http-api.smsmanager.cz/Send', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.log(e);
    }
}

module.exports = { sendSMS };