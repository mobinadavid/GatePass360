const { User, Role, Permission } = require('../models/index');

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findByUsername(username) {
        return await User.findOne({ where: { username } });
    }
    async findByIdWithDetails(id) {
        return await User.findByPk(id, {
            include: [{
                model: Role,
                include: [Permission]
            }]
        });
    }
    async findByUsernameWithDetails(username) {
        return await User.findOne({
            where: { username },
            include: [{
                model: Role,
                include: [Permission]
            }]
        });
    }
}

module.exports = new UserRepository();