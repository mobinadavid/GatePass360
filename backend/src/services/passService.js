const crypto = require('crypto');
const passRepository = require('../repositories/passRepository');
const visitRepository = require('../repositories/visitRepository');
const config = require('../config/config');

class PassService {
    async issuePermit(visitId, userId) {
        const visit = await visitRepository.findById(visitId);
        if (!visit || visit.status !== 'approved_by_host') {
            throw new Error('Visit not ready for permit issuance');
        }

        const passCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        const hours = parseInt(process.env.PASS_VALIDITY_HOURS) || 12;

        const validFrom = new Date();
        const validTo = new Date();
        validTo.setHours(validTo.getHours() + hours);

        await passRepository.create({
            visit_id: visitId,
            pass_code: passCode,
            valid_from: validFrom,
            valid_to: validTo
        });

        return await visitRepository.updateStatus(visitId, 'approved_by_security', userId);
    }

    async checkIn(code) {
        const pass = await passRepository.findByCode(code);
        if (!pass) throw new Error('Invalid pass code');
        if (pass.check_in_time) throw new Error('Already checked in');

        const now = new Date();
        if (now < pass.valid_from || now > pass.valid_to) throw new Error('Pass expired or not yet valid');

        return await passRepository.updateTimes(pass.id, { check_in_time: now });
    }

    async checkOut(code) {
        const pass = await passRepository.findByCode(code);
        if (!pass || !pass.check_in_time) throw new Error('No active check-in found for this code');

        return await passRepository.updateTimes(pass.id, { check_out_time: new Date() });
    }
}

module.exports = new PassService();