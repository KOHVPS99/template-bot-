const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const command = new SlashCommandBuilder()
  .setName("template")
  .setDescription("Create a server template")

  // TEMPLATE
  .addStringOption(option =>
    option.setName("template")
      .setDescription("Choose template")
      .setRequired(true)
      .setAutocomplete(true)
  )

  // CHANNEL STYLE
  .addStringOption(option =>
    option.setName("channel_style")
      .setDescription("Channel naming style")
      .addChoices(
        { name: "Emoji Dot (📢・chat)", value: "emoji_dot" },
        { name: "Emoji Bar (📢┃chat)", value: "emoji_bar" },
        { name: "No Emoji", value: "plain" }
      )
  )

  // CATEGORY STYLE
  .addStringOption(option =>
    option.setName("category_style")
      .setDescription("Category naming style")
      .addChoices(
        { name: "Stars (★・・🎮・・★)", value: "stars" },
        { name: "Dash (──── 🎮 Gaming ────)", value: "dash" },
        { name: "Plain", value: "plain" }
      )
  )

  // CATEGORY COUNT
  .addIntegerOption(option =>
    option.setName("categories_count")
      .setDescription("Number of categories (max 20)")
      .setMinValue(1)
      .setMaxValue(20)
  )

  // CHANNEL COUNT
  .addIntegerOption(option =>
    option.setName("channels_count")
      .setDescription("Number of channels (max 100)")
      .setMinValue(1)
      .setMaxValue(100)
  )

  // ROLES COUNT
  .addIntegerOption(option =>
    option.setName("roles_count")
      .setDescription("Number of roles (max 25)")
      .setMinValue(1)
      .setMaxValue(25)
  )

  // STAFF CATEGORY
  .addBooleanOption(option =>
    option.setName("include_staff")
      .setDescription("Create staff-only category?")
  );

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), // GLOBAL
      { body: [command.toJSON()] }
    );

    console.log("Global command deployed.");
  } catch (err) {
    console.error(err);
  }
})();
