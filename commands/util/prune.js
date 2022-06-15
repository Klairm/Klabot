const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete up to 99 messages.')
		.addIntegerOption((option) => option.setName('integer').setDescription('Number of messages to delete.').setRequired(true)),

	async execute(interaction) {
		const amount = interaction.options.getInteger('integer');
		if (!interaction.guild.me.permissions.has('MANAGE_MESSAGES'))
			await interaction.reply({ content: "❌ | I don't have enough permissions.", ephemeral: true });
		else if (amount <= 1 || amount > 100) {
			return await interaction.reply({ content: '❌ | You need to enter a number between 1 and 99.', ephemeral: true });
		}
		
		


		interaction.channel
			.bulkDelete(amount, true)
			.then(await interaction.reply({ content: `✅ | Deleted ${amount} messages successfully.`, ephemeral: true }))
			.catch((err) => {
				console.error(err);
				interaction.reply({ content: '❌ | There was an error trying to prune messages in this channel!', ephemeral: true });
			});
	},
};
