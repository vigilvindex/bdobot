/**
 * @file dbInit.js
 * @description BDOBot Discord Bot Database Initialisation.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'bdobot.sqlite',
    operatorsAliases: false,
});

sequelize.import('models/GearList');
sequelize.import('models/GuildList');
sequelize.import('models/Storage');
sequelize.import('models/NewsItems');
sequelize.import('models/EventList');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    console.log('Database synced!');
    sequelize.close();
}).catch(console.error);
