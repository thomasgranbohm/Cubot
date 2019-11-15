const Discord = require('discord.js');

module.exports = {
	name: 'skip',
	description: 'Skip the current playing song.',
	color: '78fecf',
	execute(message, args) {
		if (message.member.voice) {
			let connection = message.client.voice.connections.get(message.member.voice.guild.id)
			if (connection && connection.dispatcher) {
				if (args.length == 0) {
					connection.dispatcher.end();
				}
			} else {
				message.reply('I\'m not currently playing anything. You can use `play` to make me play something!')
			}
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};