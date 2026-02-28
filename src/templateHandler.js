const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = async function(guild, template, includeStaff) {

  // CREATE ROLES
  const createdRoles = {};

  for (const role of template.roles) {
    const newRole = await guild.roles.create({
      name: role.name,
      color: role.color
    });
    createdRoles[role.name] = newRole;
  }

  // CREATE CATEGORIES + CHANNELS
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

  // OPTIONAL STAFF CATEGORY
  if (includeStaff) {

    const staffRole = createdRoles["👑 Owner"] || Object.values(createdRoles)[0];

    const staffCategory = await guild.channels.create({
      name: "🔒 staff",
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: staffRole.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    await guild.channels.create({
      name: "staff-chat",
      type: ChannelType.GuildText,
      parent: staffCategory.id
    });
  }
};
