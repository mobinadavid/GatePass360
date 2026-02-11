const { DataTypes } = require('sequelize');
const hashService = require('../services/hashService');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        full_name: DataTypes.STRING,
        phone: DataTypes.STRING,
    }, {
        tableName: 'users',
        underscored: true,
        hooks: {
            // This runs before Create and Update
            beforeSave: async (user, options) => {
                // If the password field was changed (or is new)
                if (user.changed('password')) {
                    const hashedPassword = await hashService.generate(user.password);
                    user.password = hashedPassword;

                    // Set password expiry (e.g., 90 days from now)
                    const expiry = new Date();
                    expiry.setDate(expiry.getDate() + 90);
                }
            }
        }
    });

    return User;
};