const fs = require("fs");
const db = require("quick.db");
module.exports={
	name: 'deleteid',
	description: 'Deletes the channel ID from bell or door, you have to specify door or bell',
	usage: "-k deleteid <door/bell> ",
	execute(message,args){
		if(!args.length){
			return message.reply("you didn't provide any argument!");
		}
		if(!db.has(`${message.guild.id}.bell`)){
			return message.reply(`No ${args[0].toLowerCase()} found in this server.`);
		}
		if(!message.member.hasPermission("MANAGE_CHANNELS")){
			return message.reply("you don't have permissions to do that.");
		}	
		if(args[0].toLowerCase() != "bell" && args[0].toLowerCase() != "door") 	return message.reply("you have to specify for door or bell, example: -k deleteid door");

		message.client.channels.cache.get(db.get(`${message.guild.id}.bell`)).leave();
		db.delete(`${message.guild.id}.${args[0].toLowerCase()}`)
		if(!db.has(`${message.guild.id}.${args[0].toLowerCase()}`)){
			return message.reply(`${args[0].toLowerCase()} channel ID deleted succesfully.`);
		}
		else{
			return message.reply(`an error has ocurred, while trying to  delete ${args[0]} channel ID.`);
		}
		
	
	},
	};
	
