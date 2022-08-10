const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Skips the current track.'),
	async execute(interaction) {
		if (!interaction.member.voice.channel) interaction.reply({ embeds:[{title: '❌ | You are not in a voice channel!'}], ephemeral: true });
		
		
		if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id)
			return interaction.reply({ embeds:[{title: '❌ | You are not in my voice channel!'}], ephemeral: true });

		if (!interaction.client.player.getQueue(interaction.guild.id)) {
			return interaction.reply({ embeds: [{title:"❌ | I'm not playing anything!"}], ephemeral: true });
		}

		if (interaction.client.player.getQueue(interaction.guild.id).skip()) return interaction.reply({embeds:[{title:'✅ | Skipped the player!'}]});
		else return interaction.reply({ embeds:[{title: '❌ | Cannot skip the current track!'}], ephemeral: true });
	},
};
