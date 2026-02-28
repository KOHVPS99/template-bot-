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
  .addBooleanOption(option =>
    option.setName("include_staff")
      .setDescription("Create staff-only category?")
  );

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        "1456645905850564723"
      ),
      { body: [command.toJSON()] }
    );

    console.log("Command deployed.");
  } catch (err) {
    console.error(err);
  }
})();
