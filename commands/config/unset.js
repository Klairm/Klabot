const { SlashCommandBuilder, PermissionFlagsBits, ConnectionVisibility } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unset")
    .setDescription("Unset channel from the usage.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) => option.setName("channel").setDescription("Channel to delete configuration").setRequired(true)),

  async execute(interaction) {
    let channel;

    if (!(await db.has(`${interaction.guild.id}`))) {
      return interaction.reply({
        embeds: [{ title: "❌ | There's no configuration avaible in this server." }],
        ephemeral: true,
      });
    }
    // TODO: This probably can be optimized
    if (interaction.options.getChannel("channel").id == (await db.get(`${interaction.guild.id}.bell`))) {
      channel = "bell";
    } else if (interaction.options.getChannel("channel").id == (await db.get(`${interaction.guild.id}.door`))) {
      channel = "door";
    } else if (interaction.options.getChannel("channel").id == (await db.get(`${interaction.guild.id}.favmessage`))) {
      channel = "favmessage";
    } else {
      return interaction.reply({
        embeds: [
          {
            title: "❌ | This channel doesn't have any configuration saved. Maybe wrong channel selected?",
          },
        ],

        ephemeral: true,
      });
    }

    if (await db.delete(`${interaction.guild.id}.${channel}`)) {
      return interaction.reply({
        embeds: [{ title: " ✅ | Channel configuration removed succesfully." }],
        ephemeral: true,
      });
    } else {
      interaction.reply({
        embeds: [{ title: "❌ | Failed to remove channel configuration." }],
        ephemeral: true,
      });
    }
  },
};
