const { SlashCommandBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unset")
    .setDescription("Unset channel from the usage.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to delete configuration")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has("MANAGE_CHANNELS"))
      return interaction.reply({
        content: "❌ | You don't have permissions to manage channels.",
        ephemeral: true,
      });
    unsetChannel(interaction);
  },
};

async function unsetChannel(interaction) {
  for (let i = 0; i < db.all().length; i++) {
    if (db.all()[i].ID == interaction.guild.id) {
      var id = db.all()[i].ID;
      var values = db.all()[i].data;
    }
  }

  if (Object.keys(values).length == 0) {
    return interaction.reply({
      content:
        "❌ | This channel doesn't have any configuration saved. Maybe wrong channel selected?",
      ephemeral: true,
    });
  }
  if (id == undefined)
    return interaction.reply({
      content: "❌ | There's no configuration avaible in this server.",
      ephemeral: true,
    });

  Object.keys(values).forEach((key) => {
    if (values[key] == interaction.options.getChannel("channel").id) {
      if (db.delete(`${interaction.guild.id}.${key}`)) {
        return interaction.reply(
          "✅ | Channel configuration removed succesfully."
        );
      } else {
        return interaction.reply({
          content: "❌ | Failed to remove channel configuration.",
          ephemeral: true,
        });
      }
    } else
      return interaction.reply({
        content:
          "❌ | This channel doesn't have any configuration saved. Maybe wrong channel selected?",
        ephemeral: true,
      });
  });
}
