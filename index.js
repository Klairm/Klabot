const fs = require("fs");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionType,
} = require("discord.js");
const { Player } = require("discord-player");

const { token } = require("./config.json");

const client = new Client({
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
	   GatewayIntentBits.DirectMessages,
          GatewayIntentBits.DirectMessageTyping

  ],
});
client.commands = new Collection();

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

client.bellQueue;
const musicRow = new ActionRowBuilder().addComponents(
  new ButtonBuilder().setEmoji("⏹").setStyle(ButtonStyle.Danger).setCustomId("stop"),
  new ButtonBuilder().setEmoji("⏸").setStyle(ButtonStyle.Primary).setCustomId("pause"),
  new ButtonBuilder().setEmoji("▶").setStyle(ButtonStyle.Primary).setCustomId("resume"),
  new ButtonBuilder().setEmoji("⏭").setStyle(ButtonStyle.Primary).setCustomId("skip")
);

client.player = new Player(client,{skipFFmpeg: false              });

 client.player.extractors.loadDefault();

/* TODO [Player Events]:
   Use just one message with the song info and edit that message when the command/button is used

   TODO [Client Events]:
   Handle all events in individual files
*/

client.player.events.on("audioTracksAdd", (queue, playlist) => {
  queue.metadata.channel.send({
    embeds: [
      {
        title: playlist[0].playlist.title,
        description: `✅ | Added playlist to the queue!`,
        thumbnail: { url: playlist[0].playlist.thumbnail},
        fields: [
          {name: "URL", value: playlist[0].playlist.url}
        ]
      },
    ],
    components: [musicRow],
  });
  console.log()
});

client.player.events.on("audioTrackAdd", (queue, song) => {
 
  queue.metadata.channel.send({
    embeds: [
      {
        title: song.name,
        description: `✅ | Added song to the queue!`,
        thumbnail: { url: song.thumbnail },
        fields: [
          { name: "Duration", value: song.duration },
          { name: "URL", value: song.url },
        ],
      },
    ],
    components: [musicRow],
  });
});

client.player.events.on("playerStart", (queue, newSong) => {
  queue.metadata.channel.send({
    embeds: [
      {
        title: newSong.title,
        description: `✅ | Now playing ${newSong.title} to the queue!`,
        thumbnail: { url: newSong.thumbnail },
        fields: [
          { name: "Duration", value: newSong.duration },
          { name: "URL", value: newSong.url },
        ],
      },
    ],
    components: [musicRow],
  });
});

client.player.events.on("error", (error) => console.error("[ERROR]" + error));

client.once("ready", async () => {
  let date = new Date();
  console.log("-----------------------------------------------------------------------------");
  console.log(`Ready at ${date}`);
  console.log(`Bot avaible in: \n${client.guilds.cache.map((guild) => guild.name).join("\n")}`);
  console.log("-----------------------------------------------------------------------------");
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      return console.log("Something went wrong  fetching the message: ", error);
    }
  }

  // Check if the emoji reaction that has been added is the :pill: emoji, if so create an embed with user information and send it to a channel
  if (reaction.emoji.name == "💊") {
    if (!db.has(`${reaction.message.guild.id}.favmessage`)) return;
    // Thanks LilaQ
    const favMessage = {
      author: {
        name: reaction.message.author.username,
        icon_url: reaction.message.author.displayAvatarURL(),
      },
      fields: [
        {
          name: "#" + reaction.message.channel.name,
          value: "[jump]" + "(" + reaction.message.url + ")",
          inline: false,
        },
      ],

      url: reaction.message.url,
      description: reaction.message.content,
    };

      reaction.message.guild.channels
		  .fetch(await db.get(`${reaction.message.guild.id}.favmessage`)).then(ch => ch.send({embeds:[favMessage]}));

      

  }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  // Making sure the member entered is not a bot, and that the guild has the bell system configured
  if (newState.member.user.bot) return;

  if (!(await db.has(`${newState.guild.id}.bell`))) return;
  if (!(await db.has(`${newState.guild.id}.door`))) return;
  let newUserChannel = newState.channel;
  let newUser = newState.member;
  const bell = await db.get(`${newState.guild.id}.bell`);
  const door = await db.get(`${newState.guild.id}.door`);

  let bellChannel = await client.channels.cache.get(bell);



  

  // Finally we check if the channel that the new user entered in is the door channel, playing the bell sound.

  if (newUserChannel == door) {
    var userDoorData = { door: newUser.id };
    const doorRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji("🔓")
        .setStyle(ButtonStyle.Success)
        .setCustomId(JSON.stringify(userDoorData))
    );
    await client.player.play(bellChannel,"https://www.youtube.com/watch?v=NTcvsaw9fp8",{
      nodeOptions: {
        metadata: newState
      }
    }).then(() => {
      bellChannel.send({
        embeds: [
          {
            title: `${newUser.user.username} wants to enter, allow? `,
          },
        ],
        components: [doorRow],
      });
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    try {
      if (interaction.customId.includes("door")) {
        var user = JSON.parse(interaction.customId);
        interaction.deferUpdate();
        await interaction.guild.members.cache
          .get(user.door.toString())
          .voice.setChannel(
            interaction.client.channels.cache.get(await db.get(`${interaction.guild.id}.bell`))
          );
      } else {
        await client.commands.get(interaction.customId).execute(interaction);
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "❌ | There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }

  if (interaction.type != InteractionType.ApplicationCommand) return;
  try {
    await client.commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "❌ | There was an error while executing this command!",
      ephemeral: true,
    });
  }
});
client.on("messageCreate", async (message) => {
  if (message.content == "que")
    message.channel.send(
      "https://cdn.discordapp.com/attachments/664187293451419678/1034078773928267876/image0.jpg"
    );
});



client.on("error", async (error) => {
  console.log("❌ | An error has ocurred", error);
});

client.login(token);
