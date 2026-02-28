const { ChannelType, PermissionsBitField } = require("discord.js");
const limits = require("./limits");

module.exports = async function (guild, template, options) {

  let {
    channelStyle,
    categoryStyle,
    categoriesCount,
    channelsCount,
    rolesCount,
    includeStaff
  } = options;

  // ============================
  // APPLY LIMITS
  // ============================

  rolesCount = Math.min(
    rolesCount || template.roles.length,
    limits.MAX_ROLES
  );

  categoriesCount = Math.min(
    categoriesCount || template.categories.length,
    limits.MAX_CATEGORIES
  );

  channelsCount = Math.min(
    channelsCount || limits.MIN_CHANNELS,
    limits.MAX_CHANNELS
  );

  if (categoriesCount < limits.MIN_CATEGORIES)
    categoriesCount = limits.MIN_CATEGORIES;

  if (channelsCount < limits.MIN_CHANNELS)
    channelsCount = limits.MIN_CHANNELS;

  // ============================
  // CREATE ROLES (MAX 10)
  // ============================

  const baseRoles = template.roles || [];
  const createdRoles = [];

  for (let i = 0; i < rolesCount; i++) {

    const roleName =
      baseRoles[i] ? baseRoles[i].name : `Member-${i + 1}`;

    const roleColor =
      baseRoles[i] ? baseRoles[i].color : "#3498db";

    const newRole = await guild.roles.create({
      name: roleName,
      color: roleColor
    });

    createdRoles.push(newRole);
  }

  // ============================
  // PREPARE CATEGORIES
  // ============================

  const baseCategories = template.categories || [];
  const categories = [];

  for (let i = 0; i < categoriesCount; i++) {

    const base = baseCategories[i % baseCategories.length] || {
      name: `section-${i + 1}`,
      channels: ["chat"]
    };

    categories.push({
      name: base.name,
      channels: base.channels
    });
  }

  // ============================
  // CHANNEL DISTRIBUTION
  // ============================

  const channelsPerCategory = Math.floor(
    channelsCount / categoriesCount
  );

  const extraChannels = channelsCount % categoriesCount;

  for (let i = 0; i < categories.length; i++) {

    let categoryName = categories[i].name;

    if (categoryStyle === "stars")
      categoryName = `★・・${template.categoryEmoji} ${categoryName}・・★`;

    if (categoryStyle === "dash")
      categoryName = `──── ${template.categoryEmoji} ${categoryName} ────`;

    const category = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory
    });

    let channelAmount = channelsPerCategory;
    if (i < extraChannels) channelAmount++;

    for (let j = 0; j < channelAmount; j++) {

      const baseChannel =
        categories[i].channels[
          j % categories[i].channels.length
        ];

      let finalName = baseChannel;

      if (channelStyle === "emoji_dot")
        finalName = `📢・${baseChannel}-${j + 1}`;

      if (channelStyle === "emoji_bar")
        finalName = `📢┃${baseChannel}-${j + 1}`;

      await guild.channels.create({
        name: finalName,
        type: ChannelType.GuildText,
        parent: category.id
      });
    }
  }

  // ============================
  // STAFF CATEGORY
  // ============================

  if (includeStaff && createdRoles.length > 0) {

    const staffCategory = await guild.channels.create({
      name: "🔒 staff",
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: createdRoles[0].id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    await guild.channels.create({
      name: "🔒┃staff-chat",
      type: ChannelType.GuildText,
      parent: staffCategory.id
    });
  }

};
