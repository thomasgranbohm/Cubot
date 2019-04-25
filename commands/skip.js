const Discord = require('discord.js');

module.exports = {
	name: 'skip',
	description: 'Skip the current playing song.',
	color: '78fecf',
	execute(message, args) {
		if (message.member.voiceChannel) {
			if (message.member.voiceChannel.connection && message.member.voiceChannel.connection.dispatcher) {
				if (args.length != 0) {

				} else {
					message.member.voiceChannel.connection.dispatcher.end();
					message.delete().catch(err => err)
				}
			} else {
				message.reply('I\'m not currently playing anything. You can use `play` to make me play something!')
			}
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};