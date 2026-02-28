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
  );

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [command.toJSON()] }
    );

    console.log("Global command deployed.");
  } catch (err) {
    console.error(err);
  }
})();
