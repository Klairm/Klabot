const Discord = require('discord.js');


module.exports = {
    name: "play",
    description: "Play music in your voice channel.",
    usage: "-k play ",
    execute(message, args) {
	if (!message.member.voice.channel) return message.channel.send("❌ | You are not in a voice channel!");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send("❌ | You are not in my voice channel!");
	if(!message.client.player.play(message,args[0],true)){
		return message.channel.send("`❌ | Something went wrong trying to play the track. `");
	}

    },



};
