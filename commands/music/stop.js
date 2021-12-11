const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('stop').setDescription('Stops the player'),
	async execute(interaction) {
		if (!interaction.member.voice.channel) return interaction.reply({ embeds:[{title: '❌ | You are  not in a voice channel!'}], ephemeral: true });
		if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id)
			return interaction.reply({embeds: [{title:"❌ | You are not in my voice channel!"}]});
		if (!interaction.client.player.getQueue(interaction.guild.id)) {
			console.log(interaction.client.player.getQueue(interaction.guild.id));
			return interaction.reply({embeds: [{title:"❌ | I'm not playing anything."}]});
		}

		interaction.client.player.getQueue(interaction.guild.id).stop(interaction);
		return interaction.reply({embeds: [{title:'✅ | Stopped the player!'}]});
	},
};
