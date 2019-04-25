module.exports = {
    name: 'volume',
    description: 'Changes the volume between 0 to 1000.',
    aliases: ['v'],
    color: 'e63462',
    execute(message, args) {
        if (message.member.voiceChannel && message.member.voiceChannel.connection && message.member.voiceChannel.connection.speaking) {
            const { dispatcher } = message.member.voiceChannel.connection;
            if (args.length != 0 && Number.isInteger(parseInt(args.join(''))) && parseInt(args.join('')) <= 1000 && parseInt(args.join('')) >= 0) {
                dispatcher.setVolume(parseInt(args.join('')) / 100);
            } else {
                message.client.utils.get("getVolume").execute(message);

                message.delete(1000).catch(err => err)
            }
        } else {
            return message.reply("you need to join a voice channel to use this command.");
        }
    },
};