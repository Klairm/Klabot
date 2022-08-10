const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Set the volume of the player')
		.addIntegerOption((option) => option.setName('integer').setDescription('Value between 0 and 200 to set the volume').setRequired(true)),

	async execute(interaction) {
		if (!interaction.member.voice.channel) return interaction.reply({ embeds:[{title: '❌ | You are  not in a voice channel!'}], ephemeral: true });		
		if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)
			return interaction.reply({embeds: [{title:"❌ | You are not in my voice channel!"}]});

		let volume = interaction.options.getInteger('integer');
		if (!volume || volume > 200 || volume < 0)
			return interaction.reply({ embeds:[{ title:'❌ | Please set a valid number between 0 and 200', ephemeral: true }]});
		if (!interaction.client.player.getQueue(interaction.guild.id).setVolume(volume)) {
			return interaction.reply({ embeds: [{title:'❌ | Something went wrong trying to set the volume', ephemeral: true }]});
		} else {
			return interaction.reply({embeds:[{title:`✅  | Volume set to ${volume}.`}]});
		}
	},
};
