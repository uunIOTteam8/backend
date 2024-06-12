const MedicineDAO = require("../dao/medicine-mongo");
const MedsTakerDAO = require("../dao/medsTaker-mongo");
const UnitDAO = require("../dao/unit-mongo");
const DeviceDAO = require("../dao/device-mongo");
const UserDAO = require("../dao/user-mongo");
const { RRule } = require("rrule");
const { sendSMS } = require("../utils/SMS");

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
		//fetch device info to get medsTakerId, then medsTaker and then it's medicines
		const device = await DeviceDAO.getDevice(req.body.deviceId);
		if (!device) {
			return res.status(404).json({ message: "Device does not exist" });
		}
		const medsTaker = await MedsTakerDAO.GetMedsTakerByDevice(device._id);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker does not exist" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}
		const supervisor = await UserDAO.findUserById(medsTaker.supervisor);
		const medicines = await MedicineDAO.getMedicineByMedsTaker(medsTaker._id);
		const units = await UnitDAO.ListOfUnit();

		//set all meds that are in history active but past interval to forgotten
		await MedicineDAO.forgetMedicine(req.body.time);

		const infoToSendToDevice = [];
		const infoToUpdateHistory = [];
		const smsToSend = [];

		const startInterval = new Date(req.body.time);
		startInterval.setHours(startInterval.getHours() - 1);
		const endInterval = new Date(req.body.time);
		endInterval.setHours(endInterval.getHours() + 1);

		//filter all meds that are to be taken from startInterval to endInterval time (currently +-1 hour)
		medicines.forEach((medicine) => {
			medicine.reminder.forEach((reminder) => {
				//check if there are any relevant rrules for the interval
				const rule = RRule.fromString(reminder.recurrenceRule);
				const relevantMeds = rule.between(startInterval, endInterval);

				//if there is at least one relevant rrule, check if the med is already in history
				if (relevantMeds.length > 0) {
					const isInHistory = medicine.history.find(
						(h) => h.startDate.toString() === relevantMeds[0].toString()
					);
					//1) med is not in history yet - send to device and history
					if (!isInHistory) {
						const unit = units.find((unit) => unit.id.toString() === medicine.unit.toString());
						const endDate = new Date(relevantMeds[0]);
						endDate.setHours(endDate.getHours() + 1);
						const dose = medicine.reminder.find(
							(reminder) => rule.toString() === reminder.recurrenceRule
						).dose;
						infoToSendToDevice.push({
							id: medicine._id,
							name: medicine.name,
							dose: dose,
							isEmpty: medicine.count ? false : true,
							unit: unit.name,
						});

						infoToUpdateHistory.push({
							id: medicine._id,
							startDate: relevantMeds[0], //the time from rrule, when reminder is set
							endDate: endDate, //startDate + hour
							dose: dose,
							state: "Active",
						});
					}
					//2) med is in history as active - send to device but not history
					//TODO how would this work if it was there twice with different rrules?
					else if (isInHistory.state === "Active") {
						const unit = units.find((unit) => unit.id.toString() === medicine.unit.toString());
						const dose = medicine.reminder.find(
							(reminder) => rule.toString() === reminder.recurrenceRule
						).dose;
						infoToSendToDevice.push({
							id: medicine._id,
							name: medicine.name,
							dose: dose,
							isEmpty: medicine.count ? false : true,
							unit: unit.name,
						});

						// if the time is more than half hour after startDate, add medicine name to smsToSend
						if (new Date(req.body.time).getTime() - isInHistory.startDate.getTime() > 1800000 && !isInHistory.notified) {
							smsToSend.push(medicine.name);
						}
					}
					//3) med is in history as taken - don't send to device or history
					//doesn't really need to be here but I wouldn't remember if it weren't there
					else if (isInHistory.state === "Taken" || isInHistory.state === "Forgotten") {
						// infoToSendToDevice.push({
						// 	message: `${medicine.name} Is already taken! :)`,
						// });
					}
				}
			});
		});

		//put meds sent to device into history active state
		infoToUpdateHistory.length > 0
			? await MedicineDAO.updateMedicinesHistory(infoToUpdateHistory)
			: null;

		//send sms if there are any meds to send
		if (smsToSend.length > 0) {
			await sendSMS(supervisor.phone_country_code + supervisor.phone_number, `Medstaker ${medsTaker.name} has not taken their medicine.`);
			if (medsTaker.phone_country_code && medsTaker.phone_number) {
				await sendSMS(medsTaker.phone_country_code + medsTaker.phone_number, `Don't forget to take your medicine!`);
			}
		}

		res.status(200).json(infoToSendToDevice);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function takeMedsAbl(req, res) {
	try {
		let medicines = undefined;

		if (req.body.deviceId) {
			const device = await DeviceDAO.getDevice(req.body.deviceId);
			if (!device) {
				return res.status(404).json({ message: "Device does not exist" });
			}
			const medsTaker = await MedsTakerDAO.GetMedsTakerByDevice(device._id);
			if (!medsTaker) {
				return res.status(404).json({ message: "MedsTaker does not exist" });
			}
			if (medsTaker.supervisor !== req.userId) {
				return res.status(403).json({ message: "User is not authorized" });
			}
			medicines = await MedicineDAO.getMedicineByMedsTaker(medsTaker._id);
		} else if (req.body.medsTakerId) {
			const medsTaker = await MedsTakerDAO.GetMedsTaker(req.body.medsTakerId);
			if (!medsTaker) {
				return res.status(404).json({ message: "MedsTaker does not exist" });
			}
			if (medsTaker.supervisor !== req.userId) {
				return res.status(403).json({ message: "User is not authorized" });
			}
			medicines = await MedicineDAO.getMedicineByMedsTaker(req.body.medsTakerId);
		} else {
			return res.status(400).json({ message: "Provide deviceId or medsTakerId." });
		}

		const historiesToUpdate = [];
		medicines.forEach((medicine) => {
			let currentCount = medicine.count;

			medicine.history.forEach((history) => {
				if (history.state === "Active") {
					currentCount -= history.dose;

					historiesToUpdate.push({
						id: history._id,
						// if count is more or equal to current dose, remove current dose, otherwise remove remaining count
						dose: currentCount >= 0 ? history.dose : history.dose + currentCount
					});

					// cap the currentCount to 0
					currentCount <= 0 ? 0 : currentCount
				}
			});
		});

		//go through medsTakers medicines and if there's active in history, set it to Taken and endTime of button press
		await MedicineDAO.takeMedicine(req.body.time, req.body.meds, historiesToUpdate);

		if (historiesToUpdate.length > 0) {
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
