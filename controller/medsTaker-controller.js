const express = require("express");
const router = express.Router();

// ABL
const { GetAbl, CreateAbl, UpdateAbl, DeleteAbl, ListAbl} = require("../abl/medsTaker-abl");

// Middleware
const validate = require("../middlewares/validation-middleware");
const { validateToken } = require("../utils/JWT");

// Validators
const { GetSchema, CreateSchema, UpdateSchema, DeleteSchema, ListSchema } = require("../validators/medsTaker-validator");

// Routes
router.get("/get", validateToken, validate(GetSchema), async (req, res) => {
    await GetAbl(req, res);
});

router.post("/create", validateToken, validate(CreateSchema), async (req, res) => {
    await CreateAbl(req, res);
});

router.post("/update", validateToken, validate(UpdateSchema), async (req, res) => {
    await UpdateAbl(req, res);
});

router.post("/delete", validateToken, validate(DeleteSchema), async (req, res) => {
    await DeleteAbl(req, res);
});

router.get("/list", validateToken, validate(ListSchema), async (req, res) => {
    await ListAbl(req, res);
});

module.exports = router;