const fs = require('fs');

module.exports = {
	name: 'bell',
	description: 'Set the voice channel for the bell',
	usage: "-k bell channelID",
	execute(message,args){
	if(!args.length){
		return message.reply("you didn't provide any arguments!");
	}
	if(!message.member.hasPermission('MANAGE_CHANNELS')&&message.member.id!="386937601761869825"){
		return message.reply("You can't do this because you don't have permissions for manage channels.");
	}

	if(isNaN(args)){
		return message.reply("That doesn't seem to be a channel ID");
	}	

	if(args != (message.guild.channels.cache.filter(c => c.id == args[0] && c.type == "voice").map(c=>c.id))[0] ){
		return message.reply("That channel doesn't exists");
	}
	message.client.channels.cache.get(args[0]).join()	
	fs.readFile("bells.txt",function(err,data){
	if(err){
	return	console.log("An error has ocurred trying to read the test.txt file");
	}
	if(data.includes(args[0].toString())){
		message.reply("That channel is already saved");
	}
	else{
		
	fs.appendFile("bells.txt",","+args[0] + ",",function(err){
	if(err){
		return console.log("An error has ocurred while trying to save the file");
	}
	message.reply(`Saved channel ID ${args[0]} as bell channel succesfully`);
	
	console.log("File saved succesfully");
	});	
  	}});

	
	},
};

