const { Visit, User ,Pass} = require('../models/index');
const { Sequelize } = require('sequelize');

class VisitRepository {
    async create(data) {
        return await Visit.create(data);
    }

    async findById(id) {
        const numericId = Number(id);
        if (isNaN(numericId)) throw new Error("Invalid ID format");

        return await Visit.findByPk(numericId, {
            include: [
                { model: User, as: 'Guest', attributes: ['full_name', 'phone'] },
                { model: User, as: 'Host', attributes: ['full_name'] },
                { model: Pass }
            ]
        });
    }

    async getByGuestId(guestId) {
        return await Visit.findAll({
            where: { visitor_id: guestId },
            include: [{
                model: User,
                as: 'Host', // This alias MUST match index.js
                attributes: ['full_name']
            },{
                model: Pass,
                attributes: ['pass_code', 'valid_from', 'valid_to']
             }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    async getByHostId(hostId) {
        return await Visit.findAll({
            where: { host_id: hostId },
            include: [{
                model: User,
                as: 'Guest', // Using the alias defined in index.js
                attributes: ['full_name', 'phone']
            }],
            order: [['created_at', 'DESC']]
        });
    }

    async updateStatus(visitId, status,userId, reason = null) {
        return await Visit.update(
            {
                status: status,
                rejection_reason: reason,
                last_changed_by: userId
            },
            { where: { id: visitId } }
        );
    }

    async getAllWithFilters(filters) {
        return await Visit.findAll({
            where: filters, // This is where the magic happens for filters
            include: [
                { model: User, as: 'Guest', attributes: ['full_name', 'phone'] },
                { model: User, as: 'Host', attributes: ['full_name'] }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    async getStats() {
        return await Visit.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('Visit.id')), 'visit_count'],
                [Sequelize.fn('DATE', Sequelize.col('Visit.created_at')), 'date']
            ],
            group: [Sequelize.fn('DATE', Sequelize.col('Visit.created_at'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('Visit.created_at')), 'DESC']],
            limit: 7,
            raw: true
        });
    }
}

module.exports = new VisitRepository();