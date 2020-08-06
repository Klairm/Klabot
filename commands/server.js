const Discord = require("discord.js");
const file = new Discord.MessageAttachment('assets/liK.png'); 
module.exports = {
	name: 'server',
	description: 'Display info about this server.',
	execute(message) {
	const serverInfo = {
		title: "Server Info",
		author: {
			name: "Klabot",
			icon_url: 'attachment://liK.png',
			},
		thumbnail:{
			url: message.guild.iconURL()
			},
		fields: [{
			name:`${message.guild.name}`,
			value: `Server ID: ${message.guild.id}\nServer Name: ${message.guild.name}\nServer Owner: ${message.guild.owner}\nServer Creation: ${message.guild.createdAt}\nServer Region: ${message.guild.region}\nTotal Nitro Boosters: ${message.guild.premiumSubscriptionCount}\nTotal Members: ${message.guild.memberCount}`,
			inline: true,
			}],
		timestamp: new Date(),
		footer:{
			text: 'Klabot',
			icon_url: 'attachment://liK.png',
		
},
};
	message.channel.send({files:[file],embed:serverInfo});
},
};
