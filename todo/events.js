/**
 * @file events.js
 * @description BDOBot Discord Bot Events Scheduled Job.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const schedule = require('node-schedule');
const { EventList } = require('../dbObjects');
const logger = require('../utils/logger').logger;
const moment = require('moment');
module.exports = {
    name: 'events',
    execute(client) {
        const eventsJob = schedule.scheduleJob('*/30 * * * *', function() {
            (async () => {
                await EventList.all().then(events => {
                    events.forEach(event => {
                        const now = moment.utc();
                        const start = moment.utc(event.starts, 'YYYY-MM-DD-HH-mm', true);
                        const end = moment.utc(event.ends, 'YYYY-MM-DD-HH-mm', true);
                        if (now.isAfter(end, 'minute')) {
                            client.guilds.get(event.guild).channels.find('name', 'events').send(`The ${event.name.replace(/-/g, ' ')} event has ended!`);
                            EventList.destroy({ where: { id: event.id } });
                        }
                        else if (now.isAfter(start, 'minute') || start.diff(now, 'minutes', true) < 1) {
                            if (now.diff(start, 'minutes', true) < 15) {
                                client.guilds.get(event.guild).channels.find('name', 'events').send(`The ${event.name.replace(/-/g, ' ')} event has started!`);
                            }
                        }
                        else if (start.diff(now, 'minutes', true) < 15) {
                            client.guilds.get(event.guild).channels.find('name', 'events').send(`The ${event.name.replace(/-/g, ' ')} event starts in ${start.diff(now, 'minutes')} minutes!`);
                        }
                        else if (start.diff(now, 'minutes', true) < 30) {
                            client.guilds.get(event.guild).channels.find('name', 'events').send(`The ${event.name.replace(/-/g, ' ')} event starts in ${start.diff(now, 'minutes')} minutes!`);
                        }
                        else if (start.diff(now, 'hours', true) < 1) {
                            client.guilds.get(event.guild).channels.find('name', 'events').send(`The ${event.name.replace(/-/g, ' ')} event starts in ${start.diff(now, 'minutes')} minutes!`);
                        }
                    });
                });
            })();
        });
        logger.info('BDOBot Client Events Job Is Active!');
        return eventsJob;
    },
    close(job) {
        logger.info('BDOBot Client Events Job Is Deactivated!');
        job.cancel();
    },
};
