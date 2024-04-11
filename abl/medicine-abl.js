const MedicineDAO = require("../dao/medicine-mongo");
const MedsTakerDAO = require("../dao/medsTaker-mongo");

async function createMedicineAbl(req, res) {
	try {
		const medsTaker = await MedsTakerDAO.GetMedsTaker(req.body.medsTaker);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker not found" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}

		const newMedicine = await MedicineDAO.createMedicine(req.body);
		//TODO check if unit exists
		res.status(200).json(newMedicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function getMedicineAbl(req, res) {
	try {
		const medicine = await MedicineDAO.getMedicine(req.params.id);
		if (!medicine) {
			return res.status(404).json({ message: "Medicine not found" });
		}

		const medsTaker = await MedsTakerDAO.GetMedsTaker(medicine.medsTaker);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker not found" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}
		//TODO check if unit exists
		res.status(200).json(medicine);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

async function getMedicineByMedsTakerAbl(req, res) {
	try {
		const medsTaker = await MedsTakerDAO.GetMedsTaker(req.params.medsTakerId);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker not found" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}
		//TODO check if unit exists
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
			return res.status(404).json({ message: "Medicine not found" });
		}

		const medsTaker = await MedsTakerDAO.GetMedsTaker(medicine.medsTaker);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker not found" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}
		//TODO check if unit exists
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

		const medsTaker = await MedsTakerDAO.GetMedsTaker(medicine.medsTaker);
		if (!medsTaker) {
			return res.status(404).json({ message: "MedsTaker not found" });
		}
		if (medsTaker.supervisor !== req.userId) {
			return res.status(403).json({ message: "User is not authorized" });
		}
		//TODO check if unit exists
		const updatedMedicine = await MedicineDAO.updateMedicine(req.params.id, req.body);
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
