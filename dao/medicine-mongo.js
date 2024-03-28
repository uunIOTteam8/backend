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
}

module.exports = new MedicineDAO();
