const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if the bot is alive and can reply'),
  async execute(interaction) {
    await interaction.reply({ content: 'Pong.', ephemeral: true });
  },
};
