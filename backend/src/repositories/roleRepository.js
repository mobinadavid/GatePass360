const { Role } = require('../models/index');

class RoleRepository {
    async findAll() {
        return await Role.findAll({
            attributes: ['id', 'name']
        });
    }
}

module.exports = new RoleRepository();