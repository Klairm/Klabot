const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('resume').setDescription('Resumes the current track.'),
	async execute(interaction) {
		if (!interaction.member.voice.channel) return interaction.reply({ content: '❌ | You are  in a voice channel!', ephemeral: true });
		if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)
			return interaction.reply({ content: '❌ | You are not in my voice channel!', ephemeral: true });

		if (!interaction.client.player.getQueue(interaction.guild)) {
			console.log(interaction.client.player.getQueue(interaction.guild));
			return interaction.reply({ content: "❌ | I'm not playing anything.", ephemeral: true });
		}

		if (interaction.client.player.getQueue(interaction.guild).setPaused(false)) return interaction.reply('✅ | Track resumed!');
		else return interaction.reply({ content: '❌ | Cannot resume the current track.', ephemeral: true });
	},
};
