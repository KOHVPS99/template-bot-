const { Client, GatewayIntentBits } = require("discord.js");
const { handleTemplate } = require("./templateHandler");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "template") {
    await handleTemplate(interaction);
  }
});

client.login(process.env.TOKEN);
