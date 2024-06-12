const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone_country_code: Joi.string().min(1).max(4).required(),
    phone_number: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

module.exports = {
    registerSchema,
    loginSchema
};