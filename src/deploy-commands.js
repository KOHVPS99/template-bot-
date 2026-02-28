const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const command = new SlashCommandBuilder()
  .setName("template")
  .setDescription("Create a server template")
  .addStringOption(option =>
    option.setName("template")
      .setDescription("Template name")
      .setRequired(true)
      .addChoices(
        { name: "gaming", value: "gaming" }
      ))
  .addStringOption(option =>
    option.setName("channel_style")
      .setDescription("Channel style")
      .setRequired(true)
      .addChoices(
        { name: "Emoji Dot", value: "emoji_dot" },
        { name: "Emoji Bar", value: "emoji_bar" }
      ))
  .addStringOption(option =>
    option.setName("category_style")
      .setDescription("Category style")
      .setRequired(true)
      .addChoices(
        { name: "Stars", value: "stars_mid" },
        { name: "Dash", value: "dash_style" }
      ))
  .addBooleanOption(option =>
    option.setName("use_emojis")
      .setDescription("Use emojis?")
      .setRequired(true)
  );

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Deploying commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        "1456645905850564723"
      ),
      { body: [command.toJSON()] }
    );

    console.log("Guild commands deployed.");
  } catch (error) {
    console.error(error);
  }
})();
