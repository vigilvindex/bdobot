/**
 * @file guild.js
 * @description BDOBot Discord Bot Guild Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = {
    name: 'guild',
    description: 'Lets admins & mods register members in the guild.',
    args: false,
    usage: 'help',
    aliases: ['gm'],
    execute(message, args) {
        const { Op } = require('sequelize');
        const moment = require('moment');
        const { GuildList } = require('../dbObjects');
        const officerroles = ['officer', 'mod', 'admin', 'guildmaster'];
        const guildmemberroles = ['officer', 'mod', 'admin', 'guildmaster', 'guildmember'];
        function createGuildEmbed(data) {
            let rank = '';
            switch (data.rank) {
            case 'member':
                rank = 'Member';
                break;
            case 'quartermaster':
                rank = 'Quarter Master';
                break;
            case 'officer':
                rank = 'Officer';
                break;
            case 'guildmaster':
                rank = 'Guild Master';
                break;
            }
            const embed = {
                'timestamp': moment(data.updated),
                'footer': {
                    'text': 'Last Updated',
                },
                'fields': [
                    {
                        'name': 'Family Name:',
                        'value': data.name,
                        'inline': true,
                    },
                    {
                        'name': 'Discord Name',
                        'value': `<@${data.discord}>`,
                        'inline': true,
                    },
                    {
                        'name': 'Rank:',
                        'value': rank,
                        'inline': true,
                    },
                    {
                        'name': 'Join Date:',
                        'value': data.joined,
                        'inline': true,
                    },
                    {
                        'name': 'Last Renewal:',
                        'value': data.renewed,
                        'inline': true,
                    },
                    {
                        'name': 'Expiry Date:',
                        'value': data.expiry,
                        'inline': true,
                    },
                    {
                        'name': 'Contract Term:',
                        'value': data.term,
                        'inline': true,
                    },
                    {
                        'name': 'Daily Pay:',
                        'value': data.pay.toLocaleString(),
                        'inline': true,
                    },
                    {
                        'name': 'Allowance:',
                        'value': data.allowance.toLocaleString(),
                        'inline': true,
                    },
                    {
                        'name': 'Starting Activity:',
                        'value': data.startactivity.toLocaleString(),
                        'inline': true,
                    },
                    {
                        'name': 'Current Activity:',
                        'value': data.activity.toLocaleString(),
                        'inline': true,
                    },
                    {
                        'name': 'Contribution:',
                        'value': data.contribution.toLocaleString(),
                        'inline': true,
                    },
                    {
                        'name': 'Recruited By:',
                        'value': data.recruiter,
                        'inline': true,
                    },
                    {
                        'name': 'Renewed By:',
                        'value': `<@${data.by}>`,
                        'inline': true,
                    },
                    {
                        'name': 'Expired Contract:',
                        'value': data.expired.charAt(0).toUpperCase() + data.expired.substr(1),
                        'inline': true,
                    },
                ],
            };
            return embed;
        }
        function createGuildMember(guildmember, discordId) {
            guildmember = {
                discord: discordId,
                guild: message.guild.id,
                name: 'FamilyName',
                joined: moment().format('YYYY-MM-DD'),
                renewed: moment().format('YYYY-MM-DD'),
                term: 30,
                pay: 30000,
                rank: 'member',
                activity: 0,
                startactivity: 0,
                contribution: 0,
                by: message.author.id,
                recruiter: 'RecruiterFamilyName',
                allowance: 0,
                expired: 'false',
                expiry: moment().add(30, 'days').format('YYYY-MM-DD'),
            };
            args.forEach(element => {
                if (element.startsWith('name:')) { guildmember.name = element.substr(5); }
                if (element.startsWith('joined:')) { guildmember.joined = element.substr(7); }
                if (element.startsWith('renewed:')) { guildmember.renewed = element.substr(8); }
                if (element.startsWith('term:')) { guildmember.term = parseInt(element.substr(5)); }
                if (element.startsWith('pay:')) { guildmember.pay = parseInt(element.substr(4)); }
                if (element.startsWith('rank:')) { guildmember.rank = element.substr(5).toLowerCase(); }
                if (element.startsWith('activity:')) { guildmember.activity = parseInt(element.substr(9)); }
                if (element.startsWith('startactivity:')) { guildmember.startactivity = parseInt(element.substr(14)); }
                if (element.startsWith('contribution:')) { guildmember.contribution = parseInt(element.substr(13)); }
                if (element.startsWith('by:')) { guildmember.by = element.substr(3); }
                if (element.startsWith('recruiter:')) { guildmember.recruiter = element.substr(10); }
                if (element.startsWith('allowance:')) { guildmember.allowance = parseInt(element.substr(10)); }
                if (element.startsWith('expired:')) { guildmember.expired = element.substr(8); }
                if (element.startsWith('expiry:')) { guildmember.expiry = element.substr(7); }
            });
            if (guildmember.name.length < 3 || guildmember.name.length > 16 || typeof guildmember.name !== 'string') {
                return message.reply('You must enter a valid family name between 3 and 16 characters long!');
            }
            if (guildmember.joined.length !== 10 || typeof guildmember.joined !== 'string' || !moment(guildmember.joined, 'YYYY-MM-DD', true).isValid()) {
                return message.reply('You must enter a valid joined date in this format: YYYY-MM-DD!');
            }
            if (guildmember.renewed.length !== 10 || typeof guildmember.renewed !== 'string' || !moment(guildmember.renewed, 'YYYY-MM-DD', true).isValid()) {
                return message.reply('You must enter a valid renewed date in this format: YYYY-MM-DD!');
            }
            if (![1, 7, 14, 30, 180, 365].includes(guildmember.term) || Number.isNaN(guildmember.term)) {
                return message.reply('You must enter a valid contract term from the following number of day: 1, 7, 14, 30, 180, 365!');
            }
            if (guildmember.pay < 0 || Number.isNaN(guildmember.pay)) {
                return message.reply('You must enter a valid number for guild pay!');
            }
            if (!['member', 'officer', 'quartermaster', 'guildmaster'].includes(guildmember.rank) || typeof guildmember.rank !== 'string') {
                return message.reply('You must enter a valid rank from the following options: member, quartermaster, officer, guildmaster!');
            }
            if (guildmember.activity < 0 || Number.isNaN(guildmember.activity)) {
                return message.reply('You must enter a valid number for guild activity!');
            }
            if (guildmember.startactivity < 0 || Number.isNaN(guildmember.startactivity)) {
                return message.reply('You must enter a valid number for guild start activity!');
            }
            if (guildmember.contribution < 0 || Number.isNaN(guildmember.contribution)) {
                return message.reply('You must enter a valid number for guild contribution!');
            }
            if (typeof guildmember.recruiter !== 'string') {
                return message.reply('You must enter a valid name for recruiter!');
            }
            if (guildmember.allowance < 0 || Number.isNaN(guildmember.allowance)) {
                return message.reply('You must enter a valid number for guild allowance!');
            }
            if (!['true', 'false'].includes(guildmember.expired) || typeof guildmember.expired !== 'string') {
                return message.reply('You must enter either true or false for expired status!');
            }
            if (guildmember.expiry.length !== 10 || typeof guildmember.expiry !== 'string' || !moment(guildmember.expiry, 'YYYY-MM-DD', true).isValid()) {
                return message.reply('You must enter a valid expiry date in this format: YYYY-MM-DD!');
            }
            guildmember.contribution = guildmember.activity - guildmember.startactivity;
            guildmember.expiry = moment(guildmember.renewed).add(guildmember.term, 'days').format('YYYY-MM-DD');
            if (moment().isAfter(guildmember.expiry)) {
                guildmember.expired = 'true';
            }
            else {
                guildmember.expired = 'false';
            }
            GuildList.upsert({
                discord: discordId,
                guild: message.guild.id,
                name: guildmember.name,
                joined: guildmember.joined,
                renewed: guildmember.renewed,
                term: guildmember.term,
                pay: guildmember.pay,
                rank: guildmember.rank,
                activity: guildmember.activity,
                startactivity: guildmember.startactivity,
                contribution: guildmember.contribution,
                by: message.author.id,
                recruiter: guildmember.recruiter,
                allowance: guildmember.allowance,
                expired: guildmember.expired,
                expiry: guildmember.expiry,
            });
            return guildmember;
        }
        function updateGuildMember(guildmember, discordId) {
            const newguild = {
                id: guildmember.id,
                discord: discordId,
                guild: message.guild.id,
                name: guildmember.name,
                joined: guildmember.joined,
                renewed: guildmember.renewed,
                term: guildmember.term,
                pay: guildmember.pay,
                rank: guildmember.rank,
                activity: guildmember.activity,
                startactivity: guildmember.startactivity,
                contribution: guildmember.contribution,
                by: message.author.id,
                recruiter: guildmember.recruiter,
                allowance: guildmember.allowance,
                expired: guildmember.expired,
                expiry: guildmember.expiry,
            };
            args.forEach(element => {
                if (element.startsWith('name:')) { newguild.name = element.substr(5); }
                if (element.startsWith('joined:')) { newguild.joined = element.substr(7); }
                if (element.startsWith('renewed:')) { newguild.renewed = element.substr(8); }
                if (element.startsWith('term:')) { newguild.term = parseInt(element.substr(5)); }
                if (element.startsWith('pay:')) { newguild.pay = parseInt(element.substr(4)); }
                if (element.startsWith('rank:')) { newguild.rank = element.substr(5).toLowerCase(); }
                if (element.startsWith('activity:')) { newguild.activity = parseInt(element.substr(9)); }
                if (element.startsWith('startactivity:')) { newguild.startactivity = parseInt(element.substr(14)); }
                if (element.startsWith('contribution:')) { newguild.contribution = parseInt(element.substr(13)); }
                if (element.startsWith('by:')) { newguild.by = element.substr(3); }
                if (element.startsWith('recruiter:')) { newguild.recruiter = element.substr(10); }
                if (element.startsWith('allowance:')) { newguild.allowance = parseInt(element.substr(10)); }
                if (element.startsWith('expired:')) { newguild.expired = element.substr(8); }
                if (element.startsWith('expiry:')) { newguild.expiry = element.substr(7); }
            });
            if (newguild.name.length < 3 || newguild.name.length > 16 || typeof newguild.name !== 'string') {
                return message.reply('You must enter a valid family name between 3 and 16 characters long!');
            }
            if (newguild.joined.length !== 10 || typeof newguild.joined !== 'string' || !moment(newguild.joined, 'YYYY-MM-DD', true).isValid()) {
                return message.reply('You must enter a valid joined date in this format: YYYY-MM-DD!');
            }
            if (newguild.renewed.length !== 10 || typeof newguild.renewed !== 'string' || !moment(newguild.renewed, 'YYYY-MM-DD', true).isValid()) {
                return message.reply('You must enter a valid renewed date in this format: YYYY-MM-DD!');
            }
            if (![1, 7, 14, 30, 180, 365].includes(newguild.term) || Number.isNaN(newguild.term)) {
                return message.reply('You must enter a valid contract term from the following number of day: 1, 7, 14, 30, 180, 365!');
            }
            if (newguild.pay < 0 || Number.isNaN(newguild.pay)) {
                return message.reply('You must enter a valid number for guild pay!');
            }
            if (!['member', 'officer', 'quartermaster', 'guildmaster'].includes(newguild.rank) || typeof newguild.rank !== 'string') {
                return message.reply('You must enter a valid rank from the following options: member, quartermaster, officer, guildmaster!');
            }
            if (newguild.activity < 0 || Number.isNaN(newguild.activity)) {
                return message.reply('You must enter a valid number for guild activity!');
            }
            if (newguild.startactivity < 0 || Number.isNaN(newguild.startactivity)) {
                return message.reply('You must enter a valid number for guild start activity!');
            }
            if (newguild.contribution < 0 || Number.isNaN(newguild.contribution)) {
                return message.reply('You must enter a valid number for guild contribution!');
            }
            if (typeof newguild.recruiter !== 'string') {
                return message.reply('You must enter a valid name for recruiter!');
            }
            if (newguild.allowance < 0 || Number.isNaN(newguild.allowance)) {
                return message.reply('You must enter a valid number for guild allowance!');
            }
            if (!['true', 'false'].includes(newguild.expired) || typeof newguild.expired !== 'string') {
                return message.reply('You must enter either true or false for expired status!');
            }
            if (newguild.expiry.length !== 10 || typeof newguild.expiry !== 'string' || !moment(newguild.expiry, 'YYYY-MM-DD', true).isValid()) {
                return message.reply('You must enter a valid expiry date in this format: YYYY-MM-DD!');
            }
            newguild.contribution = newguild.activity - newguild.startactivity;
            newguild.expiry = moment(newguild.renewed).add(newguild.term, 'days').format('YYYY-MM-DD');
            if (moment().isAfter(newguild.expiry)) {
                newguild.expired = 'true';
            }
            else {
                newguild.expired = 'false';
            }
            GuildList.upsert({
                id: guildmember.id,
                discord: discordId,
                guild: message.guild.id,
                name: newguild.name,
                joined: newguild.joined,
                renewed: newguild.renewed,
                term: newguild.term,
                pay: newguild.pay,
                rank: newguild.rank,
                activity: newguild.activity,
                startactivity: newguild.startactivity,
                contribution: newguild.contribution,
                by: message.author.id,
                recruiter: newguild.recruiter,
                allowance: newguild.allowance,
                expired: newguild.expired,
                expiry: newguild.expiry,
            });
            return newguild;
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
        async function remindExpired() {
            try {
                await GuildList.findAll({ where: { guild: message.guild.id, expired: { [Op.in]: ['true'] } } }).then(list => {
                    if (list.length > 0) {
                        list.forEach(entry => {
                            message.guild.members.get(entry.discord).send(`Hello! I am the Discord BDO Bot for the ${message.guild.name} Discord server. I am reminding you that your contract has expired. Please contact the Guild Master or an Officer when you are online to get a contract renewal. Thanks!`);
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
            GuildList.findOne({ where: { discord: message.author.id, guild: message.guild.id } }).then(guildmember => {
                if (guildmember === null || guildmember.length === 0 || guildmember === undefined) {
                    return message.reply('You have not registered in the guild!');
                }
                else {
                    const embed = createGuildEmbed(guildmember);
                    return message.channel.send({ embed });
                }
            });
        }
        else if (args[0].toLowerCase() === 'help' || args[0].toLowerCase() === 'h') {
            return message.reply(`This command can be used in the following ways:\n
			\t\t• \`!guild help\` - Shows this help message.\n
			\t\t• \`!guild expired\` - Sends a PM to all expired contracts asking them to get their contract renewed.\n
			\t\t• Displaying Entries In The Guild List:\n
			\t\t• \`!guild\` - Shows your own entry in the guild list.\n
			\t\t• \`!guild @username\` - Shows the entry of a member in the guild list.\n
			\t\t• Adding Entries In The Guild List:\n
			\t\t• \`!guild name:FamilyName joined:2018-01-01 renewed:2018-01-01 term:30 pay:30000 rank:member activity:0 startactivity:0 recruiter:@username allowance:0\`
			\t\t - Adds your own entry to the guild list.\n
			\t\t• \`!guild @username name:FamilyName joined:2018-01-01 renewed:2018-01-01 term:30 pay:30000 rank:member activity:0 startactivity:0 recruiter:@username allowance:0\`
			\t\t - Adds a guild member to the guild list.\n
			\t\t• Updating Entries In The Guild List:\n
			\t\t• \`!guild renewed:2018-01-01 term:30 pay:30000 activity:0\` - Updates your own entry in the guild list.\n
			\t\t• \`!guild @username renewed:2018-01-01 term:30 pay:30000 activity:0\` - Updates a guild member in the guild list.\n
			\t\t• Removing Entries In The Guild List:\n
			\t\t• \`!guild delete \` - Removes your own entry from the guild list.\n
			\t\t• \`!guild delete @username \` - Removes a guild member from the guild list.\n\u200b`);
        }
        else if (args[0].toLowerCase() === 'expired' || args[0].toLowerCase() === 'e') {
            remindExpired();
            return message.reply('A reminder has been sent to all members with an expired contract!');
        }
        else if (args[0].toLowerCase() === 'delete' || args[0].toLowerCase() === 'd') {
            if (args.length > 1) {
                if (args[1].startsWith('<@')) {
                    const user = message.mentions.users.array();
                    GuildList.destroy({ where: { discord: user[0].id, guild: message.guild.id } }).then(response => {
                        if (response === 1) {
                            return message.reply('Guild entry for that member has been deleted!');
                        }
                        else {
                            return message.reply('That member is not registered in the guild list!');
                        }
                    });
                }
            }
            else {
                GuildList.destroy({ where: { discord: message.author.id, guild: message.guild.id } }).then(response => {
                    if (response === 1) {
                        return message.reply('Your guild list entry has been deleted!');
                    }
                    else {
                        return message.reply('You have not been registered in the guild list!');
                    }
                });
            }
        }
        else if (args[0].startsWith('<@')) {
            const user = message.mentions.users.array();
            if (args.length < 2) {
                GuildList.findOne({ where: { discord: user[0].id, guild: message.guild.id } }).then(guildmember => {
                    if (guildmember === null || guildmember.length === 0 || guildmember === undefined) {
                        return message.reply('That member has not been registered in the guild list!');
                    }
                    else {
                        const embed = createGuildEmbed(guildmember);
                        return message.channel.send({ embed });
                    }
                });
            }
            else {
                GuildList.findOne({ where: { discord: user[0].id, guild: message.guild.id } }).then(guildmember => {
                    if (guildmember === null || guildmember.length === 0 || guildmember === undefined) {
                        const newguildmember = createGuildMember(guildmember, user[0].id);
                        const embed = createGuildEmbed(newguildmember);
                        return message.channel.send({ embed });
                    }
                    else {
                        const updatedGuildMember = updateGuildMember(guildmember, user[0].id);
                        const embed = createGuildEmbed(updatedGuildMember);
                        return message.channel.send({ embed });
                    }
                });
            }
        }
        else {
            GuildList.findOne({ where: { discord: message.author.id, guild: message.guild.id } }).then(guildmember => {
                if (guildmember === null || guildmember.length === 0 || guildmember === undefined) {
                    const newguildmember = createGuildMember(guildmember, message.author.id);
                    const embed = createGuildEmbed(newguildmember);
                    return message.channel.send({ embed });
                }
                else {
                    const updatedGuildMember = updateGuildMember(guildmember, message.author.id);
                    const embed = createGuildEmbed(updatedGuildMember);
                    return message.channel.send({ embed });
                }
            });
        }
    },
};
