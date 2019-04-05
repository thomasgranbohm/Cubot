// const fs = require('fs');
const ytdl = require('ytdl-core');

module.exports = {
	name: 'play',
	description: 'Plays some music of your choice.',
	usage: '[search term]',
	execute(message, args) {
		if (message.member.voiceChannel) {
			if (args.length == 0) return message.reply("you need to send me a link to play.");
			message.member.voiceChannel.join()

			playYoutubeLink(message, args[0]);				
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};

function playYoutubeLink(message, link) {
	if (message.member.voiceChannel.connection.speaking) return message.client.queue.push(link);
	else {
		let dispatcher = message.member.voiceChannel.connection.playStream(ytdl(link, { filter: 'audioonly' }));
		dispatcher.on('end', () => {
			if (message.client.queue.length > 0) {
				playYoutubeLink(message, message.client.queue.shift())
			} else message.member.voiceChannel.leave();
		});
	}
}