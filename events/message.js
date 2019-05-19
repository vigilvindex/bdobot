/**
 * @file message.js
 * @description BDOBot Discord Bot Message Event.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const moment = require('moment');
const logger = require('../utils/logger').logger;
const Discord = require('discord.js');
module.exports = (client, message) => {
    if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
    const args = message.content.slice(client.config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) {
        return message.reply('That is not a valid command!');
    }
    if (command.args && !args.length) {
        let reply = `You did not provide the correct arguments, ${message.author.username}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: ${client.config.prefix}${command.name} ${command.usage}.`;
        }
        return message.channel.send(reply);
    }
    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Discord.Collection());
    }
    const now = moment.utc();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the ${command.name} command.`);
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    try {
        command.execute(message, args);
    }
    catch (error) {
        logger.error(`${error}`);
        message.reply('There was an error trying to execute that command!');
    }
};