const {
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const templates = require("./data/templates.json");
const { MAX_CATEGORIES, MAX_CHANNELS, MAX_ROLES } = require("./limits");
const { getRemainingMs, setCooldown } = require("./cooldown");
const { checkUser, checkBot } = require("./permissions");
const { formatChannel, formatCategory, formatRole } = require("./formatters");

async function handleTemplate(interaction) {

  const userCheck = checkUser(interaction);
  if (userCheck) return interaction.reply({ content: userCheck, ephemeral: true });

  const botCheck = checkBot(interaction.guild);
  if (botCheck) return interaction.reply({ content: botCheck, ephemeral: true });

  const remaining = getRemainingMs(interaction.guild.id);
  if (remaining > 0) {
    return interaction.reply({ content: `Cooldown active. Try later.`, ephemeral: true });
  }

  const templateName = interaction.options.getString("template");
  const channelStyle = interaction.options.getString("channel_style");
  const categoryStyle = interaction.options.getString("category_style");
  const useEmojis = interaction.options.getBoolean("use_emojis");

  const template = templates[templateName];
  if (!template) return interaction.reply({ content: "Template not found.", ephemeral: true });

  await interaction.reply({ content: "Building server...", ephemeral: true });

  let channelCount = 0;
  let categoryCount = 0;

  for (const cat of template.categories.slice(0, MAX_CATEGORIES)) {
    if (categoryCount >= MAX_CATEGORIES) break;

    const category = await interaction.guild.channels.create({
      name: formatCategory(cat.name, cat.emoji, categoryStyle, useEmojis),
      type: ChannelType.GuildCategory
    });

    categoryCount++;

    for (const ch of cat.channels) {
      if (channelCount >= MAX_CHANNELS) break;

      const channelName = formatChannel(ch.name, ch.emoji, channelStyle, useEmojis);

      const created = await interaction.guild.channels.create({
        name: channelName,
        type: ch.type === "voice" ? ChannelType.GuildVoice : ChannelType.GuildText,
        parent: category.id
      });

      if (ch.locked && ch.type === "text") {
        await created.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: false
        });
      }

      channelCount++;
    }
  }

  // Roles
  let roleCount = 0;
  for (const role of template.roles.slice(0, MAX_ROLES)) {
    const roleName = formatRole(role.name, role.emoji, "emoji_bar", useEmojis);

    await interaction.guild.roles.create({
      name: roleName,
      color: role.color,
      permissions: []
    });

    roleCount++;
  }

  // Staff Category
  const staffCategory = await interaction.guild.channels.create({
    name: useEmojis ? "★・・🛡・・★" : "★・・Staff・・★",
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [PermissionsBitField.Flags.ViewChannel]
      }
    ]
  });

  await interaction.guild.channels.create({
    name: useEmojis ? "🛡┃staff-chat" : "staff-chat",
    type: ChannelType.GuildText,
    parent: staffCategory.id
  });

  await interaction.followUp({ content: "Template created successfully.", ephemeral: true });

  setCooldown(interaction.guild.id);
}

module.exports = { handleTemplate };
