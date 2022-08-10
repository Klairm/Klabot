const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('pause').setDescription('Pauses the current track.'),
	async execute(interaction) {
		if (!interaction.member.voice.channel) return interaction.reply({ embeds:[{title: '❌ | You are not in a voice channel!'}], ephemeral: true });
		if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)
			return interaction.reply({ content: '❌ | You are not in my voice channel!', ephemeral: true });

		if (!interaction.client.player.getQueue(interaction.guild.id)) {
			console.log(interaction.client.player.getQueue(interaction.guild.id));
			return interaction.reply({ embeds:[{ title:"❌ | I'm not playing anything."}], ephemeral: true });
		}

		if (interaction.client.player.getQueue(interaction.guild.id).setPaused(true)) return interaction.reply({embeds:[{title: '✅ | Paused the current track!'}]});
		else return interaction.reply({ embeds:[{title: '❌ | Cannot pause the current track.'}], ephemeral: true });
	},
};
