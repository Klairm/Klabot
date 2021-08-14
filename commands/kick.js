const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member.')
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('Member to kick')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.options.getMember('member'))
      return interaction.reply({
        content: "That member doesn't exists!",
        ephemeral: true,
      });
    const assKicked = interaction.options.getMember('member').user.username;
    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply("you don't have permissions to do that, idiot.");
    }
    if (!interaction.options.getMember('member').kickable) {
      return interaction.reply({
        content: "I can't kick that member",
        ephemeral: true,
      });
    } else {
      if (!interaction.options.getMember('member').kick()) {
        interaction.reply({
          content: 'something went wrong.',
          ephemeral: true,
        });
      } else {
        interaction.reply(`Kicked ${assKicked}  succesfully.`);
      }
    }
  },
};
