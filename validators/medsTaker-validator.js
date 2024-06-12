const Joi = require('joi');

const GetSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const CreateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    phone_country_code: Joi.string().min(1).max(4),
    phone_number: Joi.string().min(3).max(15),
    device: Joi.string().hex().length(24).required(),
});

const UpdateSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(3),
    phone_country_code: Joi.string().min(1).max(4),
    phone_number: Joi.string().min(3).max(15),
    device: Joi.string().hex().length(24),
});

const DeleteSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const ListSchema = Joi.object({
});
module.exports = {GetSchema, CreateSchema, UpdateSchema, DeleteSchema, ListSchema};