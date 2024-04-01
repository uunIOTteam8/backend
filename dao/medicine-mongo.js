const Medicine = require("../models/Medicine");

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

	async updateMedicine(id, medicine) {
		try {
			return await Medicine.findByIdAndUpdate(
				id,
				//TODO figure out which values should be set and which push
				{
					$set: {
						name: medicine.name,
						unit: medicine.unit,
						count: medicine.count,
						addPerRefill: medicine.addPerRefill,
						oneDose: medicine.oneDose,
						notifications: medicine.notifications,
						period: medicine.period,
						reminder: medicine.reminder,
					},
					$push: { history: medicine.history },
				},
				{ new: true, runValidators: true }
			);
		} catch (error) {
			throw error;
		}
	}
}

//TODO delete all medicines after user, meds taker is deleted

module.exports = new MedicineDAO();
