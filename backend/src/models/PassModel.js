const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pass', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        visit_id: { type: DataTypes.INTEGER, allowNull: false },
        pass_code: { type: DataTypes.STRING(100), unique: true, allowNull: false },
        valid_from: { type: DataTypes.DATE, allowNull: false },
        valid_to: { type: DataTypes.DATE, allowNull: false },
        check_in_time: { type: DataTypes.DATE, allowNull: true },
        check_out_time: { type: DataTypes.DATE, allowNull: true }
    }, {
        tableName: 'passes',
        underscored: true,
        timestamps: true
    });
};