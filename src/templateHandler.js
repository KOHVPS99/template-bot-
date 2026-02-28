const { ChannelType, PermissionsBitField } = require("discord.js");

const channelEmojiPool = ["📢","💬","🔥","🎮","📸","🧠","🚀","🎧","💎","📊","🎬","⚡","🌍","📚","🏆"];
const categoryEmojiPool = ["🎮","💬","🚀","📈","🎵","🧠","🏆","🌍","📚","⚙️","🎬","🔥","💎","📊","🎧"];

module.exports = async function (guild, template, options) {

  const {
    channelStyle,
    categoryStyle,
    categoriesCount,
    channelsCount,
    rolesCount,
    includeStaff
  } = options;

  // ================================
  // ROLES
  // ================================

  const baseRoles = template.roles || [];
  const roles = [...baseRoles];

  while (rolesCount && roles.length < rolesCount) {
    roles.push({
      name: `✨ Role-${roles.length + 1}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    });
  }

  const createdRoles = {};

  for (const role of roles.slice(0, rolesCount || roles.length)) {
    const newRole = await guild.roles.create({
      name: role.name,
      color: role.color || "#3498db"
    });

    createdRoles[role.name] = newRole;
  }

  // ================================
  // CATEGORIES
  // ================================

  const baseCategories = template.categories || [];
  let categories = [...baseCategories];

  if (categories.length === 0) {
    categories = [{ name: "general", channels: ["chat"] }];
  }

  while (categoriesCount && categories.length < categoriesCount) {
    const base = baseCategories[categories.length % baseCategories.length] || {
      name: `category-${categories.length + 1}`,
      channels: ["chat"]
    };

    categories.push({
      name: `${base.name}-${categories.length + 1}`,
      channels: [...base.channels]
    });
  }

  categories = categories.slice(0, categoriesCount || categories.length);

  let totalChannelsCreated = 0;

  for (let i = 0; i < categories.length; i++) {

    const cat = categories[i];

    const catEmoji = categoryEmojiPool[i % categoryEmojiPool.length];

    let categoryName = cat.name;

    if (categoryStyle === "stars")
      categoryName = `★・・${catEmoji} ${cat.name}・・★`;

    if (categoryStyle === "dash")
      categoryName = `──── ${catEmoji} ${cat.name} ────`;

    if (categoryStyle === "emoji")
      categoryName = `${catEmoji} ${cat.name}`;

    const category = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory
    });

    let channels = [...cat.channels];

    while (channelsCount && channels.length < channelsCount) {
      channels.push(`extra-${channels.length + 1}`);
    }

    for (let j = 0; j < channels.length; j++) {

      if (channelsCount && totalChannelsCreated >= channelsCount)
        break;

      const channelEmoji = channelEmojiPool[totalChannelsCreated % channelEmojiPool.length];

      let finalChannelName = channels[j];

      if (channelStyle === "emoji_dot")
        finalChannelName = `${channelEmoji}・${channels[j]}`;

      if (channelStyle === "emoji_bar")
        finalChannelName = `${channelEmoji}┃${channels[j]}`;

      if (channelStyle === "emoji")
        finalChannelName = `${channelEmoji} ${channels[j]}`;

      await guild.channels.create({
        name: finalChannelName,
        type: ChannelType.GuildText,
        parent: category.id
      });

      totalChannelsCreated++;
    }
  }

  // ================================
  // STAFF SECTION
  // ================================

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
      name: "🔒┃staff-chat",
      type: ChannelType.GuildText,
      parent: staffCategory.id
    });
  }

};
