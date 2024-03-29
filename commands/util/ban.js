const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName("member").setDescription("Memeber to ban").setRequired(true)),
  async execute(interaction) {
    if (!interaction.options.getMember("member"))
      return interaction.reply({
        embeds: [{ title: "❌ | That member doesn't exists!" }],
        ephemeral: true,
      });
    const hammered = interaction.options.getMember("member").user.username;

    if (!interaction.options.getMember("member").bannable) {
      return interaction.reply({
        embeds: [{ title: "❌ | I can't ban that member" }],
        ephemeral: true,
      });
    } else {
      if (!interaction.options.getMember("member").ban()) {
        interaction.reply({
          embeds: [{ title: "❌ | Something went wrong trying to ban that member." }],
          ephemeral: true,
        });
      } else {
        interaction.reply({
          embeds: [{ title: `✅ | Banned ${hammered}  succesfully.` }],
        });
      }
    }
  },
};
