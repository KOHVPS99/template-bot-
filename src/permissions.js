const { PermissionsBitField } = require("discord.js");

function checkUser(interaction) {
  if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return "You need Manage Server permission.";
  }
  return null;
}

function checkBot(guild) {
  const me = guild.members.me;
  if (!me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return "I need Manage Channels permission.";
  }
  return null;
}

module.exports = { checkUser, checkBot };
