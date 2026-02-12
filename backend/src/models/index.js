const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
    config.get('DB_NAME'),
    config.get('DB_USER'),
    config.get('DB_PASSWORD'),
    {
        host: config.get('DB_HOST') || 'localhost',
        port: config.get('DB_PORT') || 5432,
        dialect: 'postgres',
        logging: false,
        define: {
            underscored: true, // Maps camelCase to snake_case
            freezeTableName: true
        }
    }
);

const db = {};

// 1. Import Model Definitions
db.Permission = require('./PermissionModel')(sequelize);
db.Role = require('./RoleModel')(sequelize);
db.User = require('./UserModel')(sequelize);
db.Visit = require('./VisitModel')(sequelize); // Added Visit Model [cite: 242, 243]

// 2. Define Associations (The "Wiring" phase)

// Role <-> Permission (Many-to-Many) [cite: 115, 249]
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

// User <-> Role (Many-to-Many) [cite: 115, 249]
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

// User <-> Visit (One-to-Many Relationships)
// A User can be a Guest on many visits
db.User.hasMany(db.Visit, { foreignKey: 'visitor_id', as: 'GuestVisits' });
db.Visit.belongsTo(db.User, { foreignKey: 'visitor_id', as: 'Guest' });

// A User can be a Host for many visits
db.User.hasMany(db.Visit, { foreignKey: 'host_id', as: 'HostVisits' });
db.Visit.belongsTo(db.User, { foreignKey: 'host_id', as: 'Host' });

// Export the sequelize instance and the loaded models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;