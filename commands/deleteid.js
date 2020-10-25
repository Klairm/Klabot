const db = require("quick.db");
module.exports = {
    name: 'deleteid',
    description: 'Deletes the channel ID from database, you have to specify door, bell, favmessage or logs',
    usage: "-k deleteid <door/bell/favmessage/logs/membercounter> ",
    execute(message, args) {
        if (!args.length) {
            return message.reply("you didn't provide any argument!");
        }
        if (!db.has(`${message.guild.id}.${args[0].toLowerCase()}`)) {
            return message.reply(`No ${args[0].toLowerCase()} channel found in this server.`);
        }
        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            return message.reply("you don't have permissions to do that.");
        }
        if (args[0].toLowerCase() != "bell" && args[0].toLowerCase() != "door" && args[0].toLowerCase() != "favmessage" && args[0].toLowerCase() != "logs" && args[0].toLowerCase() != "membercounter") return message.reply("you have to specify for door, bell or favmessage, example: -k deleteid door");

        if (args[0].toLowerCase() == "bell") message.client.channels.cache.get(db.get(`${message.guild.id}.bell`)).leave();
        if (args[0].toLowerCase() == "membercounter") message.guild.channels.cache.get(db.get(`${message.guild.id}.membercounter`)).delete();

        db.delete(`${message.guild.id}.${args[0].toLowerCase()}`)
        if (!db.has(`${message.guild.id}.${args[0].toLowerCase()}`)) {
            return message.reply(`${args[0].toLowerCase()} channel ID deleted succesfully.`);
        } else {
            return message.reply(`an error has ocurred, while trying to  delete ${args[0]} channel ID.`);
        }


    },
};