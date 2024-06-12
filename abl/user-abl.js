const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/JWT');
const UserDAO = require('../dao/user-mongo');

async function RegisterAbl(req, res) {
    try {
        const { firstName, lastName, email, phone_country_code, phone_number, password } = req.body;

        // Zkontrolovat, zda již uživatel s daným emailem neexistuje
        const user = await UserDAO.findUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Vytvořit nového uživatele
        bcrypt.hash(password, 10).then(async (hash) => {
            const newUser = {
                firstName,
                lastName,
                email,
                phone_country_code,
                phone_number,
                password: hash
            };

            const savedUser = await UserDAO.createUser(newUser);

            // Odstanit heslo z odpovedi
            savedUser.password = undefined;

            res.status(200).json(savedUser);
        }).catch((e) => {
            res.status(500).json({ message: e.message });
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function LoginAbl(req, res) {
    try {
        const { email, password } = req.body;

        // Zkontrolovat, zda uživatel existuje
        const user = await UserDAO.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Porovnat hesla
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            // Vytvorit token
            const accessToken = createToken(user);
            res.cookie('access-token', accessToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            // Odstanit heslo z odpovedi
            user.password = undefined;

            res.status(200).json(user);
        }).catch((e) => {
            res.status(500).json({ message: e.message });
        });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function LoginGatewayAbl(req, res) {
    try {
        const { email, password } = req.body;

        // Zkontrolovat, zda uživatel existuje
        const user = await UserDAO.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Porovnat hesla
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            // Vytvorit token
            const accessToken = createToken(user);

            // Odstanit heslo z odpovedi
            user.password = undefined;

            res.status(200).json({ token: accessToken });
        }).catch((e) => {
            res.status(500).json({ message: e.message });
        });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }

}

async function GetCurrentAbl(req, res) {
    try {
        const user = await UserDAO.findUserById(req.userId);

        // Odstanit heslo z odpovedi
        user.password = undefined;

        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function LogoutAbl(req, res) {
    try {
        res.clearCookie('access-token');
        res.status(200).json({ message: 'Logged out' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = { RegisterAbl, LoginAbl, LoginGatewayAbl, GetCurrentAbl, LogoutAbl };