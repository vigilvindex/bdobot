/**
 * @file class.js
 * @description BDOBot Discord Bot Class Command.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = {
  name: "class",
  description:
    "Returns class specific links to forums, discord servers, and skills.",
  args: true,
  usage:
    "all, berserker, darkknight, kunoichi, lahn, maehwa, musa, mystic, ninja, ranger, sorceress, striker, tamer, valkyrie, warrior, witch, or wizard",
  aliases: ["c"],
  execute(message, args) {
    const classnames = [
      "berserker",
      "darkknight",
      "kunoichi",
      "lahn",
      "maehwa",
      "musa",
      "mystic",
      "ninja",
      "ranger",
      "sorceress",
      "striker",
      "tamer",
      "valkyrie",
      "warrior",
      "witch",
      "wizard"
    ];
    const classes = {
      berserker: {
        icon: "https://i.imgur.com/0LeMmMv.png",
        discord: "https://discord.gg/83Ny223",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/berserker.21/",
        skills: "https://bdocodex.com/us/skills/giant/"
      },
      darkknight: {
        icon: "https://i.imgur.com/0CWpbpO.png",
        discord: "http://discord.gg/nF6xb3g",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/dark-knight.170/",
        skills: "https://bdocodex.com/us/skills/darkelf/"
      },
      kunoichi: {
        icon: "https://i.imgur.com/SV2VvyR.png",
        discord: "https://discord.gg/VSuuF5g",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/kunoichi.28/",
        skills: "https://bdocodex.com/us/skills/kunoichi/"
      },
      lahn: {
        icon: "https://i.imgur.com/lsSNOrl.png",
        discord: "https://discord.gg/nRBXMtW",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/lahn.370/",
        skills: "https://bdocodex.com/us/skills/lahn/"
      },
      maehwa: {
        icon: "https://i.imgur.com/p3y32Bc.png",
        discord: "https://discord.gg/6ThcWqx",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/maehwa.24/",
        skills: "https://bdocodex.com/us/skills/blademasterwomen/"
      },
      musa: {
        icon: "https://i.imgur.com/BxVPcnC.png",
        discord: "https://discord.gg/6ThcWqx",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/musa.23/",
        skills: "https://bdocodex.com/us/skills/blademaster/"
      },
      mystic: {
        icon: "https://i.imgur.com/mWtv1xL.png",
        discord: "https://discord.gg/fRWVwRD",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/mystic.260/",
        skills: "https://bdocodex.com/us/skills/mystic/"
      },
      ninja: {
        icon: "https://i.imgur.com/ITbR1ZM.png",
        discord: "https://discord.gg/VSuuF5g",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/ninja.27/",
        skills: "https://bdocodex.com/us/skills/ninja/"
      },
      ranger: {
        icon: "https://i.imgur.com/DUpRzyx.png",
        discord: "https://discord.gg/HjXSfkf",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/ranger.19/",
        skills: "https://bdocodex.com/us/skills/ranger/"
      },
      sorceress: {
        icon: "https://i.imgur.com/i2KSkNd.png",
        discord: "https://discord.gg/GWz9SNd",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/sorceress.20/",
        skills: "https://bdocodex.com/us/skills/sorcerer/"
      },
      striker: {
        icon: "https://i.imgur.com/wor3UbP.png",
        discord: "https://discord.gg/fRWVwRD",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/striker.241/",
        skills: "https://bdocodex.com/us/skills/striker/"
      },
      tamer: {
        icon: "https://i.imgur.com/uS4BUZB.png",
        discord: "https://discord.gg/zn6puC6",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/tamer.22/",
        skills: "https://bdocodex.com/us/skills/tamer/"
      },
      valkyrie: {
        icon: "https://i.imgur.com/A4EhWvC.png",
        discord: "https://discord.gg/XrzrZzn",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/valkyrie.25/",
        skills: "https://bdocodex.com/us/skills/valkyrie/"
      },
      warrior: {
        icon: "https://i.imgur.com/0F1cqGy.png",
        discord: "https://discord.gg/6s3ZBRN",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/warrior.18/",
        skills: "https://bdocodex.com/us/skills/warrior/"
      },
      witch: {
        icon: "https://i.imgur.com/gsKgeIW.png",
        discord: "https://discord.gg/tsSvKsG",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/witch-wizard.26/",
        skills: "https://bdocodex.com/us/skills/wizardwomen/"
      },
      wizard: {
        icon: "https://i.imgur.com/oWPRUlo.png",
        discord: "https://discord.gg/tsSvKsG",
        forum:
          "https://community.blackdesertonline.com/index.php?forums/witch-wizard.26/",
        skills: "https://bdocodex.com/us/skills/wizard/"
      }
    };
    function createClassEmbed(name) {
      let prettyname = name.charAt(0).toUpperCase() + name.substr(1);
      if (prettyname === "Darkknight") {
        prettyname = "Dark Knight";
      }
      const embed = {
        title: `${prettyname} Links :`,
        thumbnail: {
          url: classes[name].icon
        },
        fields: [
          {
            name: "Discord",
            value: classes[name].discord
          },
          {
            name: "Forums",
            value: classes[name].forum
          },
          {
            name: "Skills",
            value: classes[name].skills
          }
        ]
      };
      return embed;
    }
    if (args.length > 0) {
      if (args[0].toLowerCase() === "all") {
        classnames.forEach(classname => {
          const embed = createClassEmbed(classname);
          message.channel.send({ embed });
          message.channel.send(`${classes[classname].discord}`);
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
