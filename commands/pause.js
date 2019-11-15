module.exports = {
	name: 'pause',
	description: 'Pauses the playing song.',
	color: 'e63462',
	execute(message, args) {
		if (message.member.voice && message.member.voice.connection.speaking) {
			message.member.voice.connection.dispatcher.pause();
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};