const userRepository = require('../repositories/userRepository');
const hashService = require('./hashService');
const jwtService = require('./jwtService');
const { Role } = require('../models/index');

class UserService {
    async registerUser(data) {
        const existing = await userRepository.findByUsername(data.username);
        if (existing) throw new Error('Username already exists');

        // Create user (BeforeSave hook handles hashing)
        const user = await userRepository.create(data);

        // Assign 'guest' role by default for public registration [cite: 198]
        const guestRole = await Role.findOne({ where: { name: 'guest' } });
        if (guestRole) {
            await user.setRoles([guestRole]);
        }

        return user;
    }

    async getProfile(userId) {
        const user = await userRepository.findByIdWithDetails(userId);
        if (!user) throw new Error('User not found');
        return user;
    }

    async login(username, password) {
        // 1. Fetch user with Roles and Permissions [cite: 196, 222]
        const user = await userRepository.findByUsernameWithDetails(username);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // 2. Verify hashed password [cite: 148, 279]
        const isMatch = await hashService.verify(user.password, password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // 3. Prepare token payload (Roles & Permissions) [cite: 115, 249]
        const permissions = [...new Set(
            user.Roles.flatMap(role => role.Permissions.map(p => p.slug))
        )];

        const token = jwtService.generateToken({
            id: user.id,
            username: user.username,
            roles: user.Roles.map(r => r.name),
        });

        // 4. Return both user data and token to the controller
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                permissions
            }
        };
    }
}

module.exports = new UserService();