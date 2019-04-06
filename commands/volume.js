module.exports = {
	name: 'volume',
	description: 'Changes the volume.',
	execute(message, args) {
        if (message.member.voiceChannel && message.member.voiceChannel.connection.speaking) {
            if (Number.isInteger(parseInt(args.join(''))) && parseInt(args.join('')) <= 1000 && parseInt(args.join('')) >= 0) {
                message.member.voiceChannel.connection.dispatcher.setVolume(parseInt(args.join('')) / 100);
            }
        } else {
			return message.reply("you need to join a voice channel to use this command.");
		}
    },
};