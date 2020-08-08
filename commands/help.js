const Discord = require('discord.js');
const { prefix } = require('../config.json');
const file = new Discord.MessageAttachment('assets/liK.png');
module.exports = {

    name: "help",
    description: "Provides command informations",

    execute(message, args) {
        const { commands } = message.client;
        const data = [];
        if (!args.length) {
            data.push(commands.map(command => command.name).join(', '));
            const noArgsEmbed = {
                title: 'Klabot help guide',
                description: `\nYou can send \`${prefix}help <command name>\` to get info on a specific command!`,
                author: {
                    name: 'Klabot',
                    icon_url: 'attachment://liK.png',
                },
                thumbnail: {
                    url: 'attachment://liK.png',
                },
                fields: [{
                    name: "List of all Klabot commands:",
                    value: data
                }],
                timestamp: new Date(),
                footer: {
                    text: 'Klabot',
                    icon_url: 'attachment://liK.png'
                }
            };
            message.channel.send({ files: [file], embed: noArgsEmbed });
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name);
            if (!command) {
                return message.reply("that\'s not a valid command.");
            }
            if (command.description) {
                var description = `Description: ${command.description}`;
            } else {
                var description = `No description avaible`;
            }
            if (command.usage) {
                var usage = `Usage: ${command.usage}`;
            } else {
                var usage = `No usage avaible`;
            }

            const helpCommand = {
                title: 'Klabot help guide',
                author: {
                    name: 'Klabot',
                    icon_url: 'attachment://liK.png',
                },
                thumbnail: {
                    url: 'attachment://liK.png',
                },
                fields: [{
                    name: command.name,
                    value: description + "\n" + usage
                }],
                timestamp: new Date(),
                footer: {
                    text: 'Klabot',
                    icon_url: 'attachment://liK.png'
                },
            };
            message.channel.send({ files: [file], embed: helpCommand });
        }
    },
};