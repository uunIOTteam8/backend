const express = require("express");
const router = express.Router();

// ABL
const { RegisterAbl, LoginAbl, LoginGatewayAbl, GetCurrentAbl, LogoutAbl } = require("../abl/user-abl");

// Middleware
const validate = require("../middlewares/validation-middleware");
const { validateToken } = require("../utils/JWT");

// Validators
const { registerSchema, loginSchema } = require("../validators/user-validator");

// Routes
router.post("/register", validate(registerSchema), async (req, res) => {
    await RegisterAbl(req, res);
});

router.post("/login", validate(loginSchema), async (req, res) => {
    await LoginAbl(req, res);
});

router.post("/loginGateway", async (req, res) => {
    await LoginGatewayAbl(req, res);
});

router.get("/current", validateToken, async (req, res) => {
    await GetCurrentAbl(req, res);
});

router.post("/logout", validateToken, async (req, res) => {
    await LogoutAbl(req, res);
});

/*
    Pro vytvoření endpointu pouze pro přihlášené uživatele použijte validateToken middleware z utils/JWT.js
*/

module.exports = router;