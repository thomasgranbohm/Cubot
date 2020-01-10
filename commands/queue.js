const Command = require('./command.js');
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = class queue extends Command {
	constructor() {
		super();

		this.name = 'queue';
		this.usage += `${this.name}`;
		this.description = 'Lists the tracks queued on this server.';
		this.args = false;
		this.aliases = ['q', 'que'];
		this.category = categories.VOICE;
	}
	run = (message, args) => {
		const { client } = message;
		const { commands, utils } = client;

		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;
		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		let queue = utils.getServerQueue.run(client, message.guild.id).slice();
		if (queue.length === 0)
			return 'I\'m not playing anything.'
		let currentlyPlaying = queue.shift()
		let tracks = queue.map(track => {
			return { title: track.info.title, uri: track.info.uri, author: track.info.author };
		});

		//TODO send now playing if queue is 1
		// and send queue with the current track if more than 1

		let toSend = new MessageEmbed()
			.setTitle(`Queue for ${message.guild.name}`)
			.setDescription(`**[Currently playing](${currentlyPlaying.info.uri})**\n - **${currentlyPlaying.info.title}** by ${currentlyPlaying.info.author}`)
			.setFooter(`Track requested by ${currentlyPlaying.requester.username}`, currentlyPlaying.requester.avatarURL({ size: 1024 }))
		// TODO Canvas bar.
		if (queue.length !== 0) {
			toSend
				.addField("**Titles**", tracks.map(track => `\`${tracks.indexOf(track) + 1}.\` [${track.title}](${track.uri})`).join("\n"), true)
				.addField("**Channel**", tracks.map(track => track.author).join('\n'), true)
		} else {
			toSend.setDescription(toSend.description + `\n\nThe queue is empty.`)
		}
		return toSend
	}
}