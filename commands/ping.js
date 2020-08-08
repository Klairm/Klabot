module.exports = {
    name: 'ping',
    description: 'Check if the bot is alive and can reply',
    execute(message) {
        message.channel.send('Pong.');
    },
};