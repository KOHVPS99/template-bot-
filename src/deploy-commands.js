const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const command = new SlashCommandBuilder()
  .setName("template")
  .setDescription("Create a server template")

  .addStringOption(option =>
    option.setName("template")
      .setDescription("Choose a template")
      .setRequired(true)
      .setAutocomplete(true)
  )

  .addStringOption(option =>
    option.setName("channel_style")
      .setDescription("Channel naming style")
      .setRequired(true)
      .addChoices(
        { name: "Emoji Dot (📢・chat)", value: "emoji_dot" },
        { name: "Emoji Bar (📢┃chat)", value: "emoji_bar" },
        { name: "No Emoji", value: "plain" }
      )
  )

  .addStringOption(option =>
    option.setName("category_style")
      .setDescription("Category naming style")
      .setRequired(true)
      .addChoices(
        { name: "Stars (★・・🎮・・★)", value: "stars" },
        { name: "Dash (──── 🎮 Gaming ────)", value: "dash" },
        { name: "Plain", value: "plain" }
      )
  )

  .addIntegerOption(option =>
    option.setName("categories_count")
      .setDescription("Number of categories (max 20)")
      .setMinValue(1)
      .setMaxValue(20)
  )

  .addIntegerOption(option =>
    option.setName("channels_count")
      .setDescription("Total channels (max 100)")
      .setMinValue(1)
      .setMaxValue(100)
  )

  .addIntegerOption(option =>
    option.setName("roles_count")
      .setDescription("Number of roles (max 25)")
      .setMinValue(1)
      .setMaxValue(25)
  )

  .addBooleanOption(option =>
    option.setName("include_staff_category")
      .setDescription("Create staff-only category?")
  );

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Deploying commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        "1456645905850564723" // your server ID
      ),
      { body: [command.toJSON()] }
    );

    console.log("Guild commands deployed successfully.");
  } catch (error) {
    console.error(error);
  }
})();
