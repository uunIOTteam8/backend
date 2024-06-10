const express = require("express");
const router = express.Router();

// ABL
const { CreateAbl, PairAbl, UnpairAbl, GetStateAbl, GetByCodeAbl } = require("../abl/device-abl");

// Middleware
const validate = require("../middlewares/validation-middleware");
const { validateToken } = require("../utils/JWT");

// Validators
const { CreateSchema, PairSchema, UnpairSchema, GetStateSchema } = require("../validators/device-validator");

// Routes
// vytvoření zařízení (z factory)
router.post("/create", validateToken, validate(CreateSchema), async (req, res) => {
    // todo: authozization?
    await CreateAbl(req, res);
});

// vytvoření párovacího kódu a aktualizace data párování
router.post("/pair", validateToken, validate(PairSchema), async (req, res) => {
    await PairAbl(req, res);
});

router.post("/unpair", validateToken, validate(UnpairSchema), async (req, res) => {
    await UnpairAbl(req, res);
});

// získání stavu zařízení (unpaired, pairing, paired)
router.get("/state", validateToken, validate(GetStateSchema), async (req, res) => {
    await GetStateAbl(req, res);
});

// získání zařízení podle párovacího kódu
router.get("/getByCode/:code", validateToken, async (req, res) => {
    await GetByCodeAbl(req, res);
});

module.exports = router;