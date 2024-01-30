require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");
const settings = fs.readFileSync("./settings.json");

const commands = [
  {
    name: "poll",
    description: "Start a poll",
    options: [
      {
        name: "title",
        description: "Title of the poll",
        required: true,
        type: String,
      },
      {
        name: "origin",
        description: "Who sent this question",
        required: true,
        type: ApplicationCommandOptionType.Mentionable,
      },
      {
        name: "question",
        description: "What is the question",
        required: true,
        type: String,
      },
      {
        name: "options",
        description:
          "first char should be emoji, options should be separated by | or ,",
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );
    console.log("Slash commands registered");
  } catch (error) {
    console.log(`There was an error : ${error}`);
  }
})();
