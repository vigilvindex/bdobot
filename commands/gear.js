/**
 * @file gear.js
 * @description BDOBot Discord Bot Gear Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 * @todo Add ability to supply only a BDOPlanner link to add/update a gear entry.
 */
module.exports = {
    name: 'gear',
    description: 'Lets members register their gear in the guild.',
    args: false,
    usage: 'help (For more information.)',
    aliases: ['g'],
    execute(message, args) {
        const { Op } = require('sequelize');
        const { GearList } = require('../dbObjects');
        const classnames = ['berserker', 'darkknight', 'kunoichi', 'lahn', 'maehwa', 'musa', 'mystic', 'ninja', 'ranger', 'sorceress', 'striker', 'tamer', 'valkyrie', 'warrior', 'witch', 'wizard'];
        const officerroles = ['officer', 'mod', 'admin', 'guildmaster'];
        const guildmemberroles = ['officer', 'mod', 'admin', 'guildmaster', 'guildmember'];
        const classicons = {
            berserker: 'https://i.imgur.com/0LeMmMv.png',
            darkknight: 'https://i.imgur.com/0CWpbpO.png',
            kunoichi: 'https://i.imgur.com/SV2VvyR.png',
            lahn: 'https://i.imgur.com/lsSNOrl.png',
            maehwa: 'https://i.imgur.com/p3y32Bc.png',
            musa: 'https://i.imgur.com/BxVPcnC.png',
            mystic: 'https://i.imgur.com/mWtv1xL.png',
            ninja: 'https://i.imgur.com/ITbR1ZM.png',
            ranger: 'https://i.imgur.com/DUpRzyx.png',
            sorceress: 'https://i.imgur.com/i2KSkNd.png',
            striker: 'https://i.imgur.com/wor3UbP.png',
            tamer: 'https://i.imgur.com/uS4BUZB.png',
            valkyrie: 'https://i.imgur.com/A4EhWvC.png',
            warrior: 'https://i.imgur.com/0F1cqGy.png',
            witch: 'https://i.imgur.com/gsKgeIW.png',
            wizard: 'https://i.imgur.com/oWPRUlo.png',
        };
        function createGearEmbed(gear) {
            let classname = gear.class.charAt(0).toUpperCase() + gear.class.substr(1);
            if (classname === 'Darkknight') {
                classname = 'Dark Knight';
            }
            const embed = {
                'title': 'Gear',
                'timestamp': gear.updated.toISOString(),
                'footer': {
                    'text': 'Last Updated',
                },
                'thumbnail': {
                    'url': `${classicons[gear.class]}`,
                },
                'description': `<@${gear.user}>\nRenown Score: **${gear.score}**\nLink: ${gear.link}\n`,
                'fields': [
                    {
                        'name': 'AP',
                        'value': gear.ap,
                        'inline': true,
                    },
                    {
                        'name': 'AAP',
                        'value': gear.aap,
                        'inline': true,
                    },
                    {
                        'name': 'DP',
                        'value': gear.dp,
                        'inline': true,
                    },
                    {
                        'name': 'Accuracy',
                        'value': gear.accuracy,
                        'inline': true,
                    },
                    {
                        'name': 'Level',
                        'value': gear.level.toString(),
                        'inline': true,
                    },
                    {
                        'name': 'Class',
                        'value': classname,
                        'inline': true,
                    },
                ],
            };
            return embed;
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
        function sendGearListReminder() {
            let guildmembers = [];
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
            GearList.findAll({ where: { user: { [Op.in]: guildmembers }, guild: message.guild.id } }).then(gearentries => {
                gearentries.forEach(entry => {
                    if (guildmembers.includes(entry.user)) {
                        guildmembers = guildmembers.filter(value => value !== entry.user);
                    }
                });
                guildmembers.forEach(member => {
                    message.guild.members.get(member).send(`Hello! I am the Discord BDO Bot for the ${message.guild.name} Discord server. I am reminding you to register your gear in the #gear channel. You can do this by typing the following command with your values in the #gear channel:

					\`!gear ap:100 aap:100 dp:100 accuracy:100 level:60 class:Ninja link:http://bdoplanner.com/build\`

					Thanks!
					`);
                });
            });
        }
        function createGear(discordid) {
            const gear = {
                user: discordid,
                ap: 0,
                aap: 0,
                dp: 0,
                accuracy: 0,
                level: 0,
                class: 'berserker',
                link: 'https://bdoplanner.com/',
                score: 0,
                updated: new Date(),
            };
            args.forEach(element => {
                if (element.startsWith('ap:')) { gear.ap = parseInt(element.substr(3)); }
                if (element.startsWith('aap:')) { gear.aap = parseInt(element.substr(4)); }
                if (element.startsWith('dp:')) { gear.dp = parseInt(element.substr(3)); }
                if (element.startsWith('accuracy:')) { gear.accuracy = parseInt(element.substr(9)); }
                if (element.startsWith('level:')) { gear.level = parseFloat(element.substr(6)); }
                if (element.startsWith('class:')) { gear.class = element.substr(6).toLowerCase(); }
                if (element.startsWith('link:')) { gear.link = element.substr(5); }
            });
            if (gear.ap < 0 || gear.ap > 999 || Number.isNaN(gear.ap)) {
                return message.reply('You must enter a number between 0 and 999 for AP!\n\n\t\t\t\t\t• `!gear ap:100`\n\u200b');
            }
            if (gear.aap < 0 || gear.aap > 999 || Number.isNaN(gear.aap)) {
                return message.reply('You must enter a number between 0 and 999 for AAP!\n\n\t\t\t\t\t• `!gear aap:100`\n\u200b');
            }
            if (gear.dp < 0 || gear.dp > 999 || Number.isNaN(gear.dp)) {
                return message.reply('You must enter a number between 0 and 999 for DP!\n\n\t\t\t\t\t• `!gear dp:100`\n\u200b');
            }
            if (gear.accuracy < 0 || gear.accuracy > 999 || Number.isNaN(gear.accuracy)) {
                return message.reply('You must enter a number between 0 and 999 for Accuracy!\n\n\t\t\t\t\t• `!gear accuracy:100`\n\u200b');
            }
            if (gear.level < 0 || gear.level > 999 || Number.isNaN(gear.level)) {
                return message.reply('You must enter a number between 0 and 999 for Level!\n\n\t\t\t\t\t• `!gear level:59.50`\n\u200b');
            }
            if (!classnames.includes(gear.class.toLowerCase())) {
                return message.reply(`You must enter one of the following classes with no spaces:\n
                berserker, darkknight, kunoichi, lahn, maehwa, musa, mystic, ninja, ranger, sorceress, striker, tamer, valkyrie, warrior, witch, wizard\n
                • \`!gear class:darkknight\`
                \u200b`);
            }
            if (!gear.link.startsWith('https://bdoplanner.com/')) {
                return message.reply('You must enter a BDO Planner link!\n\n\t\t\t\t\t• `!gear link:https://bdoplanner.com/build`\n\u200b');
            }
            gear.score = Math.round(((parseInt(gear.ap) + parseInt(gear.aap)) / 2) + parseInt(gear.dp));
            GearList.upsert({
                user: discordid,
                guild: message.guild.id,
                ap: gear.ap,
                aap: gear.aap,
                dp: gear.dp,
                accuracy: gear.accuracy,
                level: gear.level,
                class: gear.class,
                link: gear.link,
                score: gear.score,
            });
            return gear;
        }
        function updateGear(gear, discordid) {
            const newgear = {
                user: discordid,
                ap: gear.ap,
                aap: gear.aap,
                dp: gear.dp,
                accuracy: gear.accuracy,
                level: gear.level,
                class: gear.class,
                link: gear.link,
                score: gear.score,
                updated: new Date(),
            };
            args.forEach(element => {
                if (element.startsWith('ap:')) { newgear.ap = parseInt(element.substr(3)); }
                if (element.startsWith('aap:')) { newgear.aap = parseInt(element.substr(4)); }
                if (element.startsWith('dp:')) { newgear.dp = parseInt(element.substr(3)); }
                if (element.startsWith('accuracy:')) { newgear.accuracy = parseInt(element.substr(9)); }
                if (element.startsWith('level:')) { newgear.level = parseFloat(element.substr(6)); }
                if (element.startsWith('class:')) { newgear.class = element.substr(6).toLowerCase(); }
                if (element.startsWith('link:')) { newgear.link = element.substr(5); }
            });
            if (newgear.ap < 0 || newgear.ap > 999 || Number.isNaN(newgear.ap)) {
                return message.reply('You must enter a number between 0 and 999 for AP!\n\n\t\t\t\t\t• `!gear ap:100`\n\u200b');
            }
            if (newgear.aap < 0 || newgear.aap > 999 || Number.isNaN(newgear.aap)) {
                return message.reply('You must enter a number between 0 and 999 for AAP!\n\n\t\t\t\t\t• `!gear aap:100`\n\u200b');
            }
            if (newgear.dp < 0 || newgear.dp > 999 || Number.isNaN(newgear.dp)) {
                return message.reply('You must enter a number between 0 and 999 for DP!\n\n\t\t\t\t\t• `!gear dp:100`\n\u200b');
            }
            if (newgear.accuracy < 0 || newgear.accuracy > 999 || Number.isNaN(newgear.accuracy)) {
                return message.reply('You must enter a number between 0 and 999 for Accuracy!\n\n\t\t\t\t\t• `!gear accuracy:100`\n\u200b');
            }
            if (newgear.level < 0 || newgear.level > 999 || Number.isNaN(newgear.level)) {
                return message.reply('You must enter a number between 0 and 999 for Level!\n\n\t\t\t\t\t• `!gear level:59.50`\n\u200b');
            }
            if (!classnames.includes(newgear.class.toLowerCase())) {
                return message.reply(`You must enter one of the following classes with no spaces:\n
                berserker, darkknight, kunoichi, lahn, maehwa, musa, mystic, ninja, ranger, sorceress, striker, tamer, valkyrie, warrior, witch, wizard\n
                • \`!gear class:darkknight\`
                \u200b`);
            }
            if (!newgear.link.startsWith('https://bdoplanner.com/')) {
                return message.reply('You must enter a BDO Planner link!\n\n\t\t\t\t\t• `!gear link:https://bdoplanner.com/build`\n\u200b');
            }
            newgear.score = Math.round(((parseInt(newgear.ap) + parseInt(newgear.aap)) / 2) + parseInt(newgear.dp));
            GearList.upsert({
                id: gear.id,
                user: discordid,
                guild: message.guild.id,
                ap: newgear.ap,
                aap: newgear.aap,
                dp: newgear.dp,
                accuracy: newgear.accuracy,
                level: newgear.level,
                class: newgear.class,
                link: newgear.link,
                score: newgear.score,
            });
            return newgear;
        }
        pruneGearList();
        const roles = message.guild.members.get(message.author.id).roles;
        let guildmemberpermission = false;
        let officerpermission = false;
        roles.forEach(role => {
            if (officerroles.includes(role.name)) {
                officerpermission = true;
            }
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
            GearList.findOne({ where: { user: message.author.id, guild: message.guild.id } }).then(gear => {
                if (gear === null || gear.length === 0 || gear === undefined) {
                    return message.reply(`You have not registered any gear! You can do this by typing the following command with your values in the #gear channel:

					\`!gear ap:100 aap:100 dp:100 accuracy:100 level:60 class:Ninja link:http://bdoplanner.com/build\`

					Thanks!
					`);
                }
                else {
                    const embed = createGearEmbed(gear);
                    return message.channel.send({ embed });
                }
            });
        }
        else if (args[0].toLowerCase() === 'help' || args[0].toLowerCase() === 'h') {
            return message.reply(`This command can be used in the following ways:\n
			\t\t• \`!gear help\` - Shows this help message.\n
			\t\t• \`!gear\` - Displays your gear.\n
			\t\t• \`!gear @username\` - Displays another members gear.\n
			\t\t• \`!gear ap:100 aap:100 dp:100 accuracy:100 level:60 class:darkknight link:http://bdoplanner.com/build\` - Creates or updates your gear.\n
			\t\t• \`!gear delete\` - Deletes your gear.\n
            \t\t The following commands can only be used by admins or mods:\n
            \t\t• \`!gear create @username ap:100 aap:100 dp:100 accuracy:100 level:60 class:darkknight link:http://bdoplanner.com/build\` - Creates another members gear.\n
            \t\t• \`!gear update @username ap:100 aap:100 dp:100 accuracy:100 level:60 class:darkknight link:http://bdoplanner.com/build\` - Updates another members gear.\n
			\t\t• \`!gear delete @username\` - Deletes another members gear.\n
			\t\t• \`!gear remind\` - Sends a DM to all guild members who have not registered their gear reminding them to do so.\n\u200b`);
        }
        else if (args[0].startsWith('<@')) {
            const user = message.mentions.users.array();
            GearList.findOne({ where: { user: user[0].id, guild: message.guild.id } }).then(gear => {
                if (gear === null || gear.length === 0 || gear === undefined) {
                    return message.reply('That user has not registered any gear!');
                }
                else {
                    const embed = createGearEmbed(gear);
                    return message.channel.send({ embed });
                }
            });
        }
        else if (args[0].toLowerCase() === 'delete' || args[0].toLowerCase() === 'd') {
            if (args.length > 1) {
                if (officerpermission === true) {
                    if (args[1].startsWith('<@')) {
                        const user = message.mentions.users.array();
                        GearList.destroy({ where: { user: user[0].id, guild: message.guild.id } }).then(response => {
                            if (response === 1) {
                                return message.reply(`Gear entry for <@${user[0].id}> has been deleted!`);
                            }
                            else {
                                return message.reply('That user has has not registered any gear!');
                            }
                        });
                    }
                    else {
                        return message.reply('You must specify a valid user!');
                    }
                }
                else {
                    return message.reply('This command can only be used by admins or mods!');
                }
            }
            else {
                GearList.destroy({ where: { user: message.author.id, guild: message.guild.id } }).then(response => {
                    if (response === 1) {
                        return message.reply('Your gear entry has been deleted!');
                    }
                    else {
                        return message.reply('You have not registered any gear!');
                    }
                });
            }
        }
        else if (args[0].toLowerCase() === 'create' || args[0].toLowerCase() === 'c') {
            if (officerpermission === true) {
                if (args.length > 1) {
                    if (args[1].startsWith('<@')) {
                        const user = message.mentions.users.array();
                        GearList.findOne({ where: { user: user[0].id, guild: message.guild.id } }).then(gear => {
                            if (gear === null || gear.length === 0 || gear === undefined) {
                                const newgear = createGear(user[0].id);
                                const embed = createGearEmbed(newgear);
                                return message.channel.send({ embed });
                            }
                            else {
                                return message.reply('That user already has a gear entry!');
                            }
                        });
                    }
                    else {
                        return message.reply('You must specify a valid user!');
                    }
                }
            }
            else {
                return message.reply('This command can only be used by admins or mods!');
            }
        }
        else if (args[0].toLowerCase() === 'update' || args[0].toLowerCase() === 'u') {
            if (officerpermission === true) {
                if (args.length > 1) {
                    if (args[1].startsWith('<@')) {
                        const user = message.mentions.users.array();
                        GearList.findOne({ where: { user: user[0].id, guild: message.guild.id } }).then(gear => {
                            if (gear === null || gear.length === 0 || gear === undefined) {
                                return message.reply('That user already does not have a gear entry!');
                            }
                            else {
                                const newgear = updateGear(gear, user[0].id);
                                const embed = createGearEmbed(newgear);
                                return message.channel.send({ embed });
                            }
                        });
                    }
                    else {
                        return message.reply('You must specify a valid user!');
                    }
                }
            }
            else {
                return message.reply('This command can only be used by admins or mods!');
            }
        }
        else if (args[0].toLowerCase() === 'remind') {
            if (officerpermission) {
                sendGearListReminder();
                return message.reply('Reminders have been sent to all members who have not registered their gear!');
            }
            else {
                return message.reply('This command can only be used by admins or mods!');
            }
        }
        else {
            GearList.findOne({ where: { user: message.author.id, guild: message.guild.id } }).then(gear => {
                if (gear === null || gear.length === 0 || gear === undefined) {
                    const newgear = createGear(message.author.id);
                    const embed = createGearEmbed(newgear);
                    return message.channel.send({ embed });
                }
                else {
                    const newgear = updateGear(gear, message.author.id);
                    const embed = createGearEmbed(newgear);
                    return message.channel.send({ embed });
                }
            });
        }
    },
};
