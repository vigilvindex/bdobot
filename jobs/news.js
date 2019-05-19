/**
 * @file news.js
 * @description BDOBot Discord Bot News Scheduled Job.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const schedule = require('node-schedule');
const { Storage, NewsItems } = require('../dbObjects');
const Parser = require('rss-parser');
const logger = require('../utils/logger').logger;
const request = require('snekfetch');
const moment = require('moment');
module.exports = {
    name: 'news',
    execute(client) {
        const newsJob = schedule.scheduleJob('*/30 * * * *', function() {
            (async () => {
                const newsGuilds = [];
                await Storage.findAll({ where: { key: 'news', value: 'true' } }).then(store => {
                    if (store.length > 0) {
                        store.forEach(item => {
                            if (!newsGuilds.includes(item.guild)) {
                                newsGuilds.push(item.guild);
                            }
                        });
                    }
                });
                const parser = new Parser();
                const feed = await parser.parseURL('https://steamcommunity.com/games/582660/rss/');
                const sentNewsItems = [];
                await NewsItems.all().then(items => {
                    items.forEach(item => {
                        if (!sentNewsItems.includes(item.value)) {
                            sentNewsItems.push(item.value);
                        }
                    });
                });
                const news = [];
                feed.items.forEach(item => {
                    const link = `${item.title} - ${item.link}`;
                    if (!sentNewsItems.includes(link)) {
                        if (!news.includes(link)) {
                            news.push(link);
                        }
                        NewsItems.upsert({
                            value: link,
                        });
                    }
                });
                newsGuilds.forEach(guild => {
                    news.forEach(item => {
                        client.guilds.get(guild).channels.find('name', 'news').send(item);
                    });
                });
                let clientversion = '';
                let sendcv = false;
                let embedcv = '';
                await request.get('http://akamai-gamecdn.blackdesertonline.com/live001/game/config/config.patch.version').then(r => {
                    clientversion = r.body.toString('utf8');
                });
                await Storage.findOne({ where: { key: 'clientversion' } }).then(value => {
                    if (value === null) {
                        Storage.upsert({
                            key: 'clientversion',
                            value: clientversion,
                        });
                    }
                    else if (value.value !== clientversion) {
                        sendcv = true;
                        embedcv = {
                            'title': '🚥 BDOBot Version',
                            'timestamp': moment.utc().format(),
                            'footer': {
                                'text': 'Updated',
                            },
                            'fields': [
                                {
                                    'name': 'Client 🆕',
                                    'value': `v${clientversion}`,
                                },
                                {
                                    'name': 'Patch ⏫',
                                    'value': `v${value.value} -> ${clientversion}`,
                                },
                            ],
                        };
                        Storage.upsert({
                            id: value.id,
                            key: 'clientversion',
                            value: clientversion,
                        });
                    }
                });
                if (sendcv) {
                    newsGuilds.forEach(guild => {
                        client.guilds.get(guild).channels.find('name', 'news').send({ embed: embedcv });
                    });
                }
                let launcherversion = '';
                let sendlv = false;
                let embedlv = '';
                await request.get('http://akamai-gamecdn.blackdesertonline.com/live001/launcher/launcher1.version').then(r => {
                    launcherversion = r.body.toString('utf8');
                });
                await Storage.findOne({ where: { key: 'launcherversion' } }).then(value => {
                    if (value === null) {
                        Storage.upsert({
                            key: 'launcherversion',
                            value: launcherversion,
                        });
                    }
                    else if (value.value !== launcherversion) {
                        sendlv = true;
                        embedlv = {
                            'title': '🚥 BDOBot Version',
                            'timestamp': moment.utc().format(),
                            'footer': {
                                'text': 'Updated',
                            },
                            'fields': [
                                {
                                    'name': 'Launcher 🆕',
                                    'value': `v${launcherversion}`,
                                },
                                {
                                    'name': 'Patch ⏫',
                                    'value': `v${value.value} -> ${launcherversion}`,
                                },
                            ],
                        };
                        Storage.upsert({
                            id: value.id,
                            key: 'launcherversion',
                            value: launcherversion,
                        });
                    }
                });
                if (sendlv) {
                    newsGuilds.forEach(guild => {
                        client.guilds.get(guild).channels.find('name', 'news').send({ embed: embedlv });
                    });
                }
            })();
        });
        logger.info('BDOBot Client News Job Is Active!');
        return newsJob;
    },
    close(job) {
        logger.info('BDOBot Client News Job Is Deactivated!');
        job.cancel();
    },
};