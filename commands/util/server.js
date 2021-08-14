const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const file = new Discord.MessageAttachment('assets/liK.png');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Display info about this server.'),
  async execute(interaction) {
    const serverInfo = {
      title: 'Server Info',
      author: {
        name: 'Klabot',
        icon_url: 'attachment://liK.png',
      },
      thumbnail: {
        url: interaction.guild.iconURL(),
      },
      fields: [
        {
          name: `${interaction.guild.name}`,
          value: `Server ID: ${interaction.guild.id}\nServer Name: ${interaction.guild.name}\nServer Owner: ${interaction.guild.owner}\nServer Creation: ${interaction.guild.createdAt}\nServer Region: ${interaction.guild.region}\nTotal Nitro Boosters: ${interaction.guild.premiumSubscriptionCount}\nTotal Members: ${interaction.guild.memberCount}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Klabot',
        icon_url: 'attachment://liK.png',
      },
    };
    interaction.reply({ files: [file], embeds: [serverInfo], ephemeral: true });
  },
};
