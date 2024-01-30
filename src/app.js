const discord = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

//settings
const settings = fs.readFileSync(path.join(__dirname, "settings.json"));

//intents
const intents = new discord.IntentsBitField([
  "Guilds",
  "GuildMessages",
  "MessageContent",
  "GuildMessageReactions",
]);

//Client
const client = new discord.Client({ intents });

//on ready
client.on("ready", () => {
  console.log(client.user.username + " is ready");
});

//poll slash command
client.on("interactionCreate", async (interaction) => {});

client.login(process.env.TOKEN);
