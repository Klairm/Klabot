module.exports = {
    name: 'ban',
    description: 'Tag a member and ban them.',
    usage: '-k ban @member',
    execute(message, args) {
        if (!args.length) {
            return message.reply("you didn\'t provide any arguments.");
        }
        if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to ban them!');
        }

        const taggedUser = message.mentions.members.first();
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.reply("you don't have permissions to do that, you idiot.");
        }
        if (!taggedUser.kickable) {
            return message.reply("I can't ban that member");
        } else {

            if (!taggedUser.ban()) {
                message.reply("something went wrong.");
            } else {

                message.reply(`banned  ${taggedUser} succesfully.`);
            }
        }
    },
};
