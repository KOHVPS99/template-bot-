const { ChannelType, PermissionsBitField } = require("discord.js");
const limits = require("./limits");

const categoryEmojis = ["🎮","💬","🚀","📈","🎵","🧠","🏆","🌍"];
const channelEmojis = ["📢","💬","🔥","🎮","📸","🧠","🚀","🎧","💎","📊"];

module.exports = async function (guild, template, options) {

  let {
    channelStyle,
    categoryStyle,
    categoriesCount,
    channelsCount,
    rolesCount,
    includeStaff
  } = options;

  // =====================
  // APPLY LIMITS
  // =====================

  rolesCount = Math.min(rolesCount || template.roles.length, limits.MAX_ROLES);
  categoriesCount = Math.min(categoriesCount || 5, limits.MAX_CATEGORIES);
  channelsCount = Math.min(channelsCount || 20, limits.MAX_CHANNELS);

  if (categoriesCount < limits.MIN_CATEGORIES)
    categoriesCount = limits.MIN_CATEGORIES;

  if (channelsCount < limits.MIN_CHANNELS)
    channelsCount = limits.MIN_CHANNELS;

  // =====================
  // CREATE ROLES
  // =====================

  const createdRoles = [];

  for (let i = 0; i < rolesCount; i++) {

    const roleName = template.roles[i]
      ? template.roles[i].name
      : `Member-${i + 1}`;

    const roleColor = template.roles[i]
      ? template.roles[i].color
      : "#3498db";

    const newRole = await guild.roles.create({
      name: roleName,
      color: roleColor
    });

    createdRoles.push(newRole);
  }

  // =====================
  // CREATE CATEGORIES + CHANNELS
  // =====================

  const channelsPerCategory = Math.floor(channelsCount / categoriesCount);
  const remainder = channelsCount % categoriesCount;

  let channelCounter = 0;

  for (let i = 0; i < categoriesCount; i++) {

    let baseName = template.categories[i]
      ? template.categories[i].name
      : `section-${i + 1}`;

    const catEmoji = categoryEmojis[i % categoryEmojis.length];

    let categoryName = baseName;

    if (categoryStyle === "stars")
      categoryName = `★・・${catEmoji} ${baseName}・・★`;

    if (categoryStyle === "dash")
      categoryName = `──── ${catEmoji} ${baseName} ────`;

    if (categoryStyle === "plain")
      categoryName = baseName;

    const category = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory
    });

    let amount = channelsPerCategory;
    if (i < remainder) amount++;

    for (let j = 0; j < amount; j++) {

      const channelEmoji = channelEmojis[channelCounter % channelEmojis.length];

      let baseChannel = template.categories[i] &&
        template.categories[i].channels[j]
        ? template.categories[i].channels[j]
        : `chat-${channelCounter + 1}`;

      let finalName = baseChannel;

      if (channelStyle === "emoji_dot")
        finalName = `${channelEmoji}・${baseChannel}`;

      if (channelStyle === "emoji_bar")
        finalName = `${channelEmoji}┃${baseChannel}`;

      if (channelStyle === "plain")
        finalName = baseChannel;

      await guild.channels.create({
        name: finalName,
        type: ChannelType.GuildText,
        parent: category.id
      });

      channelCounter++;
    }
  }

  // =====================
  // STAFF SECTION
  // =====================

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
