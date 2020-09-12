/**
 * @file bot.js
 * @description BDOBot Discord Bot Application.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const fs = require("fs");
const logger = require("./utils/logger").logger;
const Discord = require("discord.js");
const client = new Discord.Client();
client.config = require("./config.json");
client.cooldowns = new Discord.Collection();
client.events = new Discord.Collection();
const eventFiles = fs
  .readdirSync("./events")
  .filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];
  client.on(eventName, event.bind(null, client));
}
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
client.jobs = new Discord.Collection();
client.jobhandles = new Discord.Collection();
const jobFiles = fs.readdirSync("./jobs").filter(file => file.endsWith(".js"));
for (const file of jobFiles) {
  const job = require(`./jobs/${file}`);
  client.jobs.set(job.name, job);
}
client.login(client.config.token);
process.on("unhandledRejection", error =>
  logger.error(`Uncaught Promise Rejection: ${error}`)
);
process.on("SIGINT", info => logger.info(`Closing: ${info}`));
process.on("exit", info => logger.info(`Exiting: ${info}`));
