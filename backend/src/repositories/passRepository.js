const db = require('../models/index'); // Import the central db object
const { Op } = require('sequelize');

class PassRepository {
    async create(data) {
        return await db.Pass.create(data);
    }

    async findByCode(code) {
        return await db.Pass.findOne({
            where: { pass_code: code },
            include: [{
                model: db.Visit,
                include: [
                    { model: db.User, as: 'Guest' },
                    { model: db.User, as: 'Host' }
                ]
            }]
        });
    }

    async updateTimes(id, times) {
        return await db.Pass.update(times, { where: { id: id } });
    }

    async getPresent() {
        return await db.Pass.findAll({
            where: {
                check_in_time: { [Op.ne]: null },
                check_out_time: null // People currently in the building
            },
            include: [{
                model: db.Visit,
                include: [
                    { model: db.User, as: 'Guest', attributes: ['full_name', 'phone'] },
                    { model: db.User, as: 'Host', attributes: ['full_name'] }
                ]
            }]
        });
    }

    async getAll(filters) {
        return await db.Pass.findAll({
            where: filters,
            include: [{
                model: db.Visit,
                include: [
                    { model: db.User, as: 'Guest', attributes: ['full_name', 'phone'] },
                    { model: db.User, as: 'Host', attributes: ['full_name'] }
                ]
            }],
            order: [['created_at', 'DESC']]
        });
    }
}

module.exports = new PassRepository();