const { SlashCommandBuilder } = require('discord.js');

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
      if (!interaction.options.getMember("member"))
        return interaction.reply({
          embeds: [{ title: "❌ | That member doesn't exists!" }],
          ephemeral: true,
        });
      const hammered = interaction.options.getMember("member").user.username;
      if (!interaction.member.permissions.has("KICK_MEMBERS")) {
        return interaction.reply({
          embeds: [
            { title: "❌ | You don't have permissions to do that, idiot." },
          ],
          ephemeral: true,
        });
      }
  
      if (!interaction.options.getMember("member").kickable) {
        return interaction.reply({
          embeds: [{ title: "❌ | I can't ban that member" }],
          ephemeral: true,
        });
      } else {
        if (!interaction.options.getMember("member").kick()) {
          interaction.reply({
            embeds: [
              { title: "❌ | Something went wrong trying to kick that member." },
            ],
            ephemeral: true,
          });
        } else {
          interaction.reply({
            embeds: [{ title: `✅ | Kicked ${hammered}  succesfully.` }],
          });
        }
      }
    },
  };