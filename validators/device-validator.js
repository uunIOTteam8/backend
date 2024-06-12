const Joi = require('joi');

const CreateSchema = Joi.object({
    serialNumber: Joi.string().min(1).max(50).required(),
});

const PairSchema = Joi.object({
    serialNumber: Joi.string().min(1).max(50).required(),
});

const UnpairSchema = Joi.object({
    serialNumber: Joi.string().min(1).max(50).required(),
});

const GetStateSchema = Joi.object({
    serialNumber: Joi.string().min(1).max(50).required(),
});

const SetBatterySchema = Joi.object({
    serialNumber: Joi.string().min(1).max(50).required(),
    battery: Joi.number().min(0).max(100).required(),
});

module.exports = {CreateSchema, PairSchema, UnpairSchema, GetStateSchema, SetBatterySchema};