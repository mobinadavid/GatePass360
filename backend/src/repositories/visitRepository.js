const { Visit, User } = require('../models/index');

class VisitRepository {
    async create(data) {
        return await Visit.create(data);
    }

    async findById(id) {
        const numericId = Number(id); // Use Number() for cleaner parsing

        if (isNaN(numericId)) {
            throw new Error("Invalid ID format: The visit ID must be a number.");
        }

        return await Visit.findByPk(numericId);
    }

    async getByGuestId(guestId) {
        return await Visit.findAll({
            where: { visitor_id: guestId },
            include: [{
                model: User,
                as: 'Host', // This alias MUST match index.js
                attributes: ['full_name']
            }],
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
}

module.exports = new VisitRepository();