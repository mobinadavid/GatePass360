const { Sequelize } = require('sequelize');
const config =require('../config/config');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        define: {
            underscored: true, // Maps camelCase to snake_case (createdAt -> created_at)
            freezeTableName: true
        }
    }
);

const db = {};

// 1. Import Model Definitions
db.Permission = require('./PermissionModel')(sequelize);
db.Role = require('./RoleModel')(sequelize);
db.User = require('./UserModel')(sequelize);

// 2. Define Associations (The "Wiring" phase)

// Role <-> Permission (Many-to-Many)
db.Role.belongsToMany(db.Permission, {
    through: 'role_permissions',
    foreignKey: 'role_id',
    otherKey: 'permission_id'
});
db.Permission.belongsToMany(db.Role, {
    through: 'role_permissions',
    foreignKey: 'permission_id',
    otherKey: 'role_id'
});

// User <-> Role (Many-to-Many)
db.User.belongsToMany(db.Role, {
    through: 'user_roles',
    foreignKey: 'user_id',
    otherKey: 'role_id'
});
db.Role.belongsToMany(db.User, {
    through: 'user_roles',
    foreignKey: 'role_id',
    otherKey: 'user_id'
});

// Export the sequelize instance and the loaded models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;