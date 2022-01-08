const fs = require("fs");
const db = require("quick.db");
const { Client, Collection, Intents, MessageSelectMenu } = require("discord.js");
const { Player } = require("discord-music-player");
const {
	createAudioPlayer,
	joinVoiceChannel,
	createAudioResource,
} = require("@discordjs/voice");

const { token } = require("./config.json");
const play = require("./commands/music/play");
const client = new Client({
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
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

client.player = new Player(client);

client.player.on("playlistAdd", (queue, playlist) =>
	queue.data.channel.send({
		embeds: [
			{
				title: playlist.name,
				description: `✅ | Added playlist to the queue!`,
				fields: [{ name: "URL", value: playlist.url }],
			},
		],
	})
);
client.player.on("songAdd", (queue, song) =>
	queue.data.channel.send({
		embeds: [
			{
				title: song.name,
				description: `✅ | Added song to the queue!`,
				thumbnail: { url: song.thumbnail },
				fields: [
					{ name: "Duration", value: song.duration },
					{ name: "URL", value: song.url }
					
				],
			},
		],
	})
);

client.player.on("songChanged", (queue, newSong) =>
	queue.data.channel.send({
		embeds: [
			{
				title: newSong.name,
				description: `✅ | Now playing ${newSong.name}`,
				thumbnail: newSong.thumbnail,
				fields: [
					{ name: "Duration", value: newSong.duration },
					{ name: "URL", value: newSong.url }
				],
			},
		],
	})
);
client.player.on("error", (error) => console.log(error));

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
const bellPlayer = createAudioPlayer();
client.on("voiceStateUpdate", async (oldMember, newMember) => {
	if (newMember.member.user.bot) return;
	if (!db.has(`${newMember.guild.id}.bell`)) return;
	if (!db.has(`${newMember.guild.id}.door`)) return;
	const resource = createAudioResource("assets/bell.mp3");

	try {
		const bell = joinVoiceChannel({
			channelId: db.get(`${newMember.guild.id}.bell`),
			guildId: newMember.guild.id,
			adapterCreator: newMember.guild.voiceAdapterCreator,
		});
		const subscription = bell.subscribe(bellPlayer);

		var door = db.get(`${newMember.guild.id}.door`);
		let newUserChannel = newMember.channel;
		if (newUserChannel == null && oldMember.channel == door)
			console.log(`${newMember.member.displayName} left from the door`);
		if (newUserChannel == door) {
			var date = new Date();
			bellPlayer.play(resource);
		}
	} catch (error) {
		return console.log("Something went wrong,", error);
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

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
		/https:\/\/prnt\.sc\//,
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
	  
		// I don't have time for this shit
		/discorcl\.[a-z]/,
		/discord-app\./,
		/dlscord\.[a-z]/,
		/discordapp\.([abd-mo-z]|c[a-n][p-z]|n[a-df-z])/,
	  
		// risky, but i think worth
		/get 3 months/,
		/get 1 month/,
		/3 months of discord nitro/,
		///nitro for 3 months/, this is very risky will take a look 
		/free steam give nitro/,
		/nitro steam for free/,
		/\.ru\//,
		/free nudes/,
		/\.ru\.com\//,
	  
		// bots like to mention everyone despite not being possible
		/@everyone(.*)https?:\/\//,
		/https?:\/\/(.*)@everyone/,
	  ];
	  const links = ["http://", "https://"];
	  if((TOKENS.some((token) => token.test(message.cleanContent))) && links.some(v => message.cleanContent.includes(v))  ) {  
		spammer = message.member.user.username;
		if (!message.member.bannable) message.channel.send("Spam detected, but I don't have enough permissions to ban this member!");
		else message.member.ban() ? message.channel.send(`${spammer} got banned succesfully for spamming!`) : message.send("Something went wrong trying to ban the spammer!");
		message.delete() ? console.log("deleted spam message") : console.log("cannot delete the spam message!");


	  };
	  
})
client.on("error", async (error) => {
	console.log("❌ | An error has ocurred", error);
});

client.login(token);
