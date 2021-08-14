const fs = require('fs');
const db = require('quick.db');
const { Client, Collection, Intents } = require('discord.js');

const { token } = require('./config.json');
const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});
client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

/*** Player events for music 

client.player.on("trackStart", (message, track) => message.channel.send(`✅ | Now playing ${track.title}...`));

client.player.on("trackAdd", (message, queue, track) => message.channel.send(`✅ | Added ${track.title} to the queue...`));

client.player.on("playlistAdd", (message, queue, playlist) => message.channel.send(`✅ | Added ${playlist.title} to the queue...`));

client.player.on("error", (error, message) => console.log("Player Error -> ", error));



client.player.on("noResults", (message, query) => message.channel.send("❌ | No results found."));
***/
client.once('ready', async () => {
  var date = new Date();
  console.log(`Ready at ${date}`);
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      return console.log('Something went wrong  fetching the message: ', error);
    }
  }

  // Check if the emoji reaction that has been added is the :pill: emoji, if so create an embed with user information and send it to a channel
  if (reaction.emoji.name == '💊') {
    if (!db.has(`${reaction.message.guild.id}.favmessage`)) return;
    // Thanks LilaQ
    const favMessage = {
      author: {
        name: reaction.message.author.username,
        icon_url: reaction.message.author.displayAvatarURL(),
      },
      fields: [
        {
          name: '#' + reaction.message.channel.name,
          value: '[jump]' + '(' + reaction.message.url + ')',
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

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  if (newMember.member.user.bot) return;
  if (!db.has(`${newMember.guild.id}.bell`)) return;
  if (!db.has(`${newMember.guild.id}.door`)) return;

  try {
    var bell = await client.channels.cache
      .get(db.get(`${newMember.guild.id}.bell`))
      .join();
    //client.channels.cache.get(db.get(`${newMember.guild.id}.bell`)).overwritePermissions([{id:newMember.guild.roles.everyone,deny: 'VIEW_CHANNEL',}]);
    var door = db.get(`${newMember.guild.id}.door`);
    let newUserChannel = newMember.channel;
    if (newUserChannel == null && oldMember.channel == door)
      console.log(`${newMember.member.displayName} left from the door`);
    if (newUserChannel == door) {
      var date = new Date();
      console.log(
        `${newMember.member.displayName} entered to the door that has channelID: ${newUserChannel} on  the guild: ${newMember.member.guild.name}, at time: ${date} `
      );
      console.log(`[INFO] Bell ID -> ${bell.channel.id}`);
      console.log(`[INFO] Door ID -> ${door}`);
      bell.play('assets/bell.mp3');
    }
  } catch (error) {
    return console.log('Something went wrong,', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  try {
    await client.commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.on('error', async (error) => {
  console.log('An error has ocurred', error);
});

client.login(token);
