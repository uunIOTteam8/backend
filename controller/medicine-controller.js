const express = require("express");
const router = express.Router();

// ABL
const { createMedicineAbl } = require("../abl/medicine-abl");

// Middleware
const validate = require("../middlewares/validation-middleware");
const { validateToken } = require("../utils/JWT");

// Validators
const { medicineSchema } = require("../validators/medicine-validator");

// Routes
router.post(
  "/create",
  validateToken,
  validate(medicineSchema),
  async (req, res) => {
    await createMedicineAbl(req, res);
  }
);

module.exports = router;
