const bcrypt = require('bcrypt');
const { User, Role } = require('../../models/index');

const usersData = [
    {
        username: 'admin_user',
        password: 'AdminPassword123',
        full_name: 'مدیر سامانه',
        role: 'admin'
    },
    {
        username: 'security_officer',
        password: 'SecurityPassword123',
        full_name: 'افسر حراست',
        role: 'security'
    },
    {
        username: 'main_host',
        password: 'HostPassword123',
        full_name: 'میزبان نمونه',
        role: 'host'
    }
];

const seedUsers = async () => {
    for (const u of usersData) {
        // 1. Hash the password for security
        // 2. Create the user
        const [user] = await User.findOrCreate({
            where: { username: u.username },
            defaults: {
                password: u.password,
                full_name: u.full_name,
                phone: '09120000000'
            }
        });

        // 3. Find the corresponding role
        const role = await Role.findOne({ where: { name: u.role } });

        if (role) {
            // 4. Link the user to the role in user_roles table
            await user.setRoles([role]);
        }
    }
    console.log("✅ User Seeder executed successfully.");
};

module.exports = seedUsers;