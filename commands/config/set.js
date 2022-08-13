const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Set the channels for different usages, (favorite messages, door, bell")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("favmessage")
        .setDescription("Set the channel to send favorite message selected with the pill emoji")
        .addChannelOption((option) =>
          option.setName("favmessage").setDescription("Channel where the favorite message will be send").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("door")
        .setDescription("Set the channel for the door")
        .addChannelOption((option) =>
          option.setName("door").setDescription("Channel where the bot will listen if anyone enters to sound activate the bell").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bell")
        .setDescription("Set the channel where the bell will sound")
        .addChannelOption((option) =>
          option.setName("bell").setDescription("Channel where the bell will sound after someone joins the door.").setRequired(true)
        )
    ),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case "favmessage":
        setChannel(interaction, "favmessage");
        break;
      case "door":
        setChannel(interaction, "door");
        break;
      case "bell":
        setChannel(interaction, "bell");
        break;
      default:
        interaction.reply({
          content: "❌ | Need to specify between favmessage, door OR bell.",
          ephemeral: true,
        });
    }
  },
};

async function setChannel(interaction, name) {
  // TODO: Rework this function
  // TODO:  handle duplication id's: there's shouldn't be 2 channels with the same ID
  if (interaction.options.getChannel(name).type == ChannelType.GuildText && (name == "door" || name == "bell"))
    return interaction.reply({
      embeds: [{ title: "❌ | You selected a text channel, voice channel needed" }],
      ephemeral: true,
    });
  if (interaction.options.getChannel(name).type == ChannelType.GuildVoice && name == "favmessage")
    return interaction.reply({
      embeds: [{ title: "❌ | You selected a voice channel, text channel needed" }],
      ephemeral: true,
    });
  await db.set(`${interaction.guild.id}.${name}`, interaction.options.getChannel(name).id);
  if (
    (await db.has(`${interaction.guild.id}.${name}`)) &&
    (await db.get(`${interaction.guild.id}.${name}`)) == interaction.options.getChannel(name).id
  ) {
    return interaction.reply({
      embeds: [
        {
          title: `✅ | Channel saved for ${name} succesfully.`,
        },
      ],
      ephemeral: true,
    });
  } else {
    return interaction.reply({
      embeds: [{ title: "❌ | Failed to save channel." }],
      ephemeral: true,
    });
  }
}
