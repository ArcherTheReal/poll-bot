require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");
const { type } = require("os");
const settings = JSON.parse(fs.readFileSync("src/settings.json", "utf8"));

const commands = [
  {
    name: "poll",
    description: "Suggest a poll",
    options: [
      {
        name: "question",
        type: 3,
        description: "What is the question",
        required: true,
      },
      {
        name: "emoji-1",
        type: 3,
        description: "emoji-1",
        required: true,
      },
      {
        name: "option-1",
        type: 3,
        description: "option-1",
        required: true,
      },
      {
        name: "emoji-2",
        type: 3,
        description: "emoji-2",
        required: false,
      },
      {
        name: "option-2",
        type: 3,
        description: "option-2",
        required: false,
      },
      {
        name: "emoji-3",
        type: 3,
        description: "emoji-3",
        required: false,
      },
      {
        name: "option-3",
        type: 3,
        description: "option-3",
        required: false,
      },
      {
        name: "emoji-4",
        type: 3,
        description: "emoji-4",
        required: false,
      },
      {
        name: "option-4",
        type: 3,
        description: "option-4",
        required: false,
      },
      {
        name: "emoji-5",
        type: 3,
        description: "emoji-5",
        required: false,
      },
      {
        name: "option-5",
        type: 3,
        description: "option-5",
        required: false,
      },
      {
        name: "emoji-6",
        type: 3,
        description: "emoji-6",
        required: false,
      },
      {
        name: "option-6",
        type: 3,
        description: "option-6",
        required: false,
      },
      {
        name: "emoji-7",
        type: 3,
        description: "emoji-7",
        required: false,
      },
      {
        name: "option-7",
        type: 3,
        description: "option-7",
        required: false,
      },
      {
        name: "emoji-8",
        type: 3,
        description: "emoji-8",
        required: false,
      },
      {
        name: "option-8",
        type: 3,
        description: "option-8",
        required: false,
      },
      {
        name: "emoji-9",
        type: 3,
        description: "emoji-9",
        required: false,
      },
      {
        name: "option-9",
        type: 3,
        description: "option-9",
        required: false,
      },
      {
        name: "emoji-10",
        type: 3,
        description: "emoji-10",
        required: false,
      },
      {
        name: "option-10",
        type: 3,
        description: "option-10",
        required: false,
      },
    ],
  },
  {
    name: "do-poll",
    description: "Admin only",
    options: [
      {
        name: "poll-id",
        type: 3,
        description: "ID of poll",
        required: true,
      },
    ],
  },
  {
    name: "set-poll-number",
    description: "Admin only",
    options: [
      {
        name: "number",
        type: 4,
        description: "Number of polls",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(settings.clientId, settings.guildId),
      {
        body: commands,
      }
    );
    console.log("Slash commands registered");
  } catch (error) {
    console.log(`There was an error : ${error}`);
  }
})();
