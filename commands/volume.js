module.exports = {
	name: 'volume',
	description: 'Changes the volume between 0 to 1000.',
	aliases: ['v'],
	color: 'e63462',
	execute(message, args) {
		if (message.member.voice && message.client.voice.connections.get(message.member.voice.guild.id)) {
			if (args.length != 0 && Number.isInteger(parseInt(args.join(''))) && parseInt(args.join('')) <= 1000 && parseInt(args.join('')) >= 0) {
				let oldVolume = message.client.voice.connections.get(message.member.voice.guild.id).dispatcher.volume //message.client.playing.get(message.member.voice.guild.id).volumer.volume
				message.client.voice.connections.get(message.member.voice.guild.id).dispatcher.setVolume(parseInt(args.join('')) / 100);// message.client.playing.get(message.member.voice.guild.id).volumer.setVolume(parseInt(args.join('')) / 100);
				message.client.utils.get("getVolume").execute(message, oldVolume);
			} else {
				message.client.utils.get("getVolume").execute(message);
			}
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};