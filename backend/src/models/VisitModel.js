const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Visit', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // Matches your SERIAL type
        },
        visitor_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        host_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        purpose: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        visit_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(30),
            defaultValue: 'pending_host' // Matches your SQL default
        },
        rejection_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'visits',
        underscored: true, // This maps createdAt -> created_at automatically
        timestamps: true   // Set to true since your SQL has these columns
    });
};