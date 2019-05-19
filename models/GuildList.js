/**
 * @file GuildList.js
 * @description BDOBot Discord Bot Guild List Model.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('guildlist', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        discord: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0',
        },
        guild: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0',
            unique: true,
        },
        joined: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0000-00-00',
        },
        renewed: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0000-00-00',
        },
        term: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            validate: {
                isInt: true,
                isIn: [[1, 7, 14, 30, 180, 365]],
            },
        },
        pay: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30000,
        },
        rank: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'member',
        },
        activity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        startactivity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        contribution: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        by: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0',
        },
        recruiter: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0',
        },
        allowance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        expired: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'false',
        },
        expiry: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0000-00-00',
        },
    }, {
        tableName: 'guildlist',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated',
        underscored: true,
    });
};
