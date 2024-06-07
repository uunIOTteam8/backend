const MedicineDAO = require("../dao/medicine-mongo");
const MedsTakerDAO = require("../dao/medsTaker-mongo");
const UnitDAO = require("../dao/unit-mongo");
const DeviceDAO = require("../dao/device-mongo");
const { RRule, RRuleSet } = require("rrule");

async function createMedicineAbl(req, res) {
	try {
		const medsTaker = await MedsTakerDAO.GetMedsTaker(req.body.medsTaker);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker does not exist" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}

		const unit = await UnitDAO.GetUnit(req.body.unit);
		if (!unit) {
			return res.status(404).json({ message: "Unit does not exist" });
		}

		//assemble final object
		const medicine = {
			name: req.body.name,
			medsTaker: req.body.medsTaker,
			unit: req.body.unit,
			count: req.body.count,
			addPerRefill: req.body.addPerRefill,
			notifications: req.body.notifications,
			reminder: [],
			history: req.body.history,
		};

		// Create RRule and push to reminder
		req.body.reminder.forEach((reminder) => {
			const rule = {};
			rule.recurrenceRule = new RRule({
				freq: RRule.WEEKLY,
				byweekday: reminder.recurrenceRule.byweekday,
				byhour: reminder.recurrenceRule.byhour,
				byminute: reminder.recurrenceRule.byminute,
				bysecond: [0],
			});
			rule.recurrenceRule.toString();
			rule.dose = reminder.dose;

			medicine.reminder.push(rule);
		});

		const newMedicine = await MedicineDAO.createMedicine(medicine);
		res.status(200).json(newMedicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function getMedicineAbl(req, res) {
	try {
		const medicine = await MedicineDAO.getMedicine(req.params.id);
		if (!medicine) {
			return res.status(404).json({ message: "Medicine does not exist" });
		}

		const medsTaker = await MedsTakerDAO.GetMedsTaker(medicine.medsTaker);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker does not exist" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}

		res.status(200).json(medicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function getMedicineByMedsTakerAbl(req, res) {
	try {
		const medsTaker = await MedsTakerDAO.GetMedsTaker(req.params.medsTakerId);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker does not exist" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}

		const medicines = await MedicineDAO.getMedicineByMedsTaker(req.params.medsTakerId);

		res.status(200).json(medicines);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function deleteMedicineAbl(req, res) {
	try {
		const medicine = await MedicineDAO.getMedicine(req.params.id);
		if (!medicine) {
			return res.status(404).json({ message: "Medicine does not exist" });
		}

		const medsTaker = await MedsTakerDAO.GetMedsTaker(medicine.medsTaker);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker does not exist" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}

		const deletedMedicine = await MedicineDAO.deleteMedicine(req.params.id);
		res.status(200).json(deletedMedicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function updateMedicineAbl(req, res) {
	try {
		const medicine = await MedicineDAO.getMedicine(req.params.id);
		if (!medicine) {
			return res.status(404).json({ message: "Medicine does not exist" });
		}

		const medsTaker = await MedsTakerDAO.GetMedsTaker(medicine.medsTaker);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker does not exist" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}

		if (req.body.unit) {
			const unit = await UnitDAO.GetUnit(req.body.unit);
			if (!unit) {
				return res.status(404).json({ message: "Unit does not exist" });
			}
		}

		// Create RRules array
		const rules = [];
		if (req.body.reminder && req.body.reminder.length > 0) {
			// Create RRule and push to rules array
			req.body.reminder.forEach((reminder) => {
				const rule = {};
				rule.recurrenceRule = new RRule({
					freq: RRule.WEEKLY,
					byweekday: reminder.recurrenceRule.byweekday,
					byhour: reminder.recurrenceRule.byhour,
					byminute: reminder.recurrenceRule.byminute,
					bysecond: [0],
				});
				rule.recurrenceRule.toString();
				rule.dose = reminder.dose;

				rules.push(rule);
			});
		}

		const updatedMedicine = await MedicineDAO.updateMedicine(req.params.id, req.body, rules);
		res.status(200).json(updatedMedicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function getMedsAbl(req, res) {
	try {
		//TODO some authorization???

		//fetch device info to get medsTakerId
		const device = await DeviceDAO.getDevice(req.body.deviceId);
		if (!device) {
			return res.status(404).json({ message: "Device does not exist" });
		}

		//fetch medicines for medsTaker belonging to device
		// const medicines = await MedicineDAO.getMedicineByMedsTaker(device.medsTakerId);
		//CANT BE DONE RN, MEDSTAKER ID IS UNDEFINED?????

		const medicines = await MedicineDAO.getMedicineByMedsTaker(req.body.medsTakerId);

		const result = [];
		medicines.forEach((medicine) => {
			const rule = RRule.fromString(medicine.reminder.recurrenceRule);
			const relevantMeds = rule.between(req.body.time, new Date("2024-6-8"));
			if (relevantMeds.length > 0) {
				result.push(medicine);
			}

			// console.log(rule);
		});

		res.status(200).json(result);
		// send back: meds: [{id?????, name, count, isEmpty - find out what that's supposed to be, unit}] - all the ones that have a date of in half an hour???
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function takeMedsAbl(req, res) {
	try {
		// const medicines = await MedicineDAO.getMedicine();
		res.status(200).json("hewwo");
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

module.exports = {
	createMedicineAbl,
	getMedicineAbl,
	getMedicineByMedsTakerAbl,
	deleteMedicineAbl,
	updateMedicineAbl,
	getMedsAbl,
	takeMedsAbl,
};
