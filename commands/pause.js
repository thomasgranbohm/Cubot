module.exports = {
	name: 'pause',
	description: 'Pauses the playing song.',
	execute(message, args) {
        if (message.member.voiceChannel && message.member.voiceChannel.connection.speaking) {
            message.member.voiceChannel.connection.dispatcher.pause();
        } else {
			return message.reply("you need to join a voice channel to use this command.");
		}
    },
};