/**
 * @file guildlist.js
 * @description BDOBot Discord Bot Guildlist Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = {
    name: 'guildlist',
    description: 'Lets members display a sorted list of guild members.',
    args: false,
    usage: 'joined, renewed, contribution, expired, expiry, rank, name, term, pay, activity, startactivity, recruiter',
    aliases: ['gml'],
    execute(message, args) {
        const { Op } = require('sequelize');
        const moment = require('moment');
        const { GuildList } = require('../dbObjects');
        const officerroles = ['officer', 'mod', 'admin', 'guildmaster'];
        const guildmemberroles = ['officer', 'mod', 'admin', 'guildmaster', 'guildmember'];
        async function generateGuildStats() {
            try {
                let count = '';
                await GuildList.count({ where: { guild: message.guild.id } }).then(function(value) {count = value;});
                let pay = '';
                await GuildList.sum('pay', { where: { guild: message.guild.id } }).then(function(value) {pay = value;});
                let allowances = '';
                await GuildList.sum('allowance', { where: { guild: message.guild.id } }).then(function(value) {allowances = value;});
                let expired = 0;
                await GuildList.findAndCountAll({ where: { guild: message.guild.id, expired: { [Op.in]: ['true'] } } }).then(function(value) {expired = value.count;});
                const weeklypay = pay * 7;
                const url = message.guild.iconURL;
                const embed = {
                    'title': `${message.guild.name} Guild Member Stats`,
                    'thumbnail': {
                        'url': url.slice(0, (url.length - 3)) + 'png',
                    },
                    'fields': [
                        {
                            'name': 'Guild Members',
                            'value': count.toString(),
                            'inline': true,
                        },
                        {
                            'name': 'Expired Contracts',
                            'value': expired.toString(),
                            'inline': true,
                        },
                        {
                            'name': 'Total Daily Pay',
                            'value': parseInt(pay).toLocaleString(),
                            'inline': true,
                        },
                        {
                            'name': 'Total Weekly Pay',
                            'value': parseInt(weeklypay).toLocaleString(),
                            'inline': true,
                        },
                        {
                            'name': 'Total Allowances',
                            'value': parseInt(allowances).toString(),
                            'inline': true,
                        },
                    ],
                };
                return embed;
            }
            catch(error) {
                console.error(error);
            }
        }
        function padString(pad, str, padLeft) {
            if (typeof str === 'undefined') {
                return pad;
            }
            if (padLeft) {
                return (pad + str).slice(-pad.length);
            }
            else {
                return (str + pad).substring(0, pad.length);
            }
        }
        function createGuildListEmbed(guild) {
            let length = guild.length;
            const embeds = [];
            let count = 0;
            let embed = '```md\nName                            [Joined    ](Renewed   )[Term]< Pay       >[Rank]<Contribution>< Expiry     >[Expired]\n';
            guild.forEach(element => {
                if (count < 14) {
                    let rank = '';
                    switch (element.rank) {
                    case 'member':
                        rank = 'M';
                        break;
                    case 'quartermaster':
                        rank = 'QM';
                        break;
                    case 'officer':
                        rank = 'O';
                        break;
                    case 'guildmaster':
                        rank = 'GM';
                        break;
                    }
                    embed += `${padString('                                ', element.name, false)}`;
                    embed += `[${padString('          ', element.joined, false)}]`;
                    embed += `(${padString('          ', element.renewed, false)})`;
                    embed += `[${padString('    ', element.term, false)}]`;
                    embed += `< ${padString('         ', element.pay.toLocaleString(), false)} >`;
                    embed += `[${padString('    ', rank, false)}]`;
                    embed += `<${padString('            ', element.contribution.toLocaleString(), false)}>`;
                    embed += `< ${padString('          ', element.expiry, false)} >`;
                    embed += `[ ${padString('      ', element.expired.charAt(0).toUpperCase() + element.expired.substr(1), false)}]`;
                    embed += '\n';
                    count += 1;
                    if (length === 1) {
                        embed += '\n';
                        embed += '```';
                        embeds.push(embed);
                    }
                }
                else {
                    let rank = '';
                    switch (element.rank) {
                    case 'member':
                        rank = 'M';
                        break;
                    case 'quartermaster':
                        rank = 'QM';
                        break;
                    case 'officer':
                        rank = 'O';
                        break;
                    case 'guildmaster':
                        rank = 'GM';
                        break;
                    }
                    embed += `${padString('                                ', element.name, false)}`;
                    embed += `[${padString('          ', element.joined, false)}]`;
                    embed += `(${padString('          ', element.renewed, false)})`;
                    embed += `[${padString('    ', element.term, false)}]`;
                    embed += `< ${padString('         ', element.pay.toLocaleString(), false)} >`;
                    embed += `[${padString('    ', rank, false)}]`;
                    embed += `<${padString('            ', element.contribution.toLocaleString(), false)}>`;
                    embed += `< ${padString('          ', element.expiry, false)} >`;
                    embed += `[ ${padString('      ', element.expired.charAt(0).toUpperCase() + element.expired.substr(1), false)}]`;
                    embed += '\n';
                    embed += '```';
                    embeds.push(embed);
                    embed = '```md\nName                            [Joined    ](Renewed   )[Term]< Pay       >[Rank]<Contribution>< Expiry     >[Expired]\n';
                    count = 0;
                }
                length -= 1;
            });
            return embeds;
        }
        function pruneGuildList() {
            const guildmembers = [];
            message.guild.members.forEach(member => {
                member.roles.forEach(role => {
                    if (guildmemberroles.includes(role.name)) {
                        if (!guildmembers.includes(member.id)) {
                            guildmembers.push(member.id);
                        }
                    }
                });
            });
            GuildList.destroy({ where: { discord: { [Op.notIn]: guildmembers }, guild: message.guild.id } });
        }
        async function updateExpired() {
            try {
                await GuildList.findAll({ where: { guild: message.guild.id, expired: { [Op.in]: ['false'] } } }).then(list => {
                    if (list.length > 0) {
                        list.forEach(entry => {
                            if (moment().isAfter(moment(entry.renewed).add(entry.term, 'days'))) {
                                GuildList.upsert({
                                    id: entry.id,
                                    expired: 'true',
                                });
                            }
                        });
                    }
                });
            }
            catch(error) {
                console.error(error);
            }
        }
        pruneGuildList();
        updateExpired();
        const roles = message.guild.members.get(message.author.id).roles;
        let permission = false;
        roles.forEach(role => {
            if (officerroles.includes(role.name)) {
                permission = true;
            }
        });
        if (permission !== true) {
            return message.reply('You do not have permission to use this command!');
        }
        if (message.channel.name !== 'guild') {
            return message.reply('This command can only be used in the #guild channel!');
        }
        if (!args.length) {
            GuildList.findAll({ where: { guild: message.guild.id }, order: [['joined', 'ASC']] }).then(guild => {
                if (guild === null || guild.length === 0 || guild === undefined) {
                    return message.reply('No one has been registered in the guild!');
                }
                else {
                    generateGuildStats()
                        .then(embed => {
                            message.channel.send({ embed });
                            const data = createGuildListEmbed(guild);
                            data.forEach(entry => {
                                message.channel.send(entry, { split: true });
                            });
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        }
        else if (['contribution', 'pay'].includes(args[0].toLowerCase())) {
            GuildList.findAll({ where: { guild: message.guild.id }, order: [[args[0].toLowerCase(), 'DESC']] }).then(guild => {
                if (guild === null) {
                    return message.reply('No one has been registered in the guild!');
                }
                else {
                    generateGuildStats()
                        .then(embed => {
                            message.channel.send({ embed });
                            const data = createGuildListEmbed(guild);
                            data.forEach(entry => {
                                message.channel.send(entry, { split: true });
                            });
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        }
        else if (['joined', 'renewed', 'expired', 'expiry', 'rank', 'name', 'term'].includes(args[0].toLowerCase())) {
            GuildList.findAll({ where: { guild: message.guild.id }, order: [[args[0].toLowerCase(), 'ASC']] }).then(guild => {
                if (guild === null) {
                    return message.reply('No one has been registered in the guild!');
                }
                else {
                    generateGuildStats()
                        .then(embed => {
                            message.channel.send({ embed });
                            const data = createGuildListEmbed(guild);
                            data.forEach(entry => {
                                message.channel.send(entry, { split: true });
                            });
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        }
        else {
            return message.reply(`You can only sort the guild list by these attributes:\n
                        joined, renewed, contribution, expired, expiry, rank, name, term, pay\n
						• \`!guildlist score\`\n\u200b`);
        }
    },
};
