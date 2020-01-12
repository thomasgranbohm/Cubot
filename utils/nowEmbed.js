const Util = require('./util.js');
const { MessageEmbed } = require('discord.js')
module.exports = class nowEmbed extends Util {
	constructor() {
		super();

		this.name = 'nowEmbed';
	}
	run = (queue) => {
		let currentTrack = queue[0];
		return new MessageEmbed()
			.setTitle("Now playing")
			.setDescription(`**[${currentTrack.info.title}](${currentTrack.info.uri})** by ${currentTrack.info.author}\n${queue.length > 1 ? `\n\n**Next up**\n${queue[1].info.title}` : ''}`)
			.attachFiles([
				{ attachment: currentTrack.thumbnail, name: `thumbnail.jpg` }
			])
			.setThumbnail(`attachment://thumbnail.jpg`)
			.setFooter(`Track requested by ${currentTrack.requester.username}`, currentTrack.requester.avatarURL({ size: 1024 }))
	}
}