const Device = require('../models/device');

class DeviceDAO {
    async createDevice(device) {
        try {
            const newDevice = new Device(device);
            return await newDevice.save();
        } catch (error) {
            throw error;
        }
    }

    async getDevice(id) {
        try {
            return await Device.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async getDeviceBySerialNumber(serialNumber) {
        try {
            return await Device.findOne({ serialNumber: serialNumber });
        } catch (error) {
            throw error;
        }
    }

    async getDeviceByCode(pairingCode, date) {
        try {
            // get unpaired device by pairing code and within 5 minutes of pairing date
            return await Device.findOne({
                pairingCode: pairingCode,
                pairingDate: { $gte: date - 5 * 60000 },
                medstakerId: null
            });
        } catch (error) {
            throw error;
        }
    }

    async updateDevice(id, device) {
        try {
            return await Device.findByIdAndUpdate(
                id,
                {
                    $set: {
                        medstakerId: device.medstakerId,
                        battery: device.battery,
                        pairingCode: device.pairingCode,
                        pairingDate: device.pairingDate
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DeviceDAO();