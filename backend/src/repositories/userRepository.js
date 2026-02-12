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
    async findUsersByRole(roleName) {
        return await User.findAll({
            include: [{
                model: Role,
                where: { name: roleName },
                attributes: [] // We don't need the role data in the final object, just the filter
            }],
            attributes: ['id', 'full_name', 'username']
        });
    }

    async hasRole(userId, roleName) {
        const user = await User.findByPk(userId, {
            include: [{
                model: Role,
                where: { name: roleName }
            }]
        });
        return !!user; // Returns true if user exists with that role
    }

    async findAllUsers() {
        return await User.findAll({
            attributes: ['id', 'full_name', 'username', 'phone', 'created_at'],
            include: [{
                model: Role,
                through: { attributes: [] } // جدول واسط را در خروجی نشان ندهد
            }]
        });
    }
    async updateRole(userId, roleId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        const role = await Role.findByPk(roleId);
        if (!role) throw new Error('Role not found');

        return await user.setRoles([role]);
    }
}

module.exports = new UserRepository();