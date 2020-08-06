const fs = require('fs');
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
			
	reaction.client.channels.cache.get("722501428563804251").send({embed: favMessage });
}
});


client.on('voiceStateUpdate',async (oldMember,newMember) => {
	if(newMember.member.user.bot) return;

	// FIXME: Optimize this
	fs.readFile("bells.txt",async function(err,text){
        if(err){
                return console.log("An error has ocurred reading bells.txt file");
        }

        var textByLine = text.toString().split(",");
        var i;
        // loop through all the strings saved in bells.txt ( which should be channel IDs ) 
        for(i = 0; i<textByLine.length;i++)
	{
        
	        if(isNaN(textByLine[i])){ // check if string is a number
	        	console.log(`Not a number:  ${textByLine[i]}`);
                }
                if(!client.channels.cache.has(textByLine[i])){ // check if the string it's a real channel ID
			if(textByLine[i]=="" || textByLine[i]=="," || textByLine[i] ==",," || textByLine[i]==null);
			else console.log(`Invalid channel id:  ${textByLine[i]}`);
		
		}
		
		// Check if the member channel is on a  voice channel, and if the channel ID is equivalent to the ID saved on the bells.txt
		// If so, join that channel
		if(newMember.guild.channels.cache.filter(c => c.id == textByLine[i] && c.type == "voice").map(c=>c.id)[0] ){  
			var bell = await   client.channels.cache.get(textByLine[i]).join()
		}	
        }
	
		// Same as above but with doors.txt, ( where the bot will be checking if there's a new member that joined that channel
		
	fs.readFile("doors.txt",async function(errr,texxt){
	if(errr){
		return console.log("An error has ocurred reading doors.txt file");
	}
	var textByLineDoors = texxt.toString().split(",");
	var j;

	for(j=0;j<textByLineDoors.length;j++){	
		if(newMember.guild.channels.cache.filter(c => c.id == textByLineDoors[j] && c.type == "voice").map(c=>c.id)[0]){
			var  door = textByLineDoors[j];
			}
		
	}
	
	let newUserChannel = newMember.channel;
	// Check if the channel ID that the member joined is the door channel, if so it will play the .mp3  file on bell VC
	
	if(newUserChannel == null || newUserChannel == undefined);
	else if (newUserChannel == door )
	{
		var date = new Date();
		console.log(`${newMember.member.displayName} entered to the door that has channelID: ${newUserChannel} on  the guild: ${newMember.member.guild.name}, at time: ${date} `);
		console.log(`Bell ID -> ${bell.channel.id}`);
		console.log(`Door ID -> ${door}`);
		bell.play("bell.mp3");
		
	}
	});
   	});

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
