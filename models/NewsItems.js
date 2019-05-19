/**
 * @file NewsItems.js
 * @description BDOBot Discord Bot News Items Model.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('newsitems', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0',
        },
    }, {
        tableName: 'newsitems',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        underscored: true,
    });
};
