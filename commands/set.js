const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Set the channels for different usages, (favorite messages, door, bell')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('favmessage')
				.setDescription('Set the channel to send favorite message selected with the pill emoji')
				.addChannelOption((option) =>
					option.setName('favmessage').setDescription('Channel where the favorite message will be send').setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('door')
				.setDescription('Set the channel for the door')
				.addChannelOption((option) =>
					option.setName('door').setDescription('Channel where the bot will listen if anyone enters to sound activate the bell').setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('bell')
				.setDescription('Set the channel where the bell will sound')
				.addChannelOption((option) =>
					option.setName('bell').setDescription('Channel where the bell will sound after someone joins the door.').setRequired(true)
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
				if (setChannel(interaction, 'favmessage')) {
					return interaction.reply('✅ |Channel saved for favorite messages succesfully.');
				} else
					return interaction.reply({
						content: '❌ | Failed to save channel.',
						ephemeral: true,
					});
				break;
			case 'door':
				if (setChannel(interaction, 'door')) {
					return interaction.reply('✅ |Channel saved as door channel succesfully.');
				} else
					return interaction.reply({
						content: '❌ | Failed to save channel.',
						ephemeral: true,
					});
				break;
			case 'bell':
				if (setChannel(interaction, 'bell')) {
					return interaction.reply('✅ |Channel saved as bell channel succesfully.');
				} else
					return interaction.reply({
						content: '❌ | Failed to save channel.',
						ephemeral: true,
					});
				break;
			default:
				interaction.reply({
					content: '❌ | Need to specify between favmessage, door OR bell.',
					ephemeral: true,
				});
				break;
		}
	},
};

function setChannel(interaction, name) {
	db.set(`${interaction.guild.id}.${name}`, interaction.options.getChannel(name).id);
	if (db.has(`${interaction.guild.id}.${name}`) && db.get(`${interaction.guild.id}.${name}`) == interaction.options.getChannel(name).id) {
		return true;
	} else {
		return false;
	}
}
