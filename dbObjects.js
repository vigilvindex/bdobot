/**
 * @file dbObjects.js
 * @description BDOBot Discord Bot Database Objects.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "bdobot.sqlite"
  //operatorsAliases: false
});

const GearList = sequelize.import("models/GearList");
const GuildList = sequelize.import("models/GuildList");
const Storage = sequelize.import("models/Storage");
const NewsItems = sequelize.import("models/NewsItems");
const EventList = sequelize.import("models/EventList");

module.exports = { GearList, GuildList, Storage, NewsItems, EventList };
