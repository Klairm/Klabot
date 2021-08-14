const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unset')
		.setDescription('Unset channel from the usage ( bell , door, favorite messages )')
		.addChannelOption((option) => option.setName('channel').setDescription('The channel to remove configuration from').setRequired(true))
		.addSubcommand((subcommand) =>
			subcommand
				.setName('favmessage')
				.setDescription('Unset the channel where favorite message are send,')
				.addChannelOption((option) =>
					option.setName('favmessage').setDescription('Channel where the favorite message will be send.').setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('door')
				.setDescription('Unset the channel configuration from door channel.')
				.addChannelOption((option) =>
					option.setName('door').setDescription('Unset channel where the bot listens if anyone entered to activate the bell.').setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('bell')
				.setDescription('Unset the channel configuration from bell channel.')
				.addChannelOption((option) =>
					option.setName('bell').setDescription('Unset channel where the bell sounds after someone joins the door.').setRequired(true)
				)
		),
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
	if (!db.has(`${interaction.guild.id}.${name}`) && db.get(`${interaction.guild.id}.${name}`) == interaction.options.getChannel(name).id) {
		return interaction.reply({ content: "❌ | This channel doesn't have any configuration saved. Maybe wrong channel selected?", ephemeral: true });
	}
	if (db.delete(`${interaction.guild.id}.${name}`)) {
		return interaction.reply('✅ |Channel configuration removed succesfully.');
	} else {
		return interaction.reply({ content: '❌ | Failed to remove channel configuration.', ephemeral: true });
	}
}
