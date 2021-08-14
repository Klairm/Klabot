const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music in your voice channel.')
		.addStringOption((option) => option.setName('url').setDescription('The song to play')),

	async execute(interaction) {
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: 'You are not in a voice channel!', empheral: true });
		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId)
			return await interaction.reply({ content: 'You are not in my voice channel!', empheral: true });
		const query = interaction.options.get('url').value;
		const queue = interaction.client.player.createQueue(interaction.guild, {
			metadata: {
				channel: interaction.channel,
			},
		});

		// verify vc connection
		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			queue.destroy();
			return await interaction.reply({ content: 'Could not join your voice channel!', empheral: true });
		}

		await interaction.deferReply();
		const track = await interaction.client.player
			.search(query, {
				requestedBy: interaction.author,
			})
			.then((x) => x.tracks[1]);
		if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

		queue.play(track);

		return await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` });
	},
};
