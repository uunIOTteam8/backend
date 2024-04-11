const Joi = require("joi");

const CreateSchema = Joi.object({
	name: Joi.string().min(1).max(50).required(),
});

const GetSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const DeleteSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const ListSchema = Joi.object({
});

module.exports = {
	GetSchema,
	CreateSchema,
	DeleteSchema,
	ListSchema
};
