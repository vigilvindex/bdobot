/**
 * @file event.js
 * @description BDOBot Discord Bot Event Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = {
  name: "event",
  description:
    "Lets members create, update, delete, an event or list all events, or mark themselves as attendees or apologies for an event.",
  args: false,
  usage: "help (For more information.)",
  aliases: ["e", "events"],
  execute(message, args) {
    const moment = require("moment-timezone");
    const timezones = [
      "UTC",
      "PST",
      "PDT",
      "MST",
      "MDT",
      "CST",
      "CDT",
      "EST",
      "EDT"
    ];
    const Discord = require("discord.js");
    const { EventList } = require("../dbObjects");
    const officerroles = ["officer", "mod", "admin", "guildmaster"];
    const guildmemberroles = [
      "officer",
      "mod",
      "admin",
      "guildmaster",
      "guildmember"
    ];
    function createEventEmbed(event, tz) {
      let tzn = "Etc/UTC";
      if (tz.toUpperCase() !== "UTC") {
        switch (tz.toUpperCase()) {
          case "UTC":
            tzn = "Etc/UTC";
            break;
          case "PST":
            tzn = "America/Los_Angeles";
            break;
          case "PDT":
            tzn = "America/Los_Angeles";
            break;
          case "MST":
            tzn = "America/Denver";
            break;
          case "MDT":
            tzn = "America/Denver";
            break;
          case "CST":
            tzn = "America/Chicago";
            break;
          case "CDT":
            tzn = "America/Chicago";
            break;
          case "EST":
            tzn = "America/New_York";
            break;
          case "EDT":
            tzn = "America/New_York";
            break;
        }
      }
      const startsutc = moment.tz(event.starts, "YYYY-MM-DD-HH-mm", "Etc/UCT");
      const startstz = moment.tz(startsutc, "YYYY-MM-DD-HH-mm", tzn);
      const starts = startstz.format("YYYY-MM-DD-HH-mm");
      const endsutc = moment.tz(event.ends, "YYYY-MM-DD-HH-mm", "Etc/UCT");
      const endstz = moment.tz(endsutc, "YYYY-MM-DD-HH-mm", tzn);
      const ends = endstz.format("YYYY-MM-DD-HH-mm");
      let attendees = "";
      let apologies = "";
      let atcount = 0;
      let apcount = 0;
      if (event.attendees === "" || event.attendees === undefined) {
        attendees = "None";
      } else {
        const attendeesids = event.attendees.split(",");
        attendeesids.forEach(attendeeid => {
          if (attendeeid.length > 0) {
            const member = message.guild.members.get(attendeeid);
            attendees += `${member} `;
            atcount += 1;
          }
        });
      }
      if (event.apologies === "" || event.apologies === undefined) {
        apologies = "None";
      } else {
        const apologiesids = event.apologies.split(",");
        apologiesids.forEach(apologieid => {
          if (apologieid.length > 0) {
            const member = message.guild.members.get(apologieid);
            apologies += `${member} `;
            apcount += 1;
          }
        });
      }
      const start = moment(starts, "YYYY-MM-DD-HH-mm", true);
      const end = moment(ends, "YYYY-MM-DD-HH-mm", true);
      const duration = moment.duration(end.diff(start));
      let durationstring = "";
      const minutes = duration.asMinutes();
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0) {
        if (hours < 2) {
          durationstring += `${hours} hour`;
        } else {
          durationstring += `${hours} hours`;
        }
        if (mins > 0) {
          durationstring += `, ${mins} minutes.`;
        } else {
          durationstring += ".";
        }
      } else {
        durationstring += `${minutes} minutes.`;
      }
      const embedstarts = moment(starts, "YYYY-MM-DD-HH-mm", true).format(
        "dddd, MMMM Do YYYY, h:mm a"
      );
      const embedends = moment(ends, "YYYY-MM-DD-HH-mm", true).format(
        "dddd, MMMM Do YYYY, h:mm a"
      );
      const embed = new Discord.RichEmbed();
      embed.setTitle("📅 BDOBot Event Planner");
      embed.addField("Event ID:", event.id.toString(), true);
      embed.addField("Event Name:", event.name.replace(/-/g, " "), true);
      embed.addField(
        "Event Description:",
        event.description.replace(/-/g, " "),
        false
      );
      embed.addField("🏁 Event Start:", embedstarts, false);
      embed.addField("🏁 Event End:", embedends, false);
      embed.addField("⌛ Event Duration:", `${durationstring}`, true);
      embed.addField("🌐 Time Zone:", tz.toUpperCase(), true);
      embed.addField(
        "🗺️ Event Location:",
        event.location.replace(/-/g, " "),
        false
      );
      embed.addField(`🎟️ Attendees: ${atcount}`, attendees, true);
      embed.addField(`🎫 Apologies: ${apcount}`, apologies, true);
      return embed;
    }
    function pruneEventsList() {
      EventList.findAll({ where: { guild: message.guild.id } }).then(events => {
        events.forEach(event => {
          const now = moment.utc();
          const end = moment.utc(event.ends, "YYYY-MM-DD-HH-mm", true);
          if (now.isAfter(end)) {
            message.client.guilds
              .get(event.guild)
              .channels.find("name", "events")
              .send(`The ${event.name.replace(/-/g, " ")} event has ended!`);
            EventList.destroy({
              where: { id: event.id, guild: message.guild.id }
            });
          }
        });
      });
    }
    function sendEventReminder() {
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
      EventList.findAll({ where: { guild: message.guild.id } }).then(events => {
        events.forEach(event => {
          const attendees = event.attendees.split(",");
          guildmembers.forEach(guildmember => {
            if (!attendees.includes(guildmember)) {
              message.guild.members.get(guildmember).send(`Hello!
							I am the Discord BDO Bot for the ${message.guild.name} Discord server.
                            I am reminding you to register if you will or won't attend the ${
                              event.name
                            } event which starts at ${
                event.starts
              } (UTC) and ends at ${event.ends} (UTC).
							You can do this by typing the following commands to register your intention to attend or not in the #events channel:
							
                            \`!events id:${event.id} yes\`
                            \`!events id:${event.id} no\`
							
							Thanks!`);
            }
          });
        });
      });
    }
    async function createEvent(arguments, tz) {
      const event = {
        guild: message.guild.id,
        name: "",
        description: "",
        location: "",
        starts: "",
        ends: "",
        attendees: "",
        apologies: "",
        tz: "UTC"
      };
      arguments.forEach(element => {
        if (element.startsWith("name:")) {
          event.name = element.substr(5);
        }
        if (element.startsWith("description:")) {
          event.description = element.substr(12);
        }
        if (element.startsWith("location:")) {
          event.location = element.substr(9);
        }
        if (element.startsWith("starts:")) {
          event.starts = element.substr(7);
        }
        if (element.startsWith("ends:")) {
          event.ends = element.substr(5);
        }
        if (element.startsWith("attendees:")) {
          event.attendees = element.substr(10);
        }
        if (element.startsWith("apologies:")) {
          event.apologies = element.substr(10);
        }
        if (element.startsWith("tz:")) {
          event.tz = element.substr(3).toUpperCase();
        }
      });
      if (typeof event.name !== "string") {
        return message.reply("You must enter a valid event name!");
      }
      if (typeof event.description !== "string") {
        return message.reply("You must enter a valid event description!");
      }
      if (typeof event.location !== "string") {
        return message.reply("You must enter a valid event location!");
      }
      if (
        event.starts.length !== 16 ||
        typeof event.starts !== "string" ||
        !moment(event.starts, "YYYY-MM-DD-HH-mm", true).isValid()
      ) {
        return message.reply(
          "You must enter a valid event start date in this format: YYYY-MM-DD-HH-MM!"
        );
      }
      if (
        event.ends.length !== 16 ||
        typeof event.ends !== "string" ||
        !moment(event.ends, "YYYY-MM-DD-HH-mm", true).isValid() ||
        !moment(event.ends, "YYYY-MM-DD-HH-mm", true).isAfter(
          moment(event.starts, "YYYY-MM-DD-HH-mm", true)
        )
      ) {
        return message.reply(
          "You must enter a valid event end date in this format: YYYY-MM-DD-HH-MM!"
        );
      }
      if (!timezones.includes(tz.toUpperCase())) {
        return message.reply(
          "You must enter a valid timezone from these options: UTC, PST, PDT, MST, MDT, CST, CDT, EST, EDT"
        );
      }
      let tzn = "Etc/UTC";
      if (event.tz.toUpperCase() !== "UTC") {
        switch (event.tz.toUpperCase()) {
          case "UTC":
            tzn = "Etc/UTC";
            break;
          case "PST":
            tzn = "America/Los_Angeles";
            break;
          case "PDT":
            tzn = "America/Los_Angeles";
            break;
          case "MST":
            tzn = "America/Denver";
            break;
          case "MDT":
            tzn = "America/Denver";
            break;
          case "CST":
            tzn = "America/Chicago";
            break;
          case "CDT":
            tzn = "America/Chicago";
            break;
          case "EST":
            tzn = "America/New_York";
            break;
          case "EDT":
            tzn = "America/New_York";
            break;
        }
      }
      const startstz = moment.tz(event.starts, "YYYY-MM-DD-HH-mm", tzn);
      const startsutc = moment.tz(startstz, "YYYY-MM-DD-HH-mm", "Etc/UTC");
      event.starts = startsutc.format("YYYY-MM-DD-HH-mm");
      const endstz = moment.tz(event.ends, "YYYY-MM-DD-HH-mm", tzn);
      const endsutc = moment.tz(endstz, "YYYY-MM-DD-HH-mm", "Etc/UTC");
      event.ends = endsutc.format("YYYY-MM-DD-HH-mm");
      await EventList.create(
        {
          guild: message.guild.id,
          name: event.name,
          description: event.description,
          location: event.location,
          starts: event.starts,
          ends: event.ends,
          attendees: event.attendees,
          apologies: event.apologies
        },
        { returning: true }
      ).then(function(item) {
        event.id = item.id;
      });
      return event;
    }
    async function updateEvent(event, arguments, tz) {
      const newevent = {
        id: event.id,
        guild: message.guild.id,
        name: event.name,
        description: event.description,
        location: event.location,
        starts: event.starts,
        ends: event.ends,
        attendees: event.attendees,
        apologies: event.apologies,
        tz: "UTC"
      };
      arguments.forEach(element => {
        if (element.startsWith("name:")) {
          newevent.name = element.substr(5);
        }
        if (element.startsWith("description:")) {
          newevent.description = element.substr(12);
        }
        if (element.startsWith("location:")) {
          newevent.location = element.substr(9);
        }
        if (element.startsWith("starts:")) {
          newevent.starts = element.substr(7);
        }
        if (element.startsWith("ends:")) {
          newevent.ends = element.substr(5);
        }
        if (element.startsWith("attendees:")) {
          newevent.attendees = element.substr(10);
        }
        if (element.startsWith("apologies:")) {
          newevent.apologies = element.substr(10);
        }
        if (element.startsWith("tz:")) {
          newevent.tz = element.substr(3).toUpperCase();
        }
      });
      if (typeof newevent.name !== "string") {
        return message.reply("You must enter a valid event name!");
      }
      if (typeof newevent.description !== "string") {
        return message.reply("You must enter a valid event description!");
      }
      if (typeof newevent.location !== "string") {
        return message.reply("You must enter a valid event location!");
      }
      if (
        newevent.starts.length !== 16 ||
        typeof newevent.starts !== "string" ||
        !moment(newevent.starts, "YYYY-MM-DD-HH-mm", true).isValid()
      ) {
        return message.reply(
          "You must enter a valid event start date in this format: YYYY-MM-DD-HH-MM!"
        );
      }
      if (
        newevent.ends.length !== 16 ||
        typeof newevent.ends !== "string" ||
        !moment(newevent.ends, "YYYY-MM-DD-HH-mm", true).isValid() ||
        !moment(newevent.ends, "YYYY-MM-DD-HH-mm", true).isAfter(
          moment(newevent.starts, "YYYY-MM-DD-HH-mm", true)
        )
      ) {
        return message.reply(
          "You must enter a valid event end date in this format: YYYY-MM-DD-HH-MM!"
        );
      }
      if (!timezones.includes(tz.toUpperCase())) {
        return message.reply(
          "You must enter a valid timezone from these options: UTC, PST, PDT, MST, MDT, CST, CDT, EST, EDT"
        );
      }
      let tzn = "Etc/UTC";
      if (newevent.tz.toUpperCase() !== "UTC") {
        switch (newevent.tz.toUpperCase()) {
          case "UTC":
            tzn = "Etc/UTC";
            break;
          case "PST":
            tzn = "America/Los_Angeles";
            break;
          case "PDT":
            tzn = "America/Los_Angeles";
            break;
          case "MST":
            tzn = "America/Denver";
            break;
          case "MDT":
            tzn = "America/Denver";
            break;
          case "CST":
            tzn = "America/Chicago";
            break;
          case "CDT":
            tzn = "America/Chicago";
            break;
          case "EST":
            tzn = "America/New_York";
            break;
          case "EDT":
            tzn = "America/New_York";
            break;
        }
      }
      const startstz = moment.tz(event.starts, "YYYY-MM-DD-HH-mm", tzn);
      const startsutc = moment.tz(startstz, "YYYY-MM-DD-HH-mm", "Etc/UTC");
      newevent.starts = startsutc.format("YYYY-MM-DD-HH-mm");
      const endstz = moment.tz(event.ends, "YYYY-MM-DD-HH-mm", tzn);
      const endsutc = moment.tz(endstz, "YYYY-MM-DD-HH-mm", "Etc/UTC");
      newevent.ends = endsutc.format("YYYY-MM-DD-HH-mm");
      await EventList.upsert({
        id: newevent.id,
        guild: message.guild.id,
        name: newevent.name,
        description: newevent.description,
        location: newevent.location,
        starts: newevent.starts,
        ends: newevent.ends,
        attendees: newevent.attendees,
        apologies: newevent.apologies
      });
      return newevent;
    }
    pruneEventsList();
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
    if (message.channel.name !== "events") {
      return message.reply(
        "This command can only be used in the #events channel!"
      );
    }
    if (guildmemberpermission === false) {
      return message.reply("This command can only be used by Guild Members!");
    }
    if (!args.length) {
      return message.reply("This command requires arguments!");
    } else if (
      args[0].toLowerCase() === "help" ||
      args[0].toLowerCase() === "h"
    ) {
      return message.reply(`This command can be used in the following ways:\n
                \t\t• \`!event help\` - Shows this help message.\n
                \t\t The following time zones are supported: UTC, PST, PDT, MST, MDT, CST, CDT, EST, EDT\n
				\t\t• \`!event list tz:UTC\` - Lists all events for this guild with times in UTC.\n
                \t\t• \`!event id:ID yes\` - Registers that you will attend an new event.\n
                \t\t• \`!event id:ID no\` - Registers that you not will attend an new event.\n
                \t\t The following commands can only be used by admins or mods:\n
                \t\t• \`!event create name:Name description:Description location:Location starts:2018-01-01-18-00 ends:2018-01-01-19-00 tz:UTC\` - Creates a new event.\n
                \t\t• \`!event update id:ID name:Name description:Description location:Location starts:2018-01-01-18-00 ends:2018-01-01-19-00 tz:UTC\` - Updates an event.\n
                \t\t• \`!event delete id:ID\` - Deletes an event.\n
                \t\t• \`!event remind\` - Sends a reminder to all members who have not registered if they are attending events.\n\u200b`);
    } else if (
      args[0].toLowerCase() === "list" ||
      args[0].toLowerCase() === "l"
    ) {
      let tz = "UTC";
      args.forEach(element => {
        if (element.startsWith("tz:")) {
          tz = element.substr(3).toUpperCase();
        }
      });
      if (!timezones.includes(tz.toUpperCase())) {
        return message.reply(
          "You must enter a valid timezone from these options: UTC, PST, PDT, MST, MDT, CST, CDT, EST, EDT"
        );
      }
      EventList.all({ where: { guild: message.guild.id } }).then(events => {
        if (events === null || events.length === 0 || events === undefined) {
          return message.reply("There are no events registered!");
        } else {
          events.forEach(event => {
            const embed = createEventEmbed(event, tz);
            return message.channel.send(embed);
          });
        }
      });
    } else if (
      args[0].toLowerCase() === "delete" ||
      args[0].toLowerCase() === "d"
    ) {
      if (officerpermission) {
        if (args.length > 1) {
          if (args[1].startsWith("id:")) {
            const id = parseInt(args[1].substr(3));
            EventList.destroy({
              where: { id: id, guild: message.guild.id }
            }).then(response => {
              if (response === 1) {
                return message.reply("The event has been deleted!");
              } else {
                return message.reply("That event does not exist!");
              }
            });
          } else {
            return message.reply("You must specify a valid event ID!");
          }
        }
      } else {
        return message.reply("You do not have permission to use this command!");
      }
    } else if (
      args[0].toLowerCase() === "remind" ||
      args[0].toLowerCase() === "r"
    ) {
      if (officerpermission) {
        sendEventReminder();
        return message.reply(
          "Reminders have been sent to all members who have not registered their attendance for events!"
        );
      } else {
        return message.reply("You do not have permission to use this command!");
      }
    } else if (
      args[0].toLowerCase() === "create" ||
      args[0].toLowerCase() === "c"
    ) {
      if (officerpermission) {
        (async () => {
          let tz = "UTC";
          args.forEach(element => {
            if (element.startsWith("tz:")) {
              tz = element.substr(3).toUpperCase();
            }
          });
          if (!timezones.includes(tz.toUpperCase())) {
            return message.reply(
              "You must enter a valid timezone from these options: UTC, PST, PDT, MST, MDT, CST, CDT, EST, EDT"
            );
          }
          const newEvent = await createEvent(args, tz);
          const newEmbed = createEventEmbed(newEvent, tz);
          return message.channel.send(newEmbed);
        })();
      } else {
        return message.reply("You do not have permission to use this command!");
      }
    } else if (
      args[0].toLowerCase() === "update" ||
      args[0].toLowerCase() === "u"
    ) {
      if (officerpermission) {
        if (args.length > 1) {
          if (args[1].startsWith("id:")) {
            const id = args[1].substr(3);
            let tz = "UTC";
            args.forEach(element => {
              if (element.startsWith("tz:")) {
                tz = element.substr(3).toUpperCase();
              }
            });
            if (!timezones.includes(tz.toUpperCase())) {
              return message.reply(
                "You must enter a valid timezone from these options: UTC, PST, PDT, MST, MDT, CST, CDT, EST, EDT"
              );
            }
            EventList.findOne({
              where: { id: id, guild: message.guild.id }
            }).then(event => {
              if (event === null || event.length === 0 || event === undefined) {
                return message.reply(
                  "You must specify a valid event ID to update it!"
                );
              } else {
                (async () => {
                  const existingEvent = await updateEvent(event, args, tz);
                  const existingEmbed = createEventEmbed(existingEvent, tz);
                  return message.channel.send(existingEmbed);
                })();
              }
            });
          } else {
            return message.reply("You must specify an event ID to update it!");
          }
        } else {
          return message.reply("You must specify an event ID to update it!");
        }
      } else {
        return message.reply("You do not have permission to use this command!");
      }
    } else if (args[0].startsWith("id:")) {
      if (args.length > 1) {
        const id = args[0].substr(3);
        if (args[1].toLowerCase() === "yes" || args[1].toLowerCase() === "no") {
          let tz = "UTC";
          args.forEach(element => {
            if (element.startsWith("tz:")) {
              tz = element.substr(3).toUpperCase();
            }
          });
          if (!timezones.includes(tz.toUpperCase())) {
            return message.reply(
              "You must enter a valid timezone from these options: UTC, PST, PDT, MST, MDT, CST, CDT, EST, EDT"
            );
          }
          EventList.findOne({
            where: { id: id, guild: message.guild.id }
          }).then(event => {
            if (event === null || event.length === 0 || event === undefined) {
              return message.reply("That event does not exist!");
            } else {
              if (args[1].toLowerCase() === "yes") {
                const pattern = `${message.author.id},`;
                const replace = new RegExp(pattern, "g");
                event.apologies = event.apologies.replace(replace, "");
                event.attendees = event.attendees.replace(replace, "");
                event.attendees += message.author.id + ",";
              }
              if (args[1].toLowerCase() === "no") {
                const pattern = `${message.author.id},`;
                const replace = new RegExp(pattern, "g");
                event.attendees = event.attendees.replace(replace, "");
                event.apologies = event.apologies.replace(replace, "");
                event.apologies += message.author.id + ",";
              }
              (async () => {
                await EventList.upsert({
                  id: event.id,
                  attendees: event.attendees,
                  apologies: event.apologies
                });
                const embed = await createEventEmbed(event, tz);
                return message.channel.send(embed);
              })();
            }
          });
        } else {
          return message.reply(
            "You must specify if you are attend or not by typing yes or no after the event ID!"
          );
        }
      } else {
        return message.reply(
          "You must specify if you are attend or not by typing yes or no after the event ID!"
        );
      }
    } else {
      return message.reply(
        "You have not provided the correct arguments for this command."
      );
    }
  }
};
