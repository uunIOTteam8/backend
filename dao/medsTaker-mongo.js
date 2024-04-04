const MedsTaker = require('../models/MedsTaker');

class MedsTakerDAO {
    async GetMedsTaker(id) {
        try {
            return await MedsTaker.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async CreateMedsTaker(medsTaker) {
        try {
            const newMedsTaker = new MedsTaker(medsTaker);
            return await newMedsTaker.save();
        } catch (error) {
            throw error;
        }
    }

    async UpdateMedsTaker(id, medsTaker) {
        try {
            return await MedsTaker.findByIdAndUpdate(
                id,
                {
                    $set: {
                        supervisor: medsTaker.supervisor,
						name: medsTaker.name,
						phone_country_code: medsTaker.phone_country_code,
						phone_number: medsTaker.phone_number,
					},  
                },
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw error;
        }
    }

    async DeleteMedsTaker(id) {
        try {
            return await MedsTaker.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async ListOfMedsTaker(id) {
        try {
            return await MedsTaker.find({ supervisor: id });
        } catch (error) {
            throw error;
        }
    }


}

module.exports = new MedsTakerDAO();