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
const { Player } = require("discord-music-player");

const { token } = require("./config.json");
const play = require("./commands/music/play");
const { resourceUsage } = require("process");
const client = new Client({
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
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

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setEmoji("⏹")
    .setStyle(ButtonStyle.Danger)
    .setCustomId("stop"),
  new ButtonBuilder()
    .setEmoji("⏸")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("pause"),
  new ButtonBuilder()
    .setEmoji("▶")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("resume"),
  new ButtonBuilder()
    .setEmoji("⏭")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("skip")
);

client.player = new Player(client, {
  leaveOnEmpty: true,
  leaveOnEnd: false,
});

/* TODO [Player Events]:
   Use just one message with the song info and edit that message when the command/button is used
*/

client.player.on("playlistAdd", (queue, playlist) => {
  queue.data.channel.send({
    embeds: [
      {
        title: playlist.name,
        description: `✅ | Added playlist to the queue!`,
        fields: [{ name: "URL", value: playlist.url }],
      },
    ],
    components: [{ row }],
  });
});
client.player.on("songAdd", (queue, song) => {
  queue.data.channel.send({
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
    components: [row],
  });
});

client.player.on("songChanged", (queue, newSong) => {
  queue.data.channel.send({
    embeds: [
      {
        title: newSong.name,
        description: `✅ | Now playing ${newSong.name}`,
        thumbnail: { url: newSong.thumbnail },
        fields: [
          { name: "Duration", value: newSong.duration },
          { name: "URL", value: newSong.url },
        ],
      },
    ],
    components: [row],
  });
});

client.player.on("error", (error) => console.error(error));

client.once("ready", async () => {
  var date = new Date();
  console.log(
    "-----------------------------------------------------------------------------"
  );
  console.log(`Ready at ${date}`);
  console.log(
    `Bot avaible in: \n${client.guilds.cache
      .map((guild) => guild.name)
      .join("\n")}`
  );
  console.log(
    "-----------------------------------------------------------------------------"
  );
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

    reaction.message.guild.channels.cache
      .get(db.get(`${reaction.message.guild.id}.favmessage`))
      .send({
        embeds: [favMessage],
      });
  }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  // Making sure the member entered is not a bot, and that that guild has the bell system configured
  if (newState.member.user.bot) return;
  if (!(await db.has(`${newState.guild.id}.bell`))) return;
  if (!(await db.has(`${newState.guild.id}.door`))) return;
  let newUserChannel = newState.channel;
  const bell = await db.get(`${newState.guild.id}.bell`);
  const door = await db.get(`${newState.guild.id}.door`);

  // We create a new queue using our player from discord-music-player then  try to join the bell channel
  client.bellQueue = client.player.createQueue(newState.guild.id, {
    data: { channel: newUserChannel },
  });

  await client.bellQueue.join(bell);
  if (!client.bellQueue)
    console.log(`[ERRO] Error joining the bell channel at ${new Date()}`);

  // Finally we check if the channel that the new user entered in is the door channel, playing the bell sound.

  if (newUserChannel == door) {
    await client.bellQueue.play("https://www.youtube.com/watch?v=NTcvsaw9fp8");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    try {
      console.log(interaction.customId);

      await client.commands.get(interaction.customId).execute(interaction);
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
  // https://github.com/makigas/makibot/blob/trunk/src/hooks/csgo.ts thx danirod
  const TOKENS = [
    // Different variations of steamcommunity.
    /steamcommmunlity\.com/,
    /steamcommmunlity\.com/,
    /steamcconuunity\.co/,
    /steamcomminutiu\.ru/,
    /steamcomminytiy\.ru/,
    /steamcommnuntiy\.com/,
    /steamcommunityu\.com/,
    /steamcommunlty\.pro/,
    /steamcommuntry\.ru/,
    /steamcommunytiu\.com/,
    /steamcomnmuituy\.com/,
    /steancommuniit\.ru/,
    /steancomunnity\.ru/,
    /stearmcommunitty\.ru/,
    /stearmcommunity\.ru/,
    /stearncommunytiy\.ru/,
    /stearncormmunity\.com/,
    /stearncormunsity\.com/,
    /stermccommunitty\.ru/,
    /stiemcommunitty\.ru/,
    /steamcommrnunity\.com/,
    /steamcommunity\.link/,

    // There is this CSGO scam-bot
    //https:\/\/prnt\.sc\//, <-- causing problems
    /i will accept all trades/,
    /i'm tired of csgo/,

    // No one will give you nitro for free
    //Alphabetical ordered list
    //[a-z]
    /dlscord\.info/,
    /dlscord\.ink/,
    /dlscord\.gifts/,
    /discord\.giveawey.com/,
    /dlscord\.nitro/,
    /dlscord\.help/,
    /dlscord\.pro/,
    /discortnitosteam\.online/,
    /discortnitosteam\.online/,
    //[-]
    /discorcd-apps\.com/,
    /discord-help\./,
    /dicsord-nitro\./,
    /discord-nitre\./,
    /dlscord-nitro\./,
    /discrode-gift\./,
    /gave-nitro\./,
    /discord-nitre\./,

    // Update
    /rust-way\.com/,
    /twitch\.rust-ltd\.com/,
    /:\/\/discord-nitro\./,
    /discorcl\.link/,
    /discorcl\.click/,
    /discordapp\.click/,
    /discordapp\.link/,
    /discgrd\./,
    /disczrd\./,
    /dlscord-app.su\./,
    /discord-go\./,
    /discord-best-nitro\./,

    // I don't have time for this shit
    /discorcl\.[a-z]/,
    /discord-app\./,
    /dlscord\.[a-z]/,
    /discordapp\.([abd-mo-z]|c[a-n][p-z]|n[a-df-z])/,

    // risky, but i think worth
    /get 3 months/,
    /get 1 month/,
    /3 months of discord nitro/,
    /free steam give nitro/,
    /nitro steam for free/,
    /\.ru\//,
    /free nudes/,
    /\.ru\.com\//,
  ];
  const links = ["http://", "https://"];

  if (
    TOKENS.some((token) => token.test(message.cleanContent)) &&
    links.some((v) => message.cleanContent.includes(v))
  ) {
    spammer = message.member.user.username;

    if (!message.member.bannable)
      message.channel.send(
        "Spam detected, but I don't have enough permissions to ban this member!"
      );
    else
      message.member.ban()
        ? message.channel.send(
            `${spammer} got banned succesfully for spamming!`
          )
        : message.send("Something went wrong trying to ban the spammer!");
    message.delete()
      ? console.log("deleted spam message")
      : console.log("cannot delete the spam message!");
  }
});
client.on("error", async (error) => {
  console.log("❌ | An error has ocurred", error);
});

client.login(token);
