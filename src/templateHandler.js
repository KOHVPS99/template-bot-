const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = async function (guild, template, options) {

  const {
    channelStyle,
    categoryStyle,
    categoriesCount,
    channelsCount,
    rolesCount,
    includeStaff
  } = options;

  // LIMIT ROLES
  const rolesToCreate = rolesCount
    ? template.roles.slice(0, rolesCount)
    : template.roles;

  const createdRoles = {};

  for (const role of rolesToCreate) {
    const newRole = await guild.roles.create({
      name: role.name,
      color: role.color
    });
    createdRoles[role.name] = newRole;
  }

  // LIMIT CATEGORIES
  const categoriesToCreate = categoriesCount
    ? template.categories.slice(0, categoriesCount)
    : template.categories;

  let totalChannelsCreated = 0;

  for (const cat of categoriesToCreate) {

    let categoryName = cat.name;

    // CATEGORY STYLE
    if (categoryStyle === "stars")
      categoryName = `★・・${template.categoryEmoji} ${cat.name}・・★`;

    if (categoryStyle === "dash")
      categoryName = `──── ${template.categoryEmoji} ${cat.name} ────`;

    const category = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory
    });

    for (const channelName of cat.channels) {

      if (channelsCount && totalChannelsCreated >= channelsCount)
        break;

      let finalChannelName = channelName;

      // CHANNEL STYLE
      if (channelStyle === "emoji_dot")
        finalChannelName = `📢・${channelName}`;

      if (channelStyle === "emoji_bar")
        finalChannelName = `📢┃${channelName}`;

      await guild.channels.create({
        name: finalChannelName,
        type: ChannelType.GuildText,
        parent: category.id
      });

      totalChannelsCreated++;
    }
  }

  // STAFF CATEGORY
  if (includeStaff) {

    const staffRole = Object.values(createdRoles)[0];

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
