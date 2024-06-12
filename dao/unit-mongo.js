const Unit = require('../models/Unit');

class UnitDAO {
    async GetUnit(id) {
        try {
            return await Unit.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async CreateUnit(unit) {
        try {
            const newUnit = new Unit(unit);
            return await newUnit.save();
        } catch (error) {
            throw error;
        }
    }

    async ListOfUnit() {
        try {
            return await Unit.find();
        } catch (error) {
            throw error;
        }
    }

    async DeleteUnit(id) {
        try {
            return await Unit.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }


}

module.exports = new UnitDAO();