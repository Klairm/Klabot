const fs = require("fs");
module.exports={
	name: 'deleteid',
	description: 'Deletes the channel ID from bell or door, you have to specify door or bell',
	usage: "-k deleteid <door/bell> <channelID>",
	execute(message,args){
		if(!args.length){
			return message.reply("you didn't provide any argument!");
		}
		if(isNaN(args[1])){
			return message.reply("that doesn't seems to be a channelID.");
		}
		if(!(message.client.channels.cache.has(args[1]))){
			return message.reply("that channel doesn't exists.");
		}
		if(!message.member.hasPermission("MANAGE_CHANNELS")){
			return message.reply("you don't have permissions to do that.");
		}
		
		message.client.channels.cache.get(args[1]).leave();
		if(args[0].toLowerCase() == "bell"){
			var fileName = "bells.txt";
		}
		else if (args[0].toLowerCase() == "door"){
			var fileName = "doors.txt";
		}
		else{
			return message.reply("you have to specify for door or bell, example: -k deleteid door 022223222220635790");
		}
		fs.readFile(fileName,function(err,data)
		{
			if(err) throw err;
			var data_array = data.toString().split(",");
			console.log(data_array);
			if(!data_array.includes(args[1])) return message.reply("that channel ID doesn't exists in our database.");
			data_array.splice(data_array.indexOf(args[1]));
			fs.writeFile(fileName,data_array,function(err)
			{
				if(err) return message.reply("there was an error while trying to delete that channel id.");
				return message.reply("channel ID deleted succesfully.");
			});	
		});		
	},
	};
	
