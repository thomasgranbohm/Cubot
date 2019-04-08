const Discord = require('discord.js');

module.exports = {
	name: 'skip',
	description: 'Skip the current playing song.',
	execute(message, args) {
        if (message.member.voiceChannel) {
            if (args.length != 0) {
				
			} else {
				message.member.voiceChannel.connection.dispatcher.end();
			}
        } else {
			return message.reply("you need to join a voice channel to use this command.");
		}
    },
};