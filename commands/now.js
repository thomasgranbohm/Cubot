const Command = require('./command.js');
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js');

module.exports = class now extends Command {
	constructor() {
		super();

		this.name = 'now';
		this.usage += `${this.name}`;
		this.description = 'Returns the currently playing track.';
		this.args = false;
		this.aliases = ['np', 'nowPlaying'];
		this.category = categories.VOICE;
	}
	run = async (message, args) => {
		const { client } = message;
		const { commands, utils } = client;

		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		let queue = await utils.getServerQueue.run(client, message.guild.id)
		let currentTrack = queue[0];
		return new MessageEmbed()
			.setTitle("Now playing")
			.setDescription(`**[${currentTrack.info.title}](${currentTrack.info.uri})** by ${currentTrack.info.author}\n${queue.length > 1 ? `\n\n**Next up**\n${queue[1].info.title}` : ''}`)
			.setThumbnail(currentTrack.info.uri.includes("youtube") ? `https://i.ytimg.com/vi/${currentTrack.info.identifier}/hqdefault.jpg` : "lmaogettrolled.jpg")
			.setFooter(`Track requested by ${message.author.username}`, message.author.avatarURL({ size: 1024 }))
	}
}