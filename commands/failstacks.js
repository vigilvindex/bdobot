/**
 * @file failstacks.js
 * @description BDOBot Discord Bot Failstack Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const Discord = require("discord.js");
module.exports = {
  name: "failstacks",
  description: "Failstack calculator.",
  args: true,
  usage: "<desired enhancement level> <current failstacks>",
  aliases: ["fs"],
  execute(message, args) {
    const failstacks = {
      armor: {
        1: {
          base: 100,
          increase: 0,
          name: "+1",
          max: 100,
          maxfs: 0
        },
        2: {
          base: 100,
          increase: 0,
          name: "+2",
          max: 100,
          maxfs: 0
        },
        3: {
          base: 100,
          increase: 0,
          name: "+3",
          max: 100,
          maxfs: 0
        },
        4: {
          base: 100,
          increase: 0,
          name: "+4",
          max: 0,
          maxfs: 0
        },
        5: {
          base: 100,
          increase: 0,
          name: "+5",
          max: 100,
          maxfs: 0
        },
        6: {
          base: 20,
          increase: 2.5,
          name: "+6",
          max: 52.5,
          maxfs: 13
        },
        7: {
          base: 17.5,
          increase: 2,
          name: "+7",
          max: 45.5,
          maxfs: 14
        },
        8: {
          base: 16.25,
          increase: 1.75,
          name: "+8",
          max: 40.75,
          maxfs: 14
        },
        9: {
          base: 15,
          increase: 1.5,
          name: "+9",
          max: 37.5,
          maxfs: 15
        },
        10: {
          base: 12.5,
          increase: 1.25,
          name: "+10",
          max: 32.5,
          maxfs: 16
        },
        11: {
          base: 11.25,
          increase: 1,
          name: "+11",
          max: 28.25,
          maxfs: 17
        },
        12: {
          base: 10,
          increase: 0.75,
          name: "+12",
          max: 23.5,
          maxfs: 18
        },
        13: {
          base: 7.5,
          increase: 0.63,
          name: "+13",
          max: 20.1,
          maxfs: 20
        },
        14: {
          base: 5,
          increase: 0.5,
          name: "+14",
          max: 17.5,
          maxfs: 25
        },
        15: {
          base: 2.5,
          increase: 0.5,
          name: "+15",
          max: 15,
          maxfs: 25
        },
        16: {
          base: 15,
          increase: 1.5,
          name: "+16 (PRI)",
          max: 52.5,
          maxfs: 25
        },
        17: {
          base: 7.5,
          increase: 0.75,
          name: "+17 (DUO)",
          max: 33.75,
          maxfs: 35
        },
        18: {
          base: 5,
          increase: 0.5,
          name: "+18 (TRI)",
          max: 27,
          maxfs: 44
        },
        19: {
          base: 2,
          increase: 0.25,
          name: "+19 (TET)",
          max: 25,
          maxfs: 90
        },
        20: {
          base: 1.5,
          increase: 0.25,
          name: "+20 (PEN)",
          max: 20.1,
          maxfs: 124
        }
      },
      weapon: {
        1: {
          base: 100,
          increase: 0,
          name: "+1",
          max: 100,
          maxfs: 0
        },
        2: {
          base: 100,
          increase: 0,
          name: "+2",
          max: 100,
          maxfs: 0
        },
        3: {
          base: 100,
          increase: 0,
          name: "+3",
          max: 100,
          maxfs: 0
        },
        4: {
          base: 100,
          increase: 0,
          name: "+4",
          max: 0,
          maxfs: 0
        },
        5: {
          base: 100,
          increase: 0,
          name: "+5",
          max: 100,
          maxfs: 0
        },
        6: {
          base: 100,
          increase: 0,
          name: "+6",
          max: 100,
          maxfs: 0
        },
        7: {
          base: 100,
          increase: 0,
          name: "+7",
          max: 100,
          maxfs: 0
        },
        8: {
          base: 20,
          increase: 2.5,
          name: "+8",
          max: 52.5,
          maxfs: 13
        },
        9: {
          base: 17.5,
          increase: 2,
          name: "+9",
          max: 45.5,
          maxfs: 14
        },
        10: {
          base: 15,
          increase: 1.5,
          name: "+10",
          max: 37.5,
          maxfs: 15
        },
        11: {
          base: 12.5,
          increase: 1.25,
          name: "+11",
          max: 32.5,
          maxfs: 16
        },
        12: {
          base: 10,
          increase: 0.75,
          name: "+12",
          max: 23.5,
          maxfs: 18
        },
        13: {
          base: 7.5,
          increase: 0.63,
          name: "+13",
          max: 20.1,
          maxfs: 20
        },
        14: {
          base: 5,
          increase: 0.5,
          name: "+14",
          max: 17.5,
          maxfs: 25
        },
        15: {
          base: 2.5,
          increase: 0.5,
          name: "+15",
          max: 15,
          maxfs: 25
        },
        16: {
          base: 15,
          increase: 1.5,
          name: "+16 (PRI)",
          max: 52.5,
          maxfs: 25
        },
        17: {
          base: 7.5,
          increase: 0.75,
          name: "+17 (DUO)",
          max: 33.75,
          maxfs: 35
        },
        18: {
          base: 5,
          increase: 0.5,
          name: "+18 (TRI)",
          max: 27,
          maxfs: 44
        },
        19: {
          base: 2,
          increase: 0.25,
          name: "+19 (TET)",
          max: 25,
          maxfs: 90
        },
        20: {
          base: 1.5,
          increase: 0.25,
          name: "+20 (PEN)",
          max: 20.1,
          maxfs: 124
        }
      },
      accessory: {
        1: {
          base: 15,
          increase: 1.5,
          name: "PRI",
          max: 52.5,
          maxfs: 25
        },
        2: {
          base: 7.5,
          increase: 0.75,
          name: "DUO",
          max: 33.75,
          maxfs: 35
        },
        3: {
          base: 5,
          increase: 0.5,
          name: "TRI",
          max: 27,
          maxfs: 44
        },
        4: {
          base: 2,
          increase: 0.25,
          name: "TET",
          max: 24.5,
          maxfs: 90
        },
        5: {
          base: 1.5,
          increase: 0.25,
          name: "PEN",
          max: 32.5,
          maxfs: 124
        }
      }
    };
    if (!args.length) {
      return message.reply("You didn't provide any arguments!");
    } else if (
      args[0].toLowerCase() === "help" ||
      args[0].toLowerCase() === "h"
    ) {
      return message.reply(`This command can be used in the following ways:\n
            \t\t• \`!failstacks help\` - Shows this help message.\n
            \t\t• \`!failstacks 15 15\` - Calculates failstacks and chance. First number is the desired enhancement level. Second number is the current number of failstacks.\n
            \t\t Aliases:\n
            \t\t• \`!fs h\` - Shows this help message.\n
            \t\t• \`!fs 15 15\` - Calculates failstacks and chance. First number is the desired enhancement level. Second number is the current number of failstacks.\n\u200b`);
    } else if (args.length > 2 || args.length < 2) {
      return message.reply("You provided too many or too few arguments!");
    } else if (isNaN(args[0]) || isNaN(args[1])) {
      return message.reply("You didn't provide numbers as arguments!");
    } else if (args[0] > 20 || args[0] < 1) {
      return message.reply("You provided an incorrect enhancement level!");
    }
    let accessories = false;
    if (args[0] < 6) {
      accessories = true;
    }
    let armorchance = 0;
    if (
      failstacks.armor[args[0]].base +
        args[1] * failstacks.armor[args[0]].increase >
      failstacks.armor[args[0]].max
    ) {
      armorchance = failstacks.armor[args[0]].max;
    } else {
      armorchance =
        failstacks.armor[args[0]].base +
        args[1] * failstacks.armor[args[0]].increase;
    }
    let weaponchance = 0;
    if (
      failstacks.weapon[args[0]].base +
        args[1] * failstacks.weapon[args[0]].increase >
      failstacks.weapon[args[0]].max
    ) {
      weaponchance = failstacks.weapon[args[0]].max;
    } else {
      weaponchance =
        failstacks.weapon[args[0]].base +
        args[1] * failstacks.weapon[args[0]].increase;
    }
    const newembed = new Discord.RichEmbed();
    newembed.setTitle("BDOBot Failstack Calculator");
    newembed.setDescription(
      "[Source Data](https://docs.google.com/spreadsheets/d/1TzZuq8QUXTW-Cpn8VvmCdJbs2duM9cbhP-XTKVxxYoQ/)"
    );
    newembed.addField(
      "🛡️ Armor:",
      `**Enhance:** ${failstacks.armor[args[0]].name}\n**Base Chance:** ${
        failstacks.armor[args[0]].base
      }%\n**Increase Per FS:** ${
        failstacks.armor[args[0]].increase
      }%\n**Max Chance:** ${failstacks.armor[args[0]].max}%\n**Max FS:** ${
        failstacks.armor[args[0]].maxfs
      }\n**Current FS:** ${args[1]}\n**Current Chance:** ${armorchance}%`,
      true
    );
    newembed.addField(
      "⚔️ Weapon:",
      `**Enhance:** ${failstacks.weapon[args[0]].name}\n**Base Chance:** ${
        failstacks.weapon[args[0]].base
      }%\n**Increase Per FS:** ${
        failstacks.weapon[args[0]].increase
      }%\n**Max Chance:** ${failstacks.weapon[args[0]].max}%\n**Max FS:** ${
        failstacks.weapon[args[0]].maxfs
      }\n**Current FS:** ${args[1]}\n**Current Chance:** ${weaponchance}%`,
      true
    );
    if (accessories) {
      let accessorychance = 0;
      if (
        failstacks.accessory[args[0]].base +
          args[1] * failstacks.accessory[args[0]].increase >
        failstacks.accessory[args[0]].max
      ) {
        accessorychance = failstacks.accessory[args[0]].max;
      } else {
        accessorychance =
          failstacks.accessory[args[0]].base +
          args[1] * failstacks.accessory[args[0]].increase;
      }
      newembed.addField(
        "💍 Accessory:",
        `**Enhance:** ${failstacks.accessory[args[0]].name}\n**Base Chance:** ${
          failstacks.accessory[args[0]].base
        }%\n**Increase Per FS:** ${
          failstacks.accessory[args[0]].increase
        }%\n**Max Chance:** ${
          failstacks.accessory[args[0]].max
        }%\n**Max FS:** ${
          failstacks.accessory[args[0]].maxfs
        }\n**Current FS:** ${args[1]}\n**Current Chance:** ${accessorychance}%`,
        true
      );
    }
    return message.channel.send(newembed);
  }
};
