const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Displays user avatar')
		.addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true)),
	async execute(interaction) {
		if (!interaction.options.getMember('user'))
			return interaction.reply({
				embeds:[{title: "❌ | That member doesn't exists!"}],
				ephemeral: true,
			});
		const embed = {
			author: {
				name: `${interaction.options.get('user').user.username}'s avatar`,
			},
			image: {
				url: `${interaction.options.get('user').user.displayAvatarURL()}`,
			},
		};
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
