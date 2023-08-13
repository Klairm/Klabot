const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("stop").setDescription("Stops the player"),
  async execute(interaction) {
    if (!interaction.member.voice.channel)
      return interaction.reply({
        embeds: [{ title: "❌ | You are  not in a voice channel!" }],
        ephemeral: true,
      });
    if (interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel?.id)
      return interaction.reply({ embeds: [{ title: "❌ | You are not in my voice channel!" }] });
    if (interaction.client.player.nodes.get(interaction.guild).node.stop()) {
      return interaction.reply({
        embeds: [{ title: "✅ |  Stopped the player!" }],
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        embeds: [{ title: "❌ | Something went wrong trying to stop the track!" }],
        ephemeral: true,
      });
    }
  },
};
