const db = require("quick.db");
module.exports = {
    name: 'logs',
    description: 'Set the current channel for server logs.',
    usage: '-k logs',
    execute(message, args) {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            return message.reply("You can't do this because you don't have permissions for manage channels.");
        }
        db.set(`${message.guild.id}.logs`, `${message.channel.id}`);
        if (db.has(`${message.guild.id}.logs`)) return message.reply("Channel saved succesfully for server logs.");
        else return message.reply("Cannot save the channel.");
    },
};