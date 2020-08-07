const db = require("quick.db");

module.exports = {
	name: "nickname-protection",
	description: "Set <on/off> the nickname protection, if enabled it won't allow users to use special characters on the nickname",
	usage: "-k nickname-protection <on/off>",
	execute(message,args){
		if(!args.length) return message.reply("you didn't provide any arguments.");
		if(!message.member.hasPermission('MANAGE_CHANNELS')) return  message.reply("You can't do this because you don't have permissions for manage channels.");
		if(args[0].toLowerCase() == "on") {
				db.set(`${message.guild.id}.nickname-protection`,'on'); 
				return message.reply("nickname-protection is enabled.");	
			 
		}
		else if(args[0].toLowerCase() == "off"){
			db.set(`${message.guild.id}.nickname-protection`,'off');
			return message.reply("nickname-protection is disabled.")
			} 
		else {
			return message.reply("you have to specify on or off, example: `-k nickname-protection on` ");
		}

	},
};