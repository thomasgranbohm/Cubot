const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'List all songs in the queue.',
	execute(message, args) {
		let embed = new Discord.RichEmbed();

		if (message.member.voiceChannel.connection.speaking) {
			embed.setAuthor("Currently playing:")
				.setTitle(`${message.client.playing.title} by ${message.client.playing.channel}`)
				.setThumbnail(message.client.playing.thumbnail)
				.setDescription(
					`Next up:\n${message.client.queue.map(item => {
						`*${message.client.queue.indexOf(item) + 1}. ${item.title}* by ${item.channel}`
					})}`
				)
				.setFooter(`Currently track requested by ${message.client.playing.requester.username}` , "https://i.imgur.com/QHHu3vn.gif");

			message.channel.send({ embed });
		}
	},
};