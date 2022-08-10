const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('resume').setDescription('Resumes the current track.'),
	async execute(interaction) {
		if (!interaction.member.voice.channel) return interaction.reply({ content: '❌ | You are  not in a voice channel!', ephemeral: true });
		if (interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel?.id )
		return interaction.reply({embeds: [{title:"❌ | You are not in my voice channel!"}]});

		if (!interaction.client.player.getQueue(interaction.guild.id)) {
			console.log(interaction.client.player.getQueue(interaction.guild.id));
			return interaction.reply({embeds: [{title:"❌ | I'm not playing anything."}]});
		}
		
		await interaction.client.player.getQueue(interaction.guild.id).setPaused(false)
		return interaction.reply({embeds:[{title:'✅ | Track resumed!'}]});
		
	},
};
