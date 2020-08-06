module.exports = {
	name: 'kick',
	description: 'Tag a member and kick them.',
	usage: '-k kick @member',
	execute(message,args) {
		if(!args.length){
			return message.reply("you didn\'t provide any arguments.");
		}
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}

		const taggedUser = message.mentions.members.first();
		if (!message.member.hasPermission('KICK_MEMBERS')){
			return message.reply("you don't have permissions to do that, you idiot.");
		}
		if(!taggedUser.kickable){
			return message.reply("I can't kick that member");
		}
		else{

		if(!taggedUser.kick()){
			message.reply("something went wrong.");
		}
		else{

		message.reply(`kicked ${taggedUser} succesfully.`);			
		}
		}
	},
};
