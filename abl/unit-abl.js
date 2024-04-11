const UnitDAO = require("../dao/unit-mongo");

async function GetUnitAbl(req, res) {
    try {
        const unit = await UnitDAO.GetUnit(req.body.id);
        if (!unit) {
            return res.status(404).send({ error: "Unit not found" });
        }
        res.status(200).json(unit);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function CreateUnitAbl(req, res) {
    try {
        const {name} = req.body;
        const newUnit = {
            name
        };
        savedUnit = await UnitDAO.CreateUnit(newUnit);
        res.status(200).json(savedUnit);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function DeleteUnitAbl(req, res) {
    try {
        const unit = await UnitDAO.GetUnit(req.body.id);
        if (!unit) {
            res.status(400).send({ error: "Unit not found" });
        }
        await UnitDAO.DeleteUnit(req.body.id);
        res.status(200).json({});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function ListOfUnitAbl(req, res) {
    try {
        const unitList = await UnitDAO.ListOfUnit(req.userId);
        res.status(200).json(unitList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = { GetUnitAbl, CreateUnitAbl,  DeleteUnitAbl, ListOfUnitAbl };