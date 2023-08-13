const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the current track."),
  async execute(interaction) {
    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: "❌ | You are  not in a voice channel!",
        ephemeral: true,
      });

	  interaction.client.player.nodes.get(interaction.guild).node.setBitrate(320)
    if (interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel?.id)
      return interaction.reply({ embeds: [{ title: "❌ | You are not in my voice channel!" }] });

    if (interaction.client.player.nodes.get(interaction.guild).node.setPaused(false)) {
      return interaction.reply({
        embeds: [{ title: "✅ |  Track resumed!" }],
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        embeds: [{ title: "❌ | Something went wrong trying to resume the track!" }],
        ephemeral: true,
      });
    }
  },
};
