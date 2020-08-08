const db = require("quick.db");
module.exports = {
    name: 'favmessage',
    description: 'Set the channel for send favorite messages selected with the pill emoji.',
    usage: '-k favmessage channelID',
    execute(message, args) {
        if (!args.length) {
            return message.reply("you didn't provide any arguments.");
        }
        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            return message.reply("You can't do this because you don't have permissions for manage channels.");
        }
        if (args != (message.guild.channels.cache.filter(c => c.id == args[0] && c.type == "text").map(c => c.id))[0]) {
            return message.reply("That channel doesn't exists");
        }
        db.set(`${message.guild.id}.favmessage`, args[0]);
        if (db.has(`${message.guild.id}.favmessage`)) return message.reply("Channel saved succesfully as favorite messages channel");
        else return message.reply("Cannot save the channel as door");
    },
};