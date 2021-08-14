const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unset')
		.setDescription('Unset channel from the usage ( bell , door, favorite messages )')
		.addSubcommand((subcommand) => subcommand.setName('favmessage').setDescription('Unset the channel where favorite message are send,'))
		.addSubcommand((subcommand) => subcommand.setName('door').setDescription('Unset the channel configuration from door channel.'))
		.addSubcommand((subcommand) => subcommand.setName('bell').setDescription('Unset the channel configuration from bell channel.')),
	async execute(interaction) {
		if (!interaction.member.permissions.has('MANAGE_CHANNELS'))
			return interaction.reply({
				content: "❌ | You don't have permissions to manage channels.",
				ephemeral: true,
			});

		switch (interaction.options.getSubcommand()) {
			case 'favmessage':
				setChannel(interaction, 'favmessage');
				break;

			case 'door':
				setChannel(interaction, 'door');
				break;

			case 'bell':
				setChannel(interaction, 'bell');
				break;

			default:
				interaction.reply({ content: '❌ | Need to specify between favmessage, door OR bell.', ephemeral: true });
				break;
		}
	},
};

function setChannel(interaction, name) {
	if (!db.has(`${interaction.guild.id}.${name}`)) {
		return interaction.reply({ content: "❌ | This channel doesn't have any configuration saved. Maybe wrong channel selected?", ephemeral: true });
	}
	if (db.delete(`${interaction.guild.id}.${name}`)) {
		return interaction.reply('✅ | Channel configuration removed succesfully.');
	} else {
		return interaction.reply({ content: '❌ | Failed to remove channel configuration.', ephemeral: true });
	}
}
