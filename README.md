# Klabot ![alt text](https://i.imgur.com/cbEmj2G.png)

Klabot is a really useless Discord Bot created using DiscordJS and quickDB

# Requirements

- NodeJS v16.9 or higher
- DiscordJSv14 `npm install discord.js @discordjs/voice sodium`
- QuickDB `npm install quick.db`
- Discord-Music-Player `npm install discord-music-player ` + `npm install @discordjs/opus`

You also need a file named `config.json` with your token from the [Discord Developer Portal](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot),the file should look like this:

note: clientId and guildId just used for register the commands with the commands.js script, for more info check out : https://discordjs.guide/interactions/slash-commands.html#registering-slash-commands",

```json
{
  "token": "YOUR_TOKEN_HERE",
  "clientId": "CLIENT_ID_HERE",
  "guildId": "GUILD_ID_HERE"
}
```

For the assets you need to place them on a folder called assets, name the image as liK.png, or change the name on the source.

# Usage

You need to register the slash commands to the client, for more info check the guide [Registering slash commands](https://discordjs.guide/interactions/registering-slash-commands.html#guild-commands)

## "Bell" System

Klabot has a system that will play an audio on A voice channel when someone joins B voice channel, also, in the text channel from channel B, a message will apparear to move the user from channel A to channel B
For use this, Klabot needs 2 voice channels: Channel where the bell audio will be played ( A channel ),
and the channel where the bot will be looking if someone is in ( B channel)

For set this channels you can use the bell and door commands, example:

```
/set door #voiceChannel
/set bell #voiceChannel

```

If you want to update the channel ID you can just run the door/bell command again.

You don't need to provide the channel ID in this case, just provide what type of channel you want to remove (bell or door).

## Favorite messages

Klabot provides a way to send your favorite messages to a specified channel, to do this you need to specify the channel where all the favorite messages will be sent.
You can do that with the command `/set favmessage #channel`
Example:

```
 /set favmessage #channel
```

The favorite message are those that have an reaction with the pill emoji :pill:

## Removing channels ID

If you want to remove the channels ID, you can use the deleteid command, example:

```
/unset #channel
```

This will delete the channel ID from the quick.db database.
note: the '#' is no needed, it's just an example

## Music Player

You can reproduce music and YouTube videos with the player commands like: `/play`, `/skip`, `/resume`, `/stop`, `/pause`.

## TODO:

- Move from quickDB to MongoDB
- Handle all events in individual files

 <p align=center>
 <img src="https://i.imgur.com/b6aCKA2.png"/>
 </p>
