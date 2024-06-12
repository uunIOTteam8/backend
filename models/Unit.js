const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			min: 1,
			max: 63,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Unit", unitSchema);