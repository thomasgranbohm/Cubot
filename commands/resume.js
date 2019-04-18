module.exports = {
	name: 'resume',
	description: 'Resumes the paused song.',
	color: 'e63462',
	execute(message, args) {
        if (message.member.voiceChannel && message.member.voiceChannel.connection) {
			message.member.voiceChannel.connection.dispatcher.resume();
			message.delete().catch(err => err)
        } else {
			return message.reply("you need to join a voice channel to use this command.");
		}
    },
};