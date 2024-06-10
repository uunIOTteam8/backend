const MedsTakerDAO = require('../dao/medsTaker-mongo');
const DeviceDAO = require('../dao/device-mongo');

async function GetAbl(req, res) {
    try {
        const medsTaker = await MedsTakerDAO.GetMedsTaker(req.params.id);
        if (!medsTaker) {
            return res.status(400).send({ error: `Meds Taker with id '${req.params.id}' doesn't exist.` });
        }
        if (medsTaker.supervisor != req.userId) {
            return res.status(400).send({ error: `User is not authorized to get Meds Taker with id '${req.params.id}'.` });
        }
        res.json(medsTaker);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function CreateAbl(req, res) {
    try {
        const { name, phone_country_code, phone_number, device} = req.body;

        // Check if device exists
        const deviceObj = await DeviceDAO.getDevice(device);
        if (!deviceObj) {
            return res.status(400).send({ error: `Device doesn't exist.` });
        }

        // Check if device is already paired
        const medsTakerByDevice = await MedsTakerDAO.GetMedsTakerByDevice(device);
        if (medsTakerByDevice) {
            return res.status(400).send({ error: `Device already paired.` });
        }

        const newMedsTaker = {
            supervisor: req.userId,
            name,
            phone_country_code,
            phone_number,
            device
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

        if (req.body.device) {
            // Check if device exists
            const deviceObj = await DeviceDAO.getDevice(req.body.device);
            if (!deviceObj) {
                return res.status(400).send({ error: `Device doesn't exist.` });
            }

            // Check if device is already paired
            const medsTakerByDevice = await MedsTakerDAO.GetMedsTakerByDevice(req.body.device);
            if (medsTakerByDevice && medsTakerByDevice._id != req.body.id) {
                return res.status(400).send({ error: `Device already paired.` });
            }
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