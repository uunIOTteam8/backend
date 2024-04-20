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
const { createSchema, updateSchema } = require("../validators/medicine-validator");

// Routes
router.post("/create", validateToken, validate(createSchema), async (req, res) => {
	await createMedicineAbl(req, res);
});

router.get("/get/:id", validateToken, async (req, res) => {
	await getMedicineAbl(req, res);
});

router.get("/getByMedsTaker/:medsTakerId", validateToken, async (req, res) => {
	await getMedicineByMedsTakerAbl(req, res);
});

router.post("/delete/:id", validateToken, async (req, res) => {
	await deleteMedicineAbl(req, res);
});

router.post("/update/:id", validateToken, validate(updateSchema), async (req, res) => {
	await updateMedicineAbl(req, res);
});

module.exports = router;
