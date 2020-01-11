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
			.setThumbnail(currentTrack.info.uri.includes("youtube") ? `https://i.ytimg.com/vi/${currentTrack.info.identifier}/hqdefault.jpg` : "lmaogettrolled.jpg")
			.setFooter(`Track requested by ${currentTrack.requester.username}`, currentTrack.requester.avatarURL({ size: 1024 }))
	}
}