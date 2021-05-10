module.exports = {
    name: "resume",
    description: "Resumes the paused  track.",
    usage: "-k resume",
    execute(message, args) {
        if (!message.member.voice.channel) return message.channel.send("❌ | You are not in a voice channel!");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send("❌ | You are not in my voice channel!");
        if (!message.client.player.isPlaying(message)) {
            return message.channel.send("❌ | I'm not playing anything?");
        }
        if (message.client.player.resume(message)) {
            return message.channel.send("✅ | Resumed the paused track");
        } else {
            return message.channel.send("❌ | Something went wrong trying to resume the track.");
        }

    },



};