const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member.')
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('Mmeber to kick')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.options.getMember('member'))
      return interaction.reply({
        content: "That member doesn't exists!",
        ephemeral: true,
      });
    const hammered = interaction.options.getMember('member').user.username;
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply("you don't have permissions to do that, idiot.");
    }

    if (!interaction.options.getMember('member').bannable) {
      return interaction.reply({
        content: "I can't ban that member",
        ephemeral: true,
      });
    } else {
      if (!interaction.options.getMember('member').ban()) {
        interaction.reply({
          content: 'something went wrong.',
          ephemeral: true,
        });
      } else {
        interaction.reply(`Banned ${hammered}  succesfully.`);
      }
    }
  },
};
