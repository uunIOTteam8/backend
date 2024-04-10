const express = require("express");
const router = express.Router();

// ABL
const {
	CreateUnitAbl,
	GetUnitAbl,
	DeleteUnitAbl,
    ListOfUnitAbl,
} = require("../abl/unit-abl");

// Middleware
const validate = require("../middlewares/validation-middleware");
const { validateToken } = require("../utils/JWT");

// Validators
const { GetSchema, CreateSchema, DeleteSchema, ListSchema } = require("../validators/unit-validator");

// Routes
router.post("/create", validateToken, validate(CreateSchema), async (req, res) => {
	await CreateUnitAbl(req, res);
});

router.get("/get", validateToken, validate(GetSchema), async (req, res) => {
	await GetUnitAbl(req, res);
});

router.post("/delete", validateToken, validate(DeleteSchema), async (req, res) => {
	await DeleteUnitAbl(req, res);
});

router.get("/list", validateToken, validate(ListSchema), async (req, res) => {
	await ListOfUnitAbl(req, res);
});

module.exports = router;