module.exports = {
	name: 'pause',
	description: 'Pauses the playing song.',
	color: 'e63462',
	execute(message, args) {
		if (message.member.voiceChannel && message.member.voiceChannel.connection.speaking) {
			message.member.voiceChannel.connection.dispatcher.pause();
			message.delete().catch(err => err)
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};