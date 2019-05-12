module.exports = {
	name: 'volume',
	description: 'Changes the volume between 0 to 1000.',
	aliases: ['v'],
	color: 'e63462',
	execute(message, args) {
		if (message.member.voiceChannel && message.member.voiceChannel.connection && message.member.voiceChannel.connection.speaking) {
			if (args.length != 0 && Number.isInteger(parseInt(args.join(''))) && parseInt(args.join('')) <= 1000 && parseInt(args.join('')) >= 0) {
				let oldVolume = message.member.voiceChannel.connection.dispatcher.volume //message.client.playing.get(message.member.voiceChannel.id).volumer.volume
				message.member.voiceChannel.connection.dispatcher.setVolume(parseInt(args.join('')) / 100);// message.client.playing.get(message.member.voiceChannel.id).volumer.setVolume(parseInt(args.join('')) / 100);
				message.client.utils.get("getVolume").execute(message, oldVolume);
			} else {
				message.client.utils.get("getVolume").execute(message);
			}
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};