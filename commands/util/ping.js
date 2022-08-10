const {  SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is alive and can reply"),
  async execute(interaction) {
    await interaction.reply({ embeds:[{title: "Pong." }] , ephemeral: true });
  },
};
