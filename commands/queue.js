const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'List all songs in the queue.',
	aliases: ['q', 'que'],
    color: "ee7674",
	execute(message, args) {
		if (message.member.voiceChannel.connection && message.member.voiceChannel.connection.speaking) {
			let embed = new Discord.RichEmbed()
				.setAuthor("Currently playing:", message.client.icon, message.client.playing.link)
				.attachFiles([{ attachment: message.client.playing.thumbnail, name: message.client.playing.thumbnailName }])
				.setThumbnail(`attachment://${message.client.playing.thumbnailName}`)
				.setTitle(`**${message.client.playing.title}**`)
				.setDescription(`by **${message.client.playing.channel.toString()}**` +
					(message.client.queue.length > 0 ?
						'\n\n**Next up:**\n' + message.client.queue.map(item => {
							return `**${message.client.queue.indexOf(item) + 1}.** ${item.title} by ${item.channel}`
						}).join('\n\t')
						: "")
				)
				.setFooter(`Requested by ${message.client.playing.requester.username}`, message.client.playing.requester.avatarURL)
				.setColor(this.color)

			message.channel.send({ embed });
			message.delete().catch(err => err)
		} else {
			message.reply('I\'m not currently playing anything. You can use `play` to make me play something!')
		}
	},
};