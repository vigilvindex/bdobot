/**
 * @file gearlist.js
 * @description BDOBot Discord Bot Gearlist Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = {
    name: 'gearlist',
    description: 'Lets members display a sorted list of guild members gear.',
    args: false,
    usage: 'ap, aap, dp, accuracy, score, level, or class.',
    aliases: ['gl'],
    execute(message, args) {
        const { Op } = require('sequelize');
        const { GearList } = require('../dbObjects');
        const guildmemberroles = ['officer', 'mod', 'admin', 'guildmaster', 'guildmember'];
        async function generateGearStats() {
            try {
                let count = '';
                await GearList.count({ where: { guild: message.guild.id } }).then(function(value) {count = value;});
                let ap = '';
                await GearList.sum('ap', { where: { guild: message.guild.id } }).then(function(value) {ap = value;});
                let aap = '';
                await GearList.sum('aap', { where: { guild: message.guild.id } }).then(function(value) {aap = value;});
                let dp = '';
                await GearList.sum('dp', { where: { guild: message.guild.id } }).then(function(value) {dp = value;});
                let accuracy = '';
                await GearList.sum('accuracy', { where: { guild: message.guild.id } }).then(function(value) {accuracy = value;});
                let score = '';
                await GearList.sum('score', { where: { guild: message.guild.id } }).then(function(value) {score = value;});
                let level = '';
                await GearList.sum('level', { where: { guild: message.guild.id } }).then(function(value) {level = value;});
                const url = message.guild.iconURL;
                const embed = {
                    'title': `${message.guild.name} Guild Stats`,
                    'thumbnail': {
                        'url': url.slice(0, (url.length - 3)) + 'png',
                    },
                    'fields': [
                        {
                            'name': 'Average Renown Score',
                            'value': Math.round(parseInt(score) / parseInt(count)).toString(),
                            'inline': true,
                        },
                        {
                            'name': 'Average Level',
                            'value': (parseFloat(level) / parseInt(count)).toFixed(2),
                            'inline': true,
                        },
                        {
                            'name': 'Average AP',
                            'value': Math.round(parseInt(ap) / parseInt(count)).toString(),
                            'inline': true,
                        },
                        {
                            'name': 'Average AAP',
                            'value': Math.round(parseInt(aap) / parseInt(count)).toString(),
                            'inline': true,
                        },
                        {
                            'name': 'Average DP',
                            'value': Math.round(parseInt(dp) / parseInt(count)).toString(),
                            'inline': true,
                        },
                        {
                            'name': 'Average Accuracy',
                            'value': Math.round(parseInt(accuracy) / parseInt(count)).toString(),
                            'inline': true,
                        },
                        {
                            'name': 'Registered Members',
                            'value': count.toString(),
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
        function createGearListEmbed(gear) {
            let length = gear.length;
            const embeds = [];
            let count = 0;
            let embed = '```md\nName                            [AP ](AAP)[DP ] < Acc > [Score] <Level> < Class       >\n';
            gear.forEach(element => {
                if (count < 14) {
                    const renown = Math.round(((parseInt(element.ap) + parseInt(element.aap)) / 2) + parseInt(element.dp));
                    let classname = element.class.charAt(0).toUpperCase() + element.class.substr(1);
                    if (classname === 'Darkknight') {
                        classname = 'Dark Knight';
                    }
                    const level = parseFloat(element.level).toFixed(2);
                    let name = message.guild.members.get(element.user).nickname;
                    if (name === null) {
                        name = message.guild.members.get(element.user).user.username;
                    }
                    embed += `${padString('                                ', name, false)}`;
                    embed += `[${padString('   ', element.ap, true)}]`;
                    embed += `(${padString('   ', element.aap, true)})`;
                    embed += `[${padString('   ', element.dp, true)}]`;
                    embed += ` < ${padString('   ', element.accuracy, true)} >`;
                    embed += ` [${padString('     ', renown, true)}]`;
                    embed += ` <${padString('00000', level, true)}>`;
                    embed += ` < ${padString('           ', classname, false)} >`;
                    embed += '\n';
                    count += 1;
                    if (length === 1) {
                        embed += '\n';
                        embed += '```';
                        embeds.push(embed);
                    }
                }
                else {
                    const renown = Math.round(((parseInt(element.ap) + parseInt(element.aap)) / 2) + parseInt(element.dp));
                    let classname = element.class.charAt(0).toUpperCase() + element.class.substr(1);
                    if (classname === 'Darkknight') {
                        classname = 'Dark Knight';
                    }
                    const level = parseFloat(element.level).toFixed(2);
                    let name = message.guild.members.get(element.user).nickname;
                    if (name === null) {
                        name = message.guild.members.get(element.user).user.username;
                    }
                    embed += `${padString('                                ', name, false)}`;
                    embed += `[${padString('   ', element.ap, true)}]`;
                    embed += `(${padString('   ', element.aap, true)})`;
                    embed += `[${padString('   ', element.dp, true)}]`;
                    embed += ` < ${padString('   ', element.accuracy, true)} >`;
                    embed += ` [${padString('     ', renown, true)}]`;
                    embed += ` <${padString('00000', level, true)}>`;
                    embed += ` < ${padString('           ', classname, false)} >`;
                    embed += '\n';
                    embed += '```';
                    embeds.push(embed);
                    embed = '```md\nName                            [AP ](AAP)[DP ] < Acc > [Score] <Level> < Class       >\n';
                    count = 0;
                }
                length -= 1;
            });
            return embeds;
        }
        function pruneGearList() {
            const guildmembers = [];
            message.guild.members.forEach(member => {
                const roles = member.roles;
                roles.forEach(role => {
                    if (guildmemberroles.includes(role.name)) {
                        if (!guildmembers.includes(member.id)) {
                            guildmembers.push(member.id);
                        }
                    }
                });
            });
            GearList.destroy({ where: { user: { [Op.notIn]: guildmembers }, guild: message.guild.id } });
        }
        pruneGearList();
        const roles = message.guild.members.get(message.author.id).roles;
        let guildmemberpermission = false;
        roles.forEach(role => {
            if (guildmemberroles.includes(role.name)) {
                guildmemberpermission = true;
            }
        });
        if (message.channel.name !== 'gear') {
            return message.reply('This command can only be used in the #gear channel!');
        }
        if (guildmemberpermission === false) {
            return message.reply('This command can only be used by Guild Members!');
        }
        if (!args.length) {
            GearList.findAll({ where: { guild: message.guild.id }, order: [['score', 'DESC']] }).then(gear => {
                if (gear === null || gear.length === 0 || gear === undefined) {
                    return message.reply('No one has registered any gear!');
                }
                else {
                    generateGearStats(GearList)
                        .then(embed => {
                            message.channel.send({ embed });
                            const data = createGearListEmbed(gear);
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
        else if (args[0].toLowerCase() === 'class') {
            GearList.findAll({ where: { guild: message.guild.id }, order: [[args[0].toLowerCase(), 'ASC']] }).then(gear => {
                if (gear === null) {
                    return message.reply('No one has registered any gear!');
                }
                else {
                    generateGearStats(GearList)
                        .then(embed => {
                            message.channel.send({ embed });
                            const data = createGearListEmbed(gear);
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
        else if (['ap', 'aap', 'dp', 'accuracy', 'score', 'level'].includes(args[0].toLowerCase())) {
            GearList.findAll({ where: { guild: message.guild.id }, order: [[args[0].toLowerCase(), 'DESC']] }).then(gear => {
                if (gear === null) {
                    return message.reply('No one has registered any gear!');
                }
                else {
                    generateGearStats(GearList)
                        .then(embed => {
                            message.channel.send({ embed });
                            const data = createGearListEmbed(gear);
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
            return message.reply(`You can only sort the gear list by these attributes:\n
						ap, aap, dp, accuracy, score, level, class\n
						• \`!gearlist score\`
						\u200b`);
        }
    },
};
