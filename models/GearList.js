/**
 * @file GearList.js
 * @description BDOBot Discord Bot Gear List Model.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "gearlist",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
      },
      guild: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
      },
      ap: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
          min: 0,
          max: 999
        }
      },
      aap: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
          min: 0,
          max: 999
        }
      },
      dp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
          min: 0,
          max: 999
        }
      },
      accuracy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
          min: 0,
          max: 999
        }
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
          min: 0,
          max: 999
        }
      },
      level: {
        type: DataTypes.REAL,
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          isFloat: true,
          min: 0,
          max: 99
        }
      },
      class: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "berserker",
        validate: {
          isIn: [
            [
              "berserker",
              "darkknight",
              "kunoichi",
              "lahn",
              "maehwa",
              "musa",
              "mystic",
              "ninja",
              "ranger",
              "sorceress",
              "striker",
              "tamer",
              "valkyrie",
              "warrior",
              "witch",
              "wizard"
            ]
          ]
        }
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "https://bdoplanner.com/",
        validate: {
          isUrl: true
        }
      }
    },
    {
      tableName: "gearlist",
      timestamps: true,
      createdAt: "created",
      updatedAt: "updated",
      underscored: true
    }
  );
};
