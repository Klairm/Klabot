const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete up to 99 messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) => option.setName("integer").setDescription("Number of messages to delete.").setRequired(true)),

  async execute(interaction) {
    const amount = interaction.options.getInteger("integer");
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return await interaction.reply({
        embeds: [{ title: "❌ | I don't have enough permissions." }],
        ephemeral: true,
      });
    } else if (amount <= 1 || amount >= 100) {
      return await interaction.reply({
        embeds: [{ title: "❌ | You need to enter a number between 1 and 99." }],
        ephemeral: true,
      });
    }

    interaction.channel
      .bulkDelete(amount, true)
      .then(
        await interaction.reply({
          embeds: [{ title: `✅ | Deleted ${amount} messages successfully.` }],
          ephemeral: true,
        })
      )
      .catch((err) => {
        console.error(err);
        interaction.reply({
          embeds: [
            {
              title: "❌ | There was an error trying to prune messages in this channel!",
            },
          ],
          ephemeral: true,
        });
      });
  },
};
