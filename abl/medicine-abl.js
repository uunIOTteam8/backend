const MedicineDAO = require("../dao/medicine-mongo");

async function createMedicineAbl(req, res) {
	try {
		const newMedicine = await MedicineDAO.createMedicine(req.body);
		res.status(200).json(newMedicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

module.exports = { createMedicineAbl };
