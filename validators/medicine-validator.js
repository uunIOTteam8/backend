const Joi = require("joi");

const createSchema = Joi.object({
	name: Joi.string().min(1).max(255).required(),
	medsTaker: Joi.string().hex().length(24).required(),
	unit: Joi.string().hex().length(24).required(),
	count: Joi.number().integer().min(0).max(1023).required(),
	addPerRefill: Joi.number().positive().integer().min(1).max(511).required(),
	oneDose: Joi.number().positive().integer().min(1).max(255).required(),
	notifications: Joi.boolean().required(),
	period: Joi.array()
		.items(
			Joi.string().valid(
				"daily",
				"weekly",
				"monthly",
				"yearly",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday"
			)
		)
		.unique()
		.required(),
	reminder: Joi.array().items(
		Joi.object({
			time: Joi.string()
				.pattern(/^([01][0-9]|2[0-3]):([0-5][0-9])$/)
				.required(),
			dose: Joi.number().positive().integer().min(1).max(255).required(),
		})
	),
	history: Joi.array().items(Joi.date()),
});

const updateSchema = Joi.object({
	name: Joi.string().min(1).max(255),
	medsTaker: Joi.string().hex().length(24),
	unit: Joi.string().hex().length(24),
	count: Joi.number().integer().min(0).max(1023),
	addPerRefill: Joi.number().positive().integer().min(1).max(511),
	oneDose: Joi.number().positive().integer().min(1).max(255),
	notifications: Joi.boolean(),
	period: Joi.array()
		.items(
			Joi.string().valid(
				"daily",
				"weekly",
				"monthly",
				"yearly",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday"
			)
		)
		.unique(),
	reminder: Joi.array().items(
		Joi.object({
			time: Joi.string().pattern(/^([01][0-9]|2[0-3]):([0-5][0-9])$/),
			dose: Joi.number().positive().integer().min(1).max(255),
		})
	),
	history: Joi.array().items(Joi.date()),
});

module.exports = {
	createSchema,
	updateSchema,
};
