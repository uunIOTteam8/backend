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

	async takeMedicineAbl(time, meds) {
		try {
			return await Medicine.updateMany(
				{ _id: { $in: meds } },
				{
					$set: {
						"history.$[elem].endDate": time,
						"history.$[elem].state": "Taken",
					},
				},
				{
					arrayFilters: [{ "elem.state": "Active" }],
					new: true,
					runValidators: true,
				}
			);
		} catch (error) {
			throw error;
		}
	}
}

module.exports = new MedicineDAO();
