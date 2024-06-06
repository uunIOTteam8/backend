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
}

module.exports = new MedicineDAO();
