/**
 * @file boss.js
 * @description BDOBot Discord Bot World Boss Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = {
  name: "boss",
  description:
    "Displays world boss spawn times. Also enables or disables world boss spawn time notifications.",
  args: true,
  usage:
    "on, off, all, karanda, kzarka, nouver, kutum, offin, quint, muraka, or vell",
  aliases: ["c"],
  execute(message, args) {
    const bossnames = [
      "karanda",
      "kzarka",
      "nouver",
      "kutum",
      "offin",
      "quint",
      "muraka",
      "vell"
    ];
    const bosses = {
      karanda: {
        mon: ["0000", "0700"],
        tue: ["0515"],
        wed: ["0000", "0700", "1400"],
        thu: ["0315"],
        fri: ["0315", "1000", "1700"],
        sat: ["0515"],
        sun: ["0000"],
        map: "http://www.somethinglovely.net/bdo/#worldbosses/karanda",
        loot: "https://bddatabase.net/us/npc/23060/",
        icon: "https://i.imgur.com/nSKVdLo.png"
      },
      kutum: {
        mon: ["0515", "2100"],
        tue: ["0700", "1400"],
        wed: ["0515"],
        thu: ["0000", "0700", "1400", "2100"],
        fri: ["1400"],
        sat: ["0315", "1400"],
        sun: ["0515", "1000"],
        map: "http://www.somethinglovely.net/bdo/#worldbosses/ancient-kutum",
        loot: "https://bddatabase.net/us/npc/23073/",
        icon: "https://i.imgur.com/YGN6g2V.png"
      },
      kzarka: {
        mon: ["0315", "1000", "1400"],
        tue: ["0315", "1000"],
        wed: ["0315", "2100"],
        thu: ["0315", "1000"],
        fri: ["0515"],
        sat: ["0000", "0315"],
        sun: ["0000", "0700", "1700"],
        map: "http://www.somethinglovely.net/bdo/#worldbosses/kzarka",
        loot: "https://bddatabase.net/us/npc/23001/",
        icon: "https://i.imgur.com/ybIuABn.png"
      },
      muraka: {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: ["2100"],
        sun: [],
        loot: "https://bddatabase.net/us/npc/23097/",
        map: "http://www.somethinglovely.net/bdo/#worldbosses/muraka"
      },
      nouver: {
        mon: ["0315", "1700"],
        tue: ["0000", "2100"],
        wed: ["0315", "1700"],
        thu: ["0515", "1700"],
        fri: ["0700", "2100"],
        sat: ["1000", "1700"],
        sun: ["0515", "1400"],
        map: "http://www.somethinglovely.net/bdo/#worldbosses/nouver",
        loot: "https://bddatabase.net/us/npc/23032/",
        icon: "https://i.imgur.com/8yAmL2t.png"
      },
      offin: {
        mon: [],
        tue: ["1700"],
        wed: [],
        thu: [],
        fri: ["0000"],
        sat: ["0700"],
        sun: [],
        map: "http://www.somethinglovely.net/bdo/#worldbosses/offin-tett",
        loot: "https://bddatabase.net/us/npc/23754/",
        icon: "https://i.imgur.com/ZBd1Ax5.png"
      },
      quint: {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: ["2100"],
        sun: [],
        loot: "https://bddatabase.net/us/npc/23102/",
        map: "http://www.somethinglovely.net/bdo/#worldbosses/quint"
      },
      vell: {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: ["2100"],
        loot: "https://bddatabase.net/us/npc/23080/",
        map: "http://www.somethinglovely.net/bdo/#worldbosses/vell"
      }
    };
    function createBossEmbed(name) {
      const embed = new Discord.RichEmbed();
      embed.setTitle("World Boss - Karanda - Spawn Times");
      embed.setDescription(
        "[Location](http://www.somethinglovely.net/bdo/#worldbosses/karanda) - [Loot](https://bddatabase.net/us/npc/23060/)"
      );
      embed.setThumbnail("https://i.imgur.com/nSKVdLo.png");
      embed.addField("Time Zone: ", "UTC", false);
      embed.addField("Monday: ", "00:00, 07:00", true);
      embed.addField("Tuesday: ", "05:15", true);
      embed.addField("Wednesday: ", "00:00, 07:00, 14:00", true);
      embed.addField("Thursday: ", "03:15", true);
      embed.addField("Friday: ", "03:15, 10:00, 17:00", true);
      embed.addField("Saturday: ", "05:15", true);
      embed.addField("Sunday: ", "00:00", true);
      return embed;
    }
    if (args.length > 0) {
      if (args[0].toLowerCase() === "all") {
        bossnames.forEach(bossname => {
          const embed = createClassEmbed(bossname);
          message.channel.send({ embed });
        });
      } else {
        args.forEach(arg => {
          if (classnames.includes(arg.toLowerCase())) {
            const embed = createClassEmbed(arg.toLowerCase());
            message.channel.send({ embed });
            message.channel.send(`${classes[arg.toLowerCase()].discord}`);
          } else {
            return message.channel.send(
              "You must specify one of the following classes: berserker, darkknight, kunoichi, lahn, maehwa, musa, mystic, ninja, ranger, sorceress, striker, tamer, valkyrie, warrior, witch, or wizard."
            );
          }
        });
      }
    } else {
      return message.channel.send(
        "You must specify one of the following classes: berserker, darkknight, kunoichi, lahn, maehwa, musa, mystic, ninja, ranger, sorceress, striker, tamer, valkyrie, warrior, witch, or wizard."
      );
    }
  }
};
