module.exports = {
    name: 'volume',
    description: 'Changes the volume between 0 to 1000. ',
	color: 'e63462',
    execute(message, args) {
        if (message.member.voiceChannel && message.member.voiceChannel.connection.speaking) {
            const { dispatcher } = message.member.voiceChannel.connection;
            if (args.length != 0 && Number.isInteger(parseInt(args.join(''))) && parseInt(args.join('')) <= 1000 && parseInt(args.join('')) >= 0) {
                // message.reply(`changed volume from ${dispatcher.volume * 100} to ${parseInt(args.join(''))}!`)
                dispatcher.setVolume(parseInt(args.join('')) / 100);
            } else {
                message.channel.reply(`the current volume is ${dispatcher.volume * 100}%!`)
            }
        } else {
            return message.reply("you need to join a voice channel to use this command.");
        }
    },
};