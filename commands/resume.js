module.exports = {
	name: 'resume',
	description: 'Resumes the paused song.',
	execute(message, args) {
        if (message.member.voiceChannel && message.member.voiceChannel.connection) {
            message.member.voiceChannel.connection.dispatcher.resume();
        } else {
			return message.reply("you need to join a voice channel to use this command.");
		}
    },
};