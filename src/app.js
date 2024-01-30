const discord = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

//intents
const intents = new discord.IntentsBitField([
  "Guilds",
  "GuildMessages",
  "MessageContent",
]);

//Client
const client = new discord.Client({ intents });

//on ready
client.on("ready", () => {
  console.log("Bot is ready");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "!ping") {
    message.reply("pong");
  }
});

client.login(process.env.TOKEN);
