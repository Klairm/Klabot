const db = require("quick.db");
module.exports = {
    name: 'door',
    description: 'Set the voice channel for the door.',
    usage: '-k door channelID',
    execute(message, args) {
        if (!args.length) {
            return message.reply("you didn't provide any arguments.");
        }
        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            return message.reply("You can't do this because you don't have permissions for manage channels.");
        }
        if (args != (message.guild.channels.cache.filter(c => c.id == args[0] && c.type == "voice").map(c => c.id))[0]) {
            return message.reply("That channel doesn't exists");
        }
        db.set(`${message.guild.id}.door`, args[0]);
        if (db.has(`${message.guild.id}.door`)) return message.reply("Channel saved succesfully as door");
        else return message.reply("Cannot save the channel as door");
    },
};