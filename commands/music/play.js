const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music in your voice channel.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song to play")
        .setRequired(true)
    ),

  async execute(interaction) {
    let existingQueue = !interaction.client.bellQueue ? false : true;

    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        embeds: [{ title: "❌ | You are not in a voice channel!" }],
        empheral: true,
      });
    let queue = !existingQueue
      ? interaction.client.player.createQueue(interaction.guild.id, {
          data: { channel: interaction.channel },
        })
      : interaction.client.bellQueue;
    if (!existingQueue) {
      await queue.join(interaction.member.voice.channel);
      if (!queue)
        return await interaction.followUp({
          embeds: [{ title: `❌ | Couldn't load the track!` }],
          empheral: false,
        });
    } else {
      queue.data = {
        channel: interaction.channel,
      };
    }
    let song = interaction.options.get("song").value;
    await interaction.deferReply();
    if (song.includes("&list") || song.includes("/playlist/")) {
      await queue.playlist(song);
    } else {
      await queue.play(song);
    }

    return await interaction.followUp({
      embeds: [{ title: "⏱️ | Loading track..." }],
    });
  },
};
