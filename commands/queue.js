const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'List all songs in the queue.',
	aliases: ['q', 'que'],
	color: "ee7674",
	execute(message, args) {
		if (message.member.voice && message.client.queue.has(message.member.voice.guild.id) && message.client.playing.get(message.member.voice.guild.id) != undefined) {
			let embed = new Discord.MessageEmbed()
				.setAuthor("Currently playing:", message.client.musicIcon, message.client.playing.get(message.member.voice.guild.id).link)
				.attachFiles([{ attachment: message.client.playing.get(message.member.voice.guild.id).thumbnail, name: "thumbnail.png" }])
				.setThumbnail(`attachment://thumbnail.png`)
				.setTitle(`**${message.client.playing.get(message.member.voice.guild.id).title}**`)
				.setDescription(`by **${message.client.playing.get(message.member.voice.guild.id).channel.toString()}**` +
					(message.client.queue.get(message.member.voice.guild.id).length > 0 ?
						'\n\n**Next up:**\n' + message.client.queue.get(message.member.voice.guild.id).map(item => {
							return `**${message.client.queue.get(message.member.voice.guild.id).indexOf(item) + 1}.** ${item.title} by ${item.channel}`
						}).join('\n\t')
						: "")
				)
				.setFooter(`Requested by ${message.client.playing.get(message.member.voice.guild.id).requester.username}`, message.client.playing.get(message.member.voice.guild.id).requester.avatarURL)
				.setColor(this.color)

			message.channel.send({ embed })

		} else {
			message.reply('I\'m not currently playing anything. You can use `play` to make me play something!')
		}
	},
};