module.exports = {
	name: 'resume',
	description: 'Resumes the paused song.',
	color: 'e63462',
	execute(message, args) {
		if (message.member.voice && message.member.voice.connection) {
			message.member.voice.connection.dispatcher.resume();
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};