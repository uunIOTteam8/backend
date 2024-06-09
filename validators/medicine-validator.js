const Joi = require("joi");

const createSchema = Joi.object({
	name: Joi.string().min(1).max(255).required(),
	medsTaker: Joi.string().hex().length(24).required(),
	unit: Joi.string().hex().length(24).required(),
	count: Joi.number().integer().min(0).max(1023).required(),
	addPerRefill: Joi.number().positive().integer().min(1).max(511).required(),
	notifications: Joi.boolean().required(),
	reminder: Joi.array()
		.items(
			Joi.object({
				recurrenceRule: Joi.object({
					byweekday: Joi.array().items(Joi.number().valid(0, 1, 2, 3, 4, 5, 6)).unique().required(),
					byhour: Joi.array().items(Joi.number().integer().min(0).max(23)).unique().required(),
					byminute: Joi.array().items(Joi.number().integer().min(0).max(59)).unique().required(),
				}).required(),
				dose: Joi.number().positive().integer().min(1).max(255).required(),
			}).required()
		)
		.required(),
	history: Joi.array()
		.items(
			Joi.object({
				startDate: Joi.date().required(), //will be set to start of rrule
				endDate: Joi.date().required(), //will be set to start+some hours OR overwritten when the button was pressed
				state: Joi.string().valid("Active", "Forgotten", "Taken").required(),
			})
		)
		.required(),
});

const updateSchema = Joi.object({
	name: Joi.string().min(1).max(255),
	medsTaker: Joi.string().hex().length(24),
	unit: Joi.string().hex().length(24),
	count: Joi.number().integer().min(0).max(1023),
	addPerRefill: Joi.number().positive().integer().min(1).max(511),
	notifications: Joi.boolean(),
	reminder: Joi.array().items(
		Joi.object({
			recurrenceRule: Joi.object({
				byweekday: Joi.array().items(Joi.number().valid(0, 1, 2, 3, 4, 5, 6)).unique().required(),
				byhour: Joi.array().items(Joi.number().integer().min(0).max(23)).unique().required(),
				byminute: Joi.array().items(Joi.number().integer().min(0).max(59)).unique().required(),
			}).required(),
			dose: Joi.number().positive().integer().min(1).max(255).required(),
		})
	),
	history: Joi.array().items(
		Joi.object({
			startDate: Joi.date().required(),
			endDate: Joi.date().required(),
			state: Joi.string().valid("Active", "Forgotten", "Taken").required(),
		})
	),
});

const getMedsSchema = Joi.object({
	deviceId: Joi.string().hex().length(24).required(),
	medsTakerId: Joi.string().hex().length(24).required(), //TODO remove
	time: Joi.date().required(),
});

const takeMedsSchema = Joi.object({
	deviceId: Joi.string().hex().length(24).required(),
	time: Joi.date().required(),
	meds: Joi.array().items(Joi.string().hex().length(24).required()).required(),
	medsTakerId: Joi.string().hex().length(24).required(), //TODO remove
});

module.exports = {
	createSchema,
	updateSchema,
	getMedsSchema,
	takeMedsSchema,
};
