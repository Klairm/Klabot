const Discord = require('discord.js');


module.exports = {
    name: "volume",
    description: "Adjust player volume.",
    usage: "-k volume [0-200] ",
    execute(message, args) {
	if (!message.member.voice.channel) return message.channel.send("❌ | You are not in a voice channel!");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send("❌ | You are not in my voice channel!");
	let volume = parseInt(args.join(" "));
	if(!volume || volume > 200 || volume < 0) return message.channel.send("❌ | Please set a valid number between 0 and 200");
	if(!message.client.player.setVolume(message,volume)){
		return message.channel.send("❌| Something went wrong trying to set the volume");

	}else {
		return message.channel.send(` | Volume set to ${volume}.`);
	}

    },



};
