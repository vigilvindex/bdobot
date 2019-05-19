/**
 * @file restart.js
 * @description BDOBot Discord Bot Restart Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = {
    name: 'restart',
    description: 'Restarts the BDOBot process.',
    args: false,
    usage: 'help',
    aliases: ['r'],
    execute(message) {
        const admins = ['210208790585409538'];
        const author = message.author.id;
        if (!admins.includes(author)) {
            return message.reply('This command can only be used by admins!');
        }
        else {
            message.reply('Restarting BDOBot!');
            return process.exit(2);
        }
    },
};
