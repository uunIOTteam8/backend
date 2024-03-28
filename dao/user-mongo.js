const User = require('../models/User');

class UserDAO {
    async createUser(user) {
        try {
            const newUser = new User(user);
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    }

    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserDAO();