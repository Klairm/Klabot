# Klabot  ![alt text](https://i.imgur.com/cbEmj2G.png)

Klabot is a really useless Discord Bot created using DiscordJS and quickDB


# Requirements
  - NodeJS v12
  - DiscordJS `npm install discord.js`
  - QuickDB   `npm install quick.db`
 
 You also need a file named `config.json` with your token from the [Discord Developer Portal](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot), also you can edit the prefix there, the file should look like this:
 ```json
 {
	"prefix": "-k ",
	"token": "YOUR_TOKEN_HERE"
}
```
# Usage 
You can see a list of the commands using the help command `-k help`

## "Bell" System
Klabot has a system that will play an audio on A voice channel when someone joins B voice channel, at the moment is not really useless, but in a future commands to 
allow users join A voice channel  if it's unlocked.
For use this, Klabot needs 2 voice channels: Channel where the .mp3 audio will be played ( A channel ),
                                             and the channel where the bot will be looking if someone is in ( B channel)
                                             
For set this channels you can use the bell and door commands, example:
 ```
 -k door 692785363927695460
 -k bell 671100267592286220
 ```
 If you want to update the channel ID you can just run the door/bell command again.
 
 If you want to remove the channels ID, you can use the deleteid command, example:
 ```
 -k deleteid bell
 -k deleteid door
 ```
 You don't need to provide the channel ID in this case, just provide what type of channel you want to remove (bell or door). 
 
 ## TODO:
 - Add a events creation system, so you can schedule reunions, game times, anything with your friends.
 - Add a lock and unlock for voice channels making the bell system more useful.
 - Add a WebHook for RSS.
 
 
 
 <p align=center>
 <img src="https://i.imgur.com/b6aCKA2.png"/>
 </p>
