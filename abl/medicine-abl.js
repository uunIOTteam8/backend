const MedicineDAO = require("../dao/medicine-mongo");

async function createMedicineAbl(req, res) {
	try {
		const newMedicine = await MedicineDAO.createMedicine(req.body);
		//TODO check if medstaker exists, check if unit exists, put in meds taker automatically?
		res.status(200).json(newMedicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function getMedicineAbl(req, res) {
	try {
		const medicine = await MedicineDAO.getMedicine(req.params.id);
		//TODO authorization

		if (!medicine) {
			return res.status(404).json({ message: "Medicine not found" });
		}

		res.status(200).json(medicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function getMedicineByMedsTakerAbl(req, res) {
	try {
		const medicines = await MedicineDAO.getMedicineByMedsTaker(req.params.medsTakerId);
		//TODO put in meds taker automatically?
		res.status(200).json(medicines);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function deleteMedicineAbl(req, res) {
	try {
		const medicine = await MedicineDAO.getMedicine(req.params.id);
		if (!medicine) {
			return res.status(404).json({ message: "Medicine not found" });
		}
		//TODO: check if user is allowed to delete
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
			return res.status(404).json({ message: "Medicine not found" });
		}

		const updatedMedicine = await MedicineDAO.updateMedicine(req.params.id, req.body);
		//TODO check if user is allowed to update
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
