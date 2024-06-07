const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			min: 1,
			max: 255,
		},
		medsTaker: {
			type: mongoose.ObjectId,
			required: true,
		},
		unit: {
			type: mongoose.ObjectId,
			required: true,
		},
		count: {
			type: Number,
			required: true,
			min: 0,
			max: 1023,
		},
		addPerRefill: {
			type: Number,
			required: true,
			min: 1,
			max: 511,
		},
		notifications: {
			type: Boolean,
			required: true,
		},
		reminder: [
			{
				recurrenceRule: {
					type: String,
					min: 1,
					max: 1023,
					required: true,
				},
				dose: {
					type: Number,
					min: 1,
					max: 255,
					required: true,
				},
				_id: false,
			},
		],
		history: [
			{
				startDate: { type: Date, required: true },
				endDate: { type: Date, required: true },
				state: { type: String, required: true },
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Medicine", medicineSchema);
