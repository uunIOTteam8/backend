const Joi = require('joi');

const GetSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const CreateSchema = Joi.object({
    //supervisor: Joi.string().hex().length(24).required(),
    name: Joi.string().min(3).required(),
    phone_country_code: Joi.number().min(1).max(2000).required(),
    phone_number: Joi.number().min(100).max(999999999999999).required(),
});

const UpdateSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(3),
    phone_country_code: Joi.number().min(1).max(2000),
    phone_number: Joi.number().min(100).max(999999999999999),
});

const DeleteSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const ListSchema = Joi.object({
    //supervisor: Joi.string().hex().length(24).required(),
});
module.exports = {GetSchema, CreateSchema, UpdateSchema, DeleteSchema, ListSchema};