const userRepository = require('../repositories/userRepository');

class AuthorizationService {
    async isAuthorized(userId, requiredPermission) {
        // 1. Get user with Roles and their associated Permissions
        // Using the existing repository method we built
        const user = await userRepository.findByIdWithDetails(userId);

        if (!user || !user.Roles) {
            return false;
        }

        // 2. Iterate over user's roles (just like your Go loop)
        for (const role of user.Roles) {
            // Check if any permission slug in this role matches the requirement
            const hasPerm = role.Permissions.some(p => p.slug === requiredPermission);
            if (hasPerm) {
                return true;
            }
        }

        return false;
    }
}

module.exports = new AuthorizationService();