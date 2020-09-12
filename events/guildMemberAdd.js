/**
 * @file guildMemberAdd.js
 * @description EnvoyBot Discord Bot Guild Member Add Event.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
module.exports = (client, member) => {
  const guild = member.guild;
  guild.channels
    .find("name", "zone-de-transit")
    .send(`<@${member.user.id}> has joined the server!`);
};
