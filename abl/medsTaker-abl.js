const MedsTakerDAO = require('../dao/medsTaker-mongo');

async function GetAbl(req, res) {
    try {
        const medsTaker = await MedsTakerDAO.GetMedsTaker(req.body.id);
        if (!medsTaker) {
            return res.status(400).send({ error: `Meds Taker with id '${req.body.id}' doesn't exist.` });
        }
        if (medsTaker.supervisor != req.userId) {
            return res.status(400).send({ error: `User is not authorized to get Meds Taker with id '${req.body.id}'.` });
        }
        res.json(medsTaker);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function CreateAbl(req, res) {
    try {
        const { name, phone_country_code,phone_number} = req.body;
        const newMedsTaker = {
            supervisor: req.userId,
            name,
            phone_country_code,
            phone_number
        };
        savedMedsTaker = await MedsTakerDAO.CreateMedsTaker(newMedsTaker);
        res.json(savedMedsTaker);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function UpdateAbl(req, res) {
    try {
        const medsTaker = await MedsTakerDAO.GetMedsTaker(req.body.id);
        if (!medsTaker) {
            res.status(400).send({ error: `Meds Taker with id '${req.body.id}' doesn't exist.` });
        }
        if (medsTaker.supervisor != req.userId) {
            return res.status(400).send({ error: `User is not authorized to update Meds Taker with id '${req.body.id}'.` });
        }
        savedMedsTaker = await MedsTakerDAO.UpdateMedsTaker(req.body.id,req.body);
        res.json(savedMedsTaker);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function DeleteAbl(req, res) {
    try {
        const medsTaker = await MedsTakerDAO.GetMedsTaker(req.body.id);
        if (!medsTaker) {
            res.status(400).send({ error: `Meds Taker with id '${req.body.id}' doesn't exist.` });
        }
        if (medsTaker.supervisor != req.userId) {
            return res.status(400).send({ error: `User is not authorized to delete Meds Taker with id '${req.body.id}'.` });
        }
        await MedsTakerDAO.DeleteMedsTaker(req.body.id);
        res.json({});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function ListAbl(req, res) {
    try {
        const medsTakerList = await MedsTakerDAO.ListOfMedsTaker(req.userId);
        res.json(medsTakerList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = { GetAbl, CreateAbl, UpdateAbl, DeleteAbl, ListAbl };