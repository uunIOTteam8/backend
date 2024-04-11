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
		oneDose: {
			type: Number,
			required: true,
			min: 1,
			max: 255,
		},
		notifications: {
			type: Boolean,
			required: true,
		},
		period: [{ type: String, required: true, min: 2, max: 32 }],
		reminder: [
			{
				type: Map,
				of: new mongoose.Schema({
					time: { type: String, required: true },
					dose: { type: Number, required: true, min: 1, max: 255 },
				}),
			},
		],
		history: [{ type: Date }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Medicine", medicineSchema);
