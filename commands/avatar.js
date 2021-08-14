const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const file = new Discord.MessageAttachment('assets/liK.png');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays user avatar')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user').setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.options.getMember('member'))
      return interaction.reply({
        content: "That member doesn't exists!",
        ephemeral: true,
      });
    const embed = {
      author: {
        name: `${interaction.options.get('user').user.username}'s avatar`,
      },
      image: {
        url: `${interaction.options.get('user').user.displayAvatarURL()}`,
      },
    };
    interaction.reply({ files: [file], embeds: [embed], ephemeral: true });
  },
};
