const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Set the volume of the player')
		.addIntegerOption((option) => option.setName('integer').setDescription('Value between 0 and 200 to set the volume').setRequired(true)),

	async execute(interaction) {
		if (!interaction.member.voice.channel) interaction.reply({ content: '❌ | You are  in a voice channel!', ephemeral: true });
		if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)
			return interaction.reply({ content: '❌ | You are not in my voice channel!', ephemeral: true });

		let volume = interaction.options.getInteger('integer');
		if (!volume || volume > 200 || volume < 0)
			return interaction.reply({ content: '❌ | Please set a valid number between 0 and 200', ephemeral: true });
		if (!interaction.client.player.getQueue(interaction.guild).setVolume(interaction, volume)) {
			return interaction.reply({ content: '❌ | Something went wrong trying to set the volume', ephemeral: true });
		} else {
			return interaction.reply(`✅  | Volume set to ${volume}.`);
		}
	},
};
