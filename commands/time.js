/**
 * @file time.js
 * @description BDOBot Discord Bot Time Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const Discord = require("discord.js");
const moment = require("moment");
module.exports = {
  name: "time",
  description: "Displays BDO times in the current channel.",
  args: false,
  usage: "help",
  aliases: ["t"],
  execute(message) {
    function getTime() {
      const time = {};
      let gameHour = 0;
      const now = moment.utc();
      const start = moment.utc([
        now.year(),
        now.month(),
        now.date(),
        0,
        0,
        0,
        0
      ]);
      const elapsed = (now - start) / 1000;
      const secondsIntoGameDay = (elapsed + 200 * 60 + 20 * 60) % (240 * 60);
      const secondsUntilDailyReset = Math.ceil(24 * 60 * 60 - elapsed);
      const minutesUntilDailyReset = Math.ceil(secondsUntilDailyReset / 60);
      const hoursUntilDailyReset = Math.floor(minutesUntilDailyReset / 60);
      const minutesRemainderUntilDailyReset = minutesUntilDailyReset % 60;
      time.dailyhours = hoursUntilDailyReset;
      time.dailyminutes = minutesRemainderUntilDailyReset;
      const secondsUntilImperialReset = Math.ceil(
        3 * 60 * 60 - (elapsed % (60 * 60 * 3))
      );
      const minutesUntilImperialReset = Math.ceil(
        secondsUntilImperialReset / 60
      );
      const hoursUntilImperialReset = Math.floor(
        minutesUntilImperialReset / 60
      );
      const minutesRemainderUntilImperialReset = minutesUntilImperialReset % 60;
      time.imperialhours = hoursUntilImperialReset;
      time.imperialminutes = minutesRemainderUntilImperialReset;
      let secondsUntilBSAReset =
        Math.ceil(60 * 60 * 24) - ((elapsed - 5 * 60 * 60) % (60 * 50 * 24));
      if (secondsUntilBSAReset > 60 * 60 * 24) {
        secondsUntilBSAReset -= 60 * 60 * 24;
      }
      const minutesUntilBSAReset = Math.ceil(secondsUntilBSAReset / 60);
      const hoursUntilBSAReset = Math.floor(minutesUntilBSAReset / 60);
      const minutesRemainderUntilBSAReset = minutesUntilBSAReset % 60;
      time.bsahours = hoursUntilBSAReset;
      time.bsaminutes = minutesRemainderUntilBSAReset;
      if (secondsIntoGameDay >= 12000) {
        const secondsIntoGameNight = secondsIntoGameDay - 12000;
        const nightDone = secondsIntoGameNight / (40 * 60);
        gameHour = 9 * nightDone;
        if (gameHour < 2) {
          gameHour += 22;
        } else {
          gameHour -= 2;
        }
        const secondsUntilNightEnds = Math.ceil(40 * 60 - secondsIntoGameNight);
        const minutesUntilNightEnds = Math.ceil(secondsUntilNightEnds / 60);
        time.night = true;
        time.nighthours = 0;
        time.nightminutes = minutesUntilNightEnds;
      } else {
        const secondsIntoGameDayTime = secondsIntoGameDay;
        const dayDone = secondsIntoGameDay / (200 * 60);
        gameHour = 7 + (22 - 7) * dayDone;
        const secondsUntilNightStarts = Math.ceil(
          12000 - secondsIntoGameDayTime
        );
        const minutesUntilNightStarts = Math.ceil(secondsUntilNightStarts / 60);
        const hoursUntilNightStarts = Math.floor(minutesUntilNightStarts / 60);
        const minutesRemainderUntilNightStarts = minutesUntilNightStarts % 60;
        time.night = false;
        time.nighthours = hoursUntilNightStarts;
        time.nightminutes = minutesRemainderUntilNightStarts;
      }
      let minutes = ((gameHour % 1) * 60) >> 0;
      let hours = (gameHour / 1) >> 0;
      let ampm = "AM";
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (hours > 12) {
        hours -= 12;
        hours = "0" + hours;
        ampm = "PM";
      }
      time.now = hours + ":" + minutes + " " + ampm;
      return time;
    }
    function createTimeEmbed(time) {
      let current = "";
      let night = "";
      if (time.night) {
        current = `🌙 ${time.now}`;
        night = `Ends in ${time.nightminutes} minutes.`;
      } else {
        current = `☀️ ${time.now}`;
        if (time.nighthours > 0) {
          night = `Starts in ${time.nighthours} hours, ${
            time.nightminutes
          } minutes.`;
        } else {
          night = `Starts in ${time.nightminutes} minutes.`;
        }
      }
      let imperial = "";
      if (time.imperialhours > 0) {
        imperial = `Resets in ${time.imperialhours} hours, ${
          time.imperialminutes
        } minutes.`;
      } else {
        imperial = `Resets in ${time.imperialminutes} minutes.`;
      }
      let daily = "";
      if (time.dailyhours > 0) {
        daily = `Reset in ${time.dailyhours} hours, ${
          time.dailyminutes
        } minutes.`;
      } else {
        daily = `Reset in ${time.dailyminutes} minutes.`;
      }
      let bsa = "";
      if (time.bsahours > 0) {
        bsa = `Resets in ${time.bsahours} hours, ${time.bsaminutes} minutes.`;
      } else {
        bsa = `Resets in ${time.bsaminutes} minutes.`;
      }
      const embed = new Discord.RichEmbed();
      embed.setTitle("⏰ BDOBot Timers");
      embed.addField("\u200b", `🕒 **Current Game Time:** ${current}`, false);
      embed.addField("\u200b", `🌙 **Night Cycle:** ${night}`, false);
      embed.addField("\u200b", `👑 **Imperial Trading:** ${imperial}`, false);
      embed.addField("\u200b", `📅 **Daily Missions:** ${daily}`, false);
      embed.addField("\u200b", `🎲 **Black Spirit Adventure:** ${bsa}`, false);
      return embed;
    }
    const time = getTime();
    const embed = createTimeEmbed(time);
    return message.channel.send({ embed });
  }
};
