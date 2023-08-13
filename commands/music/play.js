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
    //let channel = interaction.member.voice;
    let channel = interaction.member.voice.channel
    if(!channel) return  interaction.followUp({embeds: [{title:`❌ | You're not in a voice channel`}]});
    const query = interaction.options.getString('song', true); 

    await interaction.deferReply();
    try {
      
      
      const { track } = await interaction.client.player.play(channel, query , {
          nodeOptions: {
              
              metadata: interaction ,
              leaveOnEnd: false,
              leaveOnEmpty: false,
              selfDeaf: false
          }
      });

      return interaction.followUp({embeds:[{title:`✅ | ${track.title} added to queue!`}]});
  } catch (e) {
      // let's return error if something failed
      return interaction.followUp({embeds: [{title:`❌ | Something went wrong: ${e}`}]});
  }
    
    
  },
};
