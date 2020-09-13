const fs = require('fs');
const db = require('quick.db');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
    console.log('Ready!');
    client.user.setPresence({ activity: { name: "-k help", type: "PLAYING", status: "online" } }).catch(console.error);

});

client.on('guildMemberUpdate', async (oldUser, newUser) => {
    if (!db.has(`${newUser.guild.id}.nickname-protection`, 'on')) return;
    var regex = /^[A-Za-z0-9 ]/
    if (!regex.test(newUser.nickname)) {
        if (oldUser.nickname == null) {
            newUser.setNickname(oldUser.user.username);
        } else {
            newUser.setNickname(oldUser.nickname);
        }

    }
});


client.on('messageDelete', async (message) => {
    if (message.partial) return;
    if (!db.has(`${message.guild.id}.logs`)) return;
    const deletedMessage = {
        author: {
            name: 'Klabot',
            icon_url: 'attachment://liK.png',
        },
        fields: [{
            name: `Message author ${message.author.username}`,

        }],
        description: message.content,
    };

    message.guild.channels.cache.get(db.get(`${message.guild.id}.logs`)).send({ embed: deletedMessage });
});


client.on('messageReactionAdd', async (reaction, user) => {

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            return console.log('Something went wrong  fetching the message: ', error);

        }
    }

    // Check if the emoji reaction that has been added is the :pill: emoji, if so create an embed with user information and send it to a channel
    if (reaction.emoji.name == "💊") {
        if (!db.has(`${reaction.message.guild.id}.favmessage`)) return;
        // Thanks LilaQ 
        const favMessage = {
            author: {
                name: reaction.message.author.username,
                icon_url: reaction.message.author.displayAvatarURL()
            },
            fields: [{
                name: "#" + reaction.message.channel.name,
                value: "[jump]" + "(" + reaction.message.url + ")",
                inline: false
            }],

            url: reaction.message.url,
            description: reaction.message.content,
        };

        reaction.message.guild.channels.cache.get(db.get(`${reaction.message.guild.id}.favmessage`)).send({ embed: favMessage });
    }
});


client.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (newMember.member.user.bot) return;
    if (!db.has(`${newMember.guild.id}.bell`)) return;
    if (!db.has(`${newMember.guild.id}.door`)) return;

    try {
        var bell = await client.channels.cache.get(db.get(`${newMember.guild.id}.bell`)).join();
        //client.channels.cache.get(db.get(`${newMember.guild.id}.bell`)).overwritePermissions([{id:newMember.guild.roles.everyone,deny: 'VIEW_CHANNEL',}]);
        var door = db.get(`${newMember.guild.id}.door`);
        let newUserChannel = newMember.channel;
        if (newUserChannel == null && oldMember.channel == door) console.log(`${newMember.member.displayName} left from the door`);
        if (newUserChannel == door) {
            var date = new Date();
            console.log(`${newMember.member.displayName} entered to the door that has channelID: ${newUserChannel} on  the guild: ${newMember.member.guild.name}, at time: ${date} `);
            console.log(`Bell ID -> ${bell.channel.id}`);
            console.log(`Door ID -> ${door}`);
            bell.play("bell.mp3");

        }
    } catch (error) {
        return console.log("Something went wrong,", error);
    }



});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    try {
        client.commands.get(commandName).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.on('error', async (error) => {
    console.log("An error has ocurred", error);
})

client.login(token);