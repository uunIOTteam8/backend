const express = require("express");
const router = express.Router();

// ABL
const { RegisterAbl, LoginAbl } = require("../abl/user-abl");

// Middleware
const validate = require("../middlewares/validation-middleware");

// Validators
const { registerSchema, loginSchema } = require("../validators/user-validator");

// Routes
router.post("/register", validate(registerSchema), async (req, res) => {
    await RegisterAbl(req, res);
});

router.post("/login", validate(loginSchema), async (req, res) => {
    await LoginAbl(req, res);
});

/*
    Pro vytvoření endpointu pouze pro přihlášené uživatele použijte validateToken middleware z utils/JWT.js
*/

module.exports = router;