const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'List all songs in the queue.',
	aliases: ['q', 'que'],
	color: "ee7674",
	execute(message, args) {
		if (message.member.voiceChannel && message.client.queue.has(message.member.voiceChannel.id) && message.client.playing.get(message.member.voiceChannel.id) != undefined) {
			let embed = new Discord.RichEmbed()
				.setAuthor("Currently playing:", message.client.icon, message.client.playing.get(message.member.voiceChannel.id).link)
				.attachFiles([{ attachment: message.client.playing.get(message.member.voiceChannel.id).thumbnail, name: "thumbnail.png" }])
				.setThumbnail(`attachment://thumbnail.png`)
				.setTitle(`**${message.client.playing.get(message.member.voiceChannel.id).title}**`)
				.setDescription(`by **${message.client.playing.get(message.member.voiceChannel.id).channel.toString()}**` +
					(message.client.queue.get(message.member.voiceChannel.id).length > 0 ?
						'\n\n**Next up:**\n' + message.client.queue.get(message.member.voiceChannel.id).map(item => {
							return `**${message.client.queue.get(message.member.voiceChannel.id).indexOf(item) + 1}.** ${item.title} by ${item.channel}`
						}).join('\n\t')
						: "")
				)
				.setFooter(`Requested by ${message.client.playing.get(message.member.voiceChannel.id).requester.username}`, message.client.playing.get(message.member.voiceChannel.id).requester.avatarURL)
				.setColor(this.color)

			message.channel.send({ embed })
				.then(sentMessage => {
					sentMessage.delete(15000)
				});
		} else {
			message.reply('I\'m not currently playing anything. You can use `play` to make me play something!')
		}
	},
};