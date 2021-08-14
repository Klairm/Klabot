const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('stop').setDescription('Stops the player'),
	async execute(interaction) {
		if (!interaction.member.voice.channel) return interaction.reply({ content: '❌ | You are  in a voice channel!', ephemeral: true });
		if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)
			return interaction.reply('❌ | You are not in my voice channel!');

		if (!interaction.client.player.getQueue(interaction.guild)) {
			console.log(interaction.client.player.getQueue(interaction.guild));
			return interaction.reply("❌ | I'm not playing anything.");
		}

		interaction.client.player.getQueue(interaction.guild).stop(interaction);
		return interaction.reply('✅ | Stopped the player!');
	},
};
