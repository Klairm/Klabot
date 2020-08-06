module.exports = {
	name: "avatar",
	description: "Displays user avatar",
	usage: "-k avatar [@User]",
	execute(message){
		if(!message.mentions.users.first()) return message.reply("you have to mention an user.");
		message.channel.send(message.mentions.users.first().displayAvatarURL());
		},



};
