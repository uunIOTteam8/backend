require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');

const createToken = (user) => {
    const accessToken = sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access-token'];

    if (!accessToken) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const validToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (validToken) {
            req.authenticated = true;
            req.userId = validToken.id;
            req.userEmail = validToken.email;
            return next();
        }
    } catch (err) {
        return res.status(401).json({ message: err });
    }
}

module.exports = { createToken, validateToken };