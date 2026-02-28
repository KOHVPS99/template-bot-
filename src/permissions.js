module.exports = function(interaction) {
  if (!interaction.member.permissions.has("Administrator")) {
    interaction.reply({
      content: "You must be an Administrator to use this.",
      ephemeral: true
    });
    return false;
  }
  return true;
};
