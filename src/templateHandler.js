const { ChannelType } = require("discord.js");

module.exports = async function(guild, template) {

  for (const role of template.roles) {
    await guild.roles.create({
      name: role.name,
      color: role.color
    });
  }

  for (const cat of template.categories) {

    const category = await guild.channels.create({
      name: `${template.categoryEmoji} ${cat.name}`,
      type: ChannelType.GuildCategory
    });

    for (const channelName of cat.channels) {
      await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: category.id
      });
    }
  }
};
