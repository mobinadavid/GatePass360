const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Permission', {
        slug: { type: DataTypes.STRING, unique: true, allowNull: false },
        title_fa: { type: DataTypes.STRING }
    }, {
        tableName: 'permissions', // Must match your SQL migration exactly
        freezeTableName: true,    // Stops Sequelize from guessing plural names
        underscored: true,
        timestamps: true          // Ensure this matches your migration columns
    });
};