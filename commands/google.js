const Discord = require('discord.js');
const file = new Discord.MessageAttachment('assets/liK.png');

module.exports = {
	name: "google",
	description: "Use the Google search engine",
	usage: "-k google [something]",
	execute(message,args){
		
		  const googleEmbed = {
                title: `\n There's your search link`,
                description:`http://google.com/search?q=${args}`,
                author: {
                    name: 'Klabot',
                    icon_url: 'attachment://liK.png',
                },
               
                timestamp: new Date(),
                footer: {
                    text: 'Klabot',
                    icon_url: 'attachment://liK.png'
                }
            };
		
		message.channel.send({files: [file], embed: googleEmbed});
		
	},



};