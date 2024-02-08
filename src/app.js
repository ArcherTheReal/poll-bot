const discord = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

//poll schema
const pollSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    emojis: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const settingsSchema = new Schema({
  pollnumber: { type: Number, required: true },
});

const Poll = mongoose.model("Poll", pollSchema);
const Settings = mongoose.model("Settings", settingsSchema);

//mongodb
mongoose
  .connect(process.env.MONGODB)
  .then((result) => console.log("Connected to db"))
  .catch((err) => console.log(err));

//settings
const settings = JSON.parse(
  fs.readFileSync(path.join(__dirname, "settings.json"))
);

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
client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "copy-poll") {
      const pollId = interaction.message.embeds[0].footer.text;
      interaction.reply({ content: pollId, ephemeral: true });
    }
  }
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "poll") {
    // Accessing the options
    const question = interaction.options.getString("question");
    let optionsArray = [];
    let emojisArray = [];
    for (let i = 1; i <= 10; i++) {
      if (interaction.options.getString("option-" + i)) {
        optionsArray.push(interaction.options.getString("option-" + i));
        emojisArray.push(interaction.options.getString("emoji-" + i));
      }
    }

    const poll = new Poll({
      user: interaction.user.id,
      question: question,
      options: optionsArray,
      emojis: emojisArray,
    });
    let fields = [];
    for (let i = 0; i < optionsArray.length; i++) {
      fields.push(emojisArray[i] + " " + optionsArray[i]);
    }
    poll
      .save()
      .then((result) => {
        interaction.reply("Poll created!", { ephemeral: true });
        const embed = new discord.EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(question)
          .setAuthor({
            name: interaction.user.globalName,
            iconURL: interaction.user.avatarURL(),
          })
          .setFooter({ text: result._id.toString() })
          .setDescription(fields.join("\n"));

        //button
        const copy = new discord.ButtonBuilder()
          .setCustomId("copy-poll")
          .setLabel("Copy poll")
          .setStyle(1);

        const row = new discord.ActionRowBuilder().addComponents(copy);
        interaction.channel.send({ embeds: [embed], components: [row] });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (interaction.commandName == "do-poll") {
    if (!settings.admins.includes(interaction.user.id)) {
      interaction.reply({ content: "You are not an admin", ephemeral: true });
      return;
    }

    const pollId = interaction.options.getString("poll-id");
    Settings.findById("65c3e1c42d6c743c589bbc22").then((pollnumber) => {
      Poll.findById(pollId)
        .then((result) => {
          if (result.user) {
            client.users.fetch(result.user).then(async (user) => {
              let optionsArray = [];
              for (let i = 0; i < result.options.length; i++) {
                optionsArray.push(result.emojis[i] + " " + result.options[i]);
              }
              const embed = new discord.EmbedBuilder()
                .setColor("#0099ff")
                .setTitle(
                  "Random poll #" +
                    pollnumber.pollnumber +
                    "\n\n" +
                    result.question
                )
                .setAuthor({
                  name: user.globalName,
                  iconURL: user.avatarURL(),
                })
                .setDescription(optionsArray.join("\n"))
                .addFields({
                  name: "**If you have any random poll ideas, submit them here!**",
                  value: "<#1200118137367048282>",
                });
              await interaction.reply({ content: "Done", ephemeral: true });
              const msg = await interaction.channel.send({ embeds: [embed] });
              for (let i = 0; i < result.options.length; i++) {
                msg.react(result.emojis[i]);
              }
              pollnumber.pollnumber++;
              pollnumber.save();
            });
          } else {
            interaction.reply({ content: "Poll not found", ephemeral: true });
          }
        })
        .catch((err) => {
          console.log(err);
          interaction.reply({ content: "An error occured", ephemeral: true });
        });
    });
  } else if (interaction.commandName == "set-poll-number") {
    if (!settings.admins.includes(interaction.user.id)) {
      interaction.reply({ content: "You are not an admin", ephemeral: true });
      return;
    }
    const number = interaction.options.getInteger("number");
    Settings.findById("65c3e1c42d6c743c589bbc22").then((pollnumber) => {
      pollnumber.pollnumber = number;
      pollnumber.save();
      interaction.reply({ content: "Done", ephemeral: true });
    });
  }
});

client.login(process.env.TOKEN);
