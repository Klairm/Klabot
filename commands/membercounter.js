const db = require('quick.db');

module.exports = {
    name: 'membercounter',
    description: 'Creates a channel with the member count.',
    usage: '-k membercounter',
    execute(message, args) {
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
            return message.reply("I don't have enough permissions for create channels.")
        }
        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            return message.reply("you don't have permissions to do that.");
        }


        message.guild.channels.create(`total members: ${message.guild.memberCount}`, {
                type: 'voice',
                permissionOverwrites: [{
                    id: message.guild.roles.everyone.id,
                    deny: ['CONNECT'],
                }, ],
                position: 0,

            })
            .then(memeberCounter => { db.set(`${message.guild.id}.membercounter`, memeberCounter.id) })
            .catch(console.error);



    }
}