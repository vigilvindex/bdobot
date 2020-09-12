/**
 * @file Storage.js
 * @description BDOBot Discord Bot Storage Model.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "storage",
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
        defaultValue: "0"
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "0"
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "0"
      }
    },
    {
      tableName: "storage",
      timestamps: true,
      createdAt: "created",
      updatedAt: "updated",
      underscored: true
    }
  );
};
