const Medicine = require("../models/Medicine");
const mongoose = require("mongoose");

class MedicineDAO {
	async createMedicine(medicine) {
		try {
			const newMedicine = new Medicine(medicine);
			return await newMedicine.save();
		} catch (error) {
			throw error;
		}
	}

	async getMedicine(id) {
		try {
			return await Medicine.findById(id);
		} catch (error) {
			throw error;
		}
	}

	async getMedicineByMedsTaker(medsTakerId) {
		try {
			return await Medicine.find({ medsTaker: medsTakerId });
		} catch (error) {
			throw error;
		}
	}

	async deleteMedicine(id) {
		try {
			return await Medicine.findByIdAndDelete(id);
		} catch (error) {
			throw error;
		}
	}

	async updateMedicine(id, medicine, reminder) {
		try {
			return await Medicine.findByIdAndUpdate(
				id,
				{
					$set: {
						name: medicine.name,
						unit: medicine.unit,
						count: medicine.count,
						addPerRefill: medicine.addPerRefill,
						notifications: medicine.notifications,
						reminder: reminder,
					},
					$push: { history: medicine.history },
				},
				{ new: true, runValidators: true }
			);
		} catch (error) {
			throw error;
		}
	}

	async updateMedicinesHistory(medsArray) {
		try {
			for (const element of medsArray) {
				const history = {
					startDate: element.startDate,
					endDate: element.endDate,
					dose: element.dose,
					state: element.state,
				};

				await Medicine.findByIdAndUpdate(
					{ _id: element.id },
					{
						$push: {
							history: history,
						},
					},
					{ new: true, runValidators: true }
				);
			}
		} catch (error) {
			throw error;
		}
	}

	async setMedicinesHistoryAsNotified(medsArray) {
		try {
			for (const element of medsArray) {
				await Medicine.updateOne(
					{ _id: element.id },
					{
						$set: {
							"history.$[elem].notified": true,
						}
					},
					{ arrayFilters: [{ "elem._id": element.historyId }], runValidators: true }
				);
			}
		} catch (error) {
			throw error;
		}
	}

	async takeMedicine(time, meds, histories) {
		try {
			for (const element of histories) {
				await Medicine.updateOne(
					{ _id: { $in: meds } },
					{
						$set: {
							"history.$[elem].endDate": time,
							"history.$[elem].state": "Taken",
						},
						$inc: {
							count: -element.dose,
						},
					},
					{ arrayFilters: [{ "elem._id": element.id }], runValidators: true }
				);
			}
		} catch (error) {
			throw error;
		}
	}

	async forgetMedicine(time) {
		try {
			await Medicine.updateMany(
				{
					// Filter for documents where there is an "Active" state with a past "endDate"
					"history.state": "Active",
					"history.endDate": { $lt: time },
				},
				{
					// Set the state to "Forgotten" for history items that match the filter
					$set: { "history.$[elem].state": "Forgotten" },
				},
				{
					// Array filters to apply the update only to matching elements
					arrayFilters: [{ "elem.state": "Active", "elem.endDate": { $lt: time } }],
				}
			);
		} catch (error) {
			throw error;
		}
	}
}

module.exports = new MedicineDAO();
