const MedicineDAO = require("../dao/medicine-mongo");
const MedsTakerDAO = require("../dao/medsTaker-mongo");
const UnitDAO = require("../dao/unit-mongo");
const DeviceDAO = require("../dao/device-mongo");
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
				dtstart: new Date(),
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
					dtstart: new Date(),
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
		// const device = await DeviceDAO.getDevice(req.body.deviceId);
		// if (!device) {
		// 	return res.status(404).json({ message: "Device does not exist" });
		// }
		//change this to getting medstaker from deviceId when it's implemented

		//fetch medicines for medsTaker belonging to device
		// const medicines = await MedicineDAO.getMedicineByMedsTaker(device.medsTakerId);
		//TODO remove medsTakerId from insomnia request

		const medicines = await MedicineDAO.getMedicineByMedsTaker(req.body.medsTakerId);

		const units = await UnitDAO.ListOfUnit();

		const infoToSendToDevice = [];
		const infoToUpdateHistory = [];

		const startInterval = new Date(req.body.time);
		startInterval.setHours(startInterval.getHours() - 1);
		const endInterval = new Date(req.body.time);
		endInterval.setHours(endInterval.getHours() + 1);

		//filter all meds that are to be taken from startInterval to endInterval time (currently +-1 hour)
		//TODO momentalne interval neobsahuje krajove hodnoty, chceme to tak nebo ne?
		//TODO change this to only look into the future and look into the history if the meds have been taken
		medicines.forEach((medicine) => {
			medicine.reminder.forEach((reminder) => {
				const rule = RRule.fromString(reminder.recurrenceRule);
				const relevantMeds = rule.between(startInterval, endInterval);
				if (relevantMeds.length > 0) {
					const unit = units.find((unit) => unit.id.toString() === medicine.unit.toString());
					infoToSendToDevice.push({
						id: medicine._id,
						name: medicine.name,
						dose: medicine.reminder.find((reminder) => rule.toString() === reminder.recurrenceRule)
							.dose,
						isEmpty: !medicine.count ? true : false,
						unit: unit.name,
					});

					infoToUpdateHistory.push({
						id: medicine._id,
						startDate: startInterval, //TODO not sure if this or req.body.time????
						endDate: endInterval, //TODO if meds are taken, go in and change this to time when meds are taken
						state: "Active", //TODO change this to forgotten if after endInterval, or taken if button is pressed
					});
				}
			});
		});

		//put meds sent to device into history active state
		infoToUpdateHistory.length > 0
			? await MedicineDAO.updateMedicinesHistory(infoToUpdateHistory)
			: null;

		res.status(200).json(infoToSendToDevice);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function takeMedsAbl(req, res) {
	try {
		if (req.body.deviceId) {
			//TODO find deviceId in medsTaker and do authorization
		} else if (req.body.medsTakerId) {
			const medsTaker = await MedsTakerDAO.GetMedsTaker(req.body.medsTakerId);
			if (!medsTaker) {
				return res.status(404).json({ message: "MedsTaker does not exist" });
			}
			if (medsTaker.supervisor !== req.userId) {
				return res.status(403).json({ message: "User is not authorized" });
			}
		} else {
			return res.status(400).json({ message: "Provide deviceId or medsTakerId." });
		}

		//go through medsTakers medicines and if there's active in history, set it to Taken and endTime of button press
		await MedicineDAO.takeMedicineAbl(req.body.time, req.body.meds);

		if (req.body.meds.length > 0) {
			res.status(200).json("Congratulations. You just took your meds. :)");
		} else {
			res.status(200).json("No meds to take at this time.");
		}
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
