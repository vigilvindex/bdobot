/**
 * @file EventList.js
 * @description BDOBot Discord Bot Event List Model.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "eventlist",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
      },
      starts: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "YYYY-MM-DD-HH-MM"
      },
      ends: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "YYYY-MM-DD-HH-MM"
      },
      attendees: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
      },
      apologies: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      tableName: "eventlist",
      timestamps: true,
      createdAt: "created",
      updatedAt: "updated",
      underscored: true
    }
  );
};
