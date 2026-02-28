const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const templates = require("./data/templates.json");
const templateHandler = require("./templateHandler");
const cooldown = require("./cooldown");
const checkPermissions = require("./permissions");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {

  try {

    // =========================
    // AUTOCOMPLETE HANDLER
    // =========================
    if (interaction.isAutocomplete()) {

      const focused = interaction.options.getFocused() || "";
      const templateNames = Object.keys(templates);

      const filtered = templateNames
        .filter(name =>
          name.toLowerCase().includes(focused.toLowerCase())
        )
        .slice(0, 25);

      await interaction.respond(
        filtered.map(name => ({
          name: name,
          value: name
        }))
      );

      return;
    }

    // =========================
    // SLASH COMMAND HANDLER
    // =========================
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "template") return;

    // PERMISSION CHECK
    if (!checkPermissions(interaction)) return;

    // COOLDOWN CHECK
    if (!cooldown(interaction.user.id)) {
      return interaction.reply({
        content: "Please wait before using this command again.",
        ephemeral: true
      });
    }

    // READ OPTIONS
    const templateName = interaction.options.getString("template");
    const channelStyle = interaction.options.getString("channel_style") || "plain";
    const categoryStyle = interaction.options.getString("category_style") || "plain";
    const categoriesCount = interaction.options.getInteger("categories_count");
    const channelsCount = interaction.options.getInteger("channels_count");
    const rolesCount = interaction.options.getInteger("roles_count");
    const includeStaff = interaction.options.getBoolean("include_staff");

    const template = templates[templateName];

    if (!template) {
      return interaction.reply({
        content: "Template not found.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `Building **${templateName}**...`,
      ephemeral: true
    });

    await templateHandler(
      interaction.guild,
      template,
      {
        channelStyle,
        categoryStyle,
        categoriesCount,
        channelsCount,
        rolesCount,
        includeStaff
      }
    );

    await interaction.followUp({
      content: "Server structure created successfully.",
      ephemeral: true
    });

  } catch (err) {
    console.error("INTERACTION ERROR:", err);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "An error occurred while building the server.",
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: "An error occurred.",
        ephemeral: true
      });
    }
  }

});

client.login(process.env.TOKEN);
