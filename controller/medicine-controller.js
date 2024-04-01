const express = require("express");
const router = express.Router();

// ABL
const {
	createMedicineAbl,
	getMedicineAbl,
	getMedicineByMedsTakerAbl,
	deleteMedicineAbl,
	updateMedicineAbl,
} = require("../abl/medicine-abl");

// Middleware
const validate = require("../middlewares/validation-middleware");
const { validateToken } = require("../utils/JWT");

// Validators
const { medicineSchema } = require("../validators/medicine-validator");

// Routes
router.post("/create", validateToken, validate(medicineSchema), async (req, res) => {
	await createMedicineAbl(req, res);
});

router.get("/get/:id", validateToken, async (req, res) => {
	await getMedicineAbl(req, res);
});

router.get("/getByMedsTaker/:medsTakerId", validateToken, async (req, res) => {
	await getMedicineByMedsTakerAbl(req, res);
});

router.delete("/delete/:id", validateToken, async (req, res) => {
	await deleteMedicineAbl(req, res);
});

router.patch("/update/:id", validateToken, async (req, res) => {
	await updateMedicineAbl(req, res);
});

module.exports = router;
