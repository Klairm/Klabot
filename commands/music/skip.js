const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current track."),
  async execute(interaction) {
    if (!interaction.member.voice.channel)
      return interaction.reply({
        embeds: [{ title: "❌ | You are not in a voice channel!" }],
        ephemeral: true,
      });

    if (interaction.client.player.nodes.get(interaction.guild).node.skip()) {
      return interaction.reply({
        embeds: [{ title: "✅ | Skipped current track" }],
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        embeds: [{ title: "❌ | Something went wrong trying to skip the track!" }],
        ephemeral: true,
      });
    }
  },
};
