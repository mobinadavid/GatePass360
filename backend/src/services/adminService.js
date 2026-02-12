const userRepository = require('../repositories/userRepository');
const visitRepository = require('../repositories/visitRepository');
const roleRepository = require('../repositories/roleRepository');

class AdminService {
    async getUsersList() {
        return await userRepository.findAllUsers();
    }

    async changeUserRole(userId, roleId) {
        return await userRepository.updateRole(userId, roleId);
    }

    async getComprehensiveReport() {
        const stats = await visitRepository.getStats();
        const totalUsers = await userRepository.findAllUsers();

        return {
            visit_stats: stats,
            user_summary: {
                total_count: totalUsers.length
            }
        };
    }

    async getRolesList() {
        return await roleRepository.findAll();
    }
}

module.exports = new AdminService();