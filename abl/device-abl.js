const DeviceDAO = require('../dao/device-mongo');
const MedsTakerDAO = require('../dao/medsTaker-mongo');

function createRandomString(length) {
    //const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function CreateAbl(req, res) {
    try {
        // zkontrolovat, jestli uz takovy device neexistuje
        const device = await DeviceDAO.getDeviceBySerialNumber(req.body.serialNumber);
        if (device) {
            return res.status(400).json({ message: "Device already exists." });
        }

        const newDevice = await DeviceDAO.createDevice(req.body);
        res.status(200).json(newDevice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function PairAbl(req, res) {
    try {
        // Check if device exists
        const device = await DeviceDAO.getDeviceBySerialNumber(req.body.serialNumber);
        if (!device) {
            return res.status(400).json({ message: "Device not found." });
        }

        // Check if device is not paired
        const medsTaker = await MedsTakerDAO.GetMedsTakerByDevice(device._id);
        if (medsTaker) {
            return res.status(400).json({ message: "Device already paired." });
        }

        device.pairingCode = createRandomString(5);
        device.pairingDate = new Date();
        await DeviceDAO.updateDevice(device._id, device);
        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function UnpairAbl(req, res) {
    try {
        // Check if device exists
        const device = await DeviceDAO.getDeviceBySerialNumber(req.body.serialNumber);
        if (!device) {
            return res.status(400).json({ message: "Device not found." });
        }


        // Check if device is not paired
        const medsTaker = await MedsTakerDAO.GetMedsTakerByDevice(device._id);
        if (medsTaker) {
            medsTaker.device = null;
            await MedsTakerDAO.UpdateMedsTaker(medsTaker._id, medsTaker);

            return res.status(200).json(device);
        } else {
            return res.status(400).json({ message: "Device not paired." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function GetStateAbl(req, res) {
    try {
        const device = await DeviceDAO.getDeviceBySerialNumber(req.body.serialNumber);
        if (!device) {
            return res.status(400).json({ message: "Device not found." });
        }

        let state = "unpaired";

        const medsTaker = await MedsTakerDAO.GetMedsTakerByDevice(device._id);

        if (medsTaker) {
            state = "paired";
        } else if (device.pairingCode && device.pairingDate && new Date() - device.pairingDate < 5 * 60000) {
            state = "pairing";
        }

        res.status(200).json({ state: state });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function GetByCodeAbl(req, res) {
    const { code } = req.params;
    try {
        const device = await DeviceDAO.getDeviceByCode(code, new Date());
        if (!device) {
            return res.status(400).json({ message: "Device not found." });
        }

        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function SetBatteryAbl(req, res) {
    try {
        const device = await DeviceDAO.getDeviceBySerialNumber(req.body.serialNumber);
        if (!device) {
            return res.status(400).json({ message: "Device not found." });
        }

        device.battery = req.body.battery;
        await DeviceDAO.updateDevice(device._id, device);
        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    CreateAbl,
    PairAbl,
    UnpairAbl,
    GetStateAbl,
    GetByCodeAbl,
    SetBatteryAbl
};