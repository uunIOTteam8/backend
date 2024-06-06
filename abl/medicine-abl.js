const MedicineDAO = require("../dao/medicine-mongo");
const MedsTakerDAO = require("../dao/medsTaker-mongo");
const UnitDAO = require("../dao/unit-mongo");
const { RRule } = require("rrule");

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

		// Create RRule
		const rule = new RRule({
			freq: RRule.WEEKLY,
			byweekday: req.body.reminder.recurrenceRule.byweekday,
			byhour: req.body.reminder.recurrenceRule.byhour,
			byminute: req.body.reminder.recurrenceRule.byminute,
			bysecond: [0],
		});

		//assemble final object
		const medicine = {
			name: req.body.name,
			medsTaker: req.body.medsTaker,
			unit: req.body.unit,
			count: req.body.count,
			addPerRefill: req.body.addPerRefill,
			notifications: req.body.notifications,
			reminder: {
				recurrenceRule: rule.toString(),
				dose: req.body.reminder.dose,
			},
			history: req.body.history,
		};

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

		// Create RRule
		const rule = req.body.reminder
			? new RRule({
					freq: RRule.WEEKLY,
					byweekday: req.body.reminder.recurrenceRule.byweekday,
					byhour: req.body.reminder.recurrenceRule.byhour,
					byminute: req.body.reminder.recurrenceRule.byminute,
					bysecond: [0],
			  })
			: null;

		const updatedMedicine = await MedicineDAO.updateMedicine(
			req.params.id,
			req.body,
			rule.toString()
		);
		res.status(200).json(updatedMedicine);
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
};
