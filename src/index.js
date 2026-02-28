const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const templates = require("./data/templates.json");
const templateHandler = require("./templateHandler");
const cooldown = require("./cooldown");
const permissions = require("./permissions");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {

  if (interaction.isAutocomplete()) {
    const focused = interaction.options.getFocused();
    const templateNames = Object.keys(templates);

    const filtered = templateNames
      .filter(name => name.startsWith(focused))
      .slice(0, 25);

    await interaction.respond(
      filtered.map(name => ({ name, value: name }))
    );
    return;
  }

  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "template") return;

  if (!permissions(interaction)) return;

  if (!cooldown(interaction.user.id)) {
    return interaction.reply({
      content: "Slow down. Try again in a few seconds.",
      ephemeral: true
    });
  }

  const templateName = interaction.options.getString("template");
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

  await templateHandler(interaction.guild, template);

  await interaction.followUp({
    content: "Server built successfully.",
    ephemeral: true
  });

});

client.login(process.env.TOKEN);
