/**
 * @file news.js
 * @description BDOBot Discord Bot News Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = {
    name: 'news',
    description: 'Displays BDO announcements in the #news channel.',
    args: true,
    usage: 'help',
    aliases: ['n'],
    execute(message, args) {
        const { Storage } = require('../dbObjects');
        const officerroles = ['officer', 'mod', 'admin', 'guildmaster'];
        const roles = message.guild.members.get(message.author.id).roles;
        let officerpermission = false;
        roles.forEach(role => {
            if (officerroles.includes(role.name)) {
                officerpermission = true;
            }
        });
        if (message.channel.name !== 'news') {
            return message.reply('This command can only be used in the #news channel!');
        }
        if (officerpermission === false) {
            return message.reply('This command can only be used by admins or mods!');
        }
        if (!args.length) {
            return message.reply('This command requires arguments!');
        }
        else if (args[0].toLowerCase() === 'help' || args[0].toLowerCase() === 'h') {
            return message.reply(`This command can be used in the following ways:\n
			\t\t• \`!news help\` - Shows this help message.\n
			\t\t• \`!news on\` - Turns news notifications on.\n
			\t\t• \`!news off\` - Turns news notifications off.\n\u200b`);
        }
        else if (args[0].toLowerCase() === 'on') {
            Storage.findOne({ where: { key: 'news', guild: message.guild.id } }).then(store => {
                if (store === null || store.length === 0 || store === undefined) {
                    Storage.upsert({
                        key: 'news',
                        value: 'true',
                        guild: message.guild.id,
                    });
                }
                else {
                    Storage.upsert({
                        id: store.id,
                        key: 'news',
                        value: 'true',
                        guild: message.guild.id,
                    });
                }
            });
            return message.reply('News notifications have been turned on!');
        }
        else if (args[0].toLowerCase() === 'off') {
            Storage.findOne({ where: { key: 'news', guild: message.guild.id } }).then(store => {
                if (store === null || store.length === 0 || store === undefined) {
                    Storage.upsert({
                        key: 'news',
                        value: 'false',
                        guild: message.guild.id,
                    });
                }
                else {
                    Storage.upsert({
                        id: store.id,
                        key: 'news',
                        value: 'false',
                        guild: message.guild.id,
                    });
                }
            });
            return message.reply('News notifications have been turned off!');
        }
    },
};
