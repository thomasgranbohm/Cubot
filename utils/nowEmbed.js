const { MessageEmbed } = require('discord.js')

module.exports = nowEmbed = async (queue) => {
	let currentTrack = queue[0];

	return new MessageEmbed()
		.setTitle("Now playing")
		.setDescription(`**[${currentTrack.info.title}](${currentTrack.info.uri})** by ${currentTrack.info.author}\n`)
		.attachFiles([
			{ attachment: currentTrack.thumbnail, name: `thumbnail.jpg` },
		])
		.setThumbnail(`attachment://thumbnail.jpg`)
		.setFooter(`Track requested by ${currentTrack.requester.username}`, currentTrack.requester.avatarURL({ size: 1024 }))
}
