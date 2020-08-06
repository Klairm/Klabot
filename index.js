const fs = require('fs');
const db = require('quick.db');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();	
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready',() => {
	console.log('Ready!');	

});
/*
client.on('guildMemberUpdate', async (oldUser,newUser) =>{	
	var regex = /^[A-Za-z0-9 ]/
	if(!regex.test(newUser.nickname)){
		if(oldUser.nickname == null){
			newUser.setNickname(oldUser.user.username);
		}
		else{
			newUser.setNickname(oldUser.nickname);
		}
		
	}
});
*/
client.on('messageReactionAdd', async (reaction,user) =>{
	
	if (reaction.partial) {
	try 
	{
		await reaction.fetch();
	} catch (error) {
		return console.log('Something went wrong  fetching the message: ', error);
			
	}
	}

	// Check if the emoji reaction that has been added is the :pill: emoji, if so create an embed with user information and send it to a channel
	// FIXME: Check that the reaction has been added in the same guild as the channelID where it will be sent.
	if(reaction.emoji.name == "💊"){
	if(!db.has(`${reaction.message.guild.id}.favmessage`)) return;
	   // Thanks LilaQ 
	   const favMessage ={
	   author: {
 	   name: reaction.message.author.username,
           icon_url: reaction.message.author.displayAvatarURL()},
	   fields:[{
           name: "#" + reaction.message.channel.name,
	   value: "[jump]"+"("+ reaction.message.url+")",
	   inline: false }],
       
       	   url: reaction.message.url, 
           description: reaction.message.content, 
	};
	
	reaction.message.guild.channels.cache.get(db.get(`${reaction.message.guild.id}.favmessage`)).send({embed: favMessage });
}
});


client.on('voiceStateUpdate',async (oldMember,newMember) => {
	if(newMember.member.user.bot) return;
	if(!db.has(`${newMember.guild.id}.bell`)) return;
	if(!db.has(`${newMember.guild.id}.door`)) return;
	
	var bell = await   client.channels.cache.get(db.get(`${newMember.guild.id}.bell`)).join();
	var door = db.get(`${newMember.guild.id}.door`);
	let newUserChannel = newMember.channel;
	 if (newUserChannel == door )
	{
		var date = new Date();
		console.log(`${newMember.member.displayName} entered to the door that has channelID: ${newUserChannel} on  the guild: ${newMember.member.guild.name}, at time: ${date} `);
		console.log(`Bell ID -> ${bell.channel.id}`);
		console.log(`Door ID -> ${door}`);
		bell.play("bell.mp3");
		
	}

});

client.on('message',async message =>{
if (!message.content.startsWith(prefix) || message.author.bot) return;
const args = message.content.slice(prefix.length).split(/ +/);
const commandName = args.shift().toLowerCase();

if (!client.commands.has(commandName)) return;

try {
	client.commands.get(commandName).execute(message,args);
} catch (error) {
	console.error(error);
	message.reply('there was an error trying to execute that command!');
}
});

client.login(token);
