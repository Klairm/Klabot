const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('pause').setDescription('Pauses the current track.'),
	async execute(interaction) {
		if (!interaction.member.voice.channel) return interaction.reply({ embeds:[{title: '❌ | You are not in a voice channel!'}], ephemeral: true });
		if (interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel?.id )
			return interaction.reply({ content: '❌ | You are not in my voice channel!', ephemeral: true });

		if (!interaction.client.player.nodes.get(interaction.guild).node.isPlaying()) {
			
			return interaction.reply({ embeds:[{ title:"❌ | I'm not playing anything."}], ephemeral: true });
		}

		if (interaction.client.player.nodes.get(interaction.guild).node.setPaused(true)) return interaction.reply({embeds:[{title: '✅ | Paused the current track!'}]});
		else return interaction.reply({ embeds:[{title: '❌ | Cannot pause the current track.'}], ephemeral: true });
	},
};
