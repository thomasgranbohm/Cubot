const Command = require('./command.js');
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = class play extends Command {
	constructor() {
		super();

		this.name = 'play';
		this.usage += `${this.name} <query>`;
		this.description = 'Plays music with an added search query';
		this.args = true;
		this.aliases = ['p'];
		this.category = categories.VOICE;
	}
	run = async (message, args) => {
		const { client } = message;
		const { commands, utils } = client;
		let isFirst = false;
		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		if (!args)
			return "You didn't send me anything to play."

		await utils.initiatePlayer.run(client, message.guild.id);

		let queue = await utils.getServerQueue.run(client, message.guild.id);
		let track = await utils.getAudio.run(args.startsWith('http') ? args : `ytsearch:${args}`)

		if (!track[0]) return String('No results found.');
		if (!queue[0]) isFirst = true;
		track.requester = message.author
		queue.push(track[0]);

		if (isFirst) {
			const player = await client.player.join({
				guild: message.guild.id,
				channel: message.member.voice.channelID,
				host: utils.getIdealHost.run(client)
			})
			player.on('leave', () => delete client.servers[message.guild.id])
			return await utils.queueLoop.run(client, message, queue, player);
		} else {
			client.servers[message.guild.id].queue = queue
			console.general(`Added ? to ?'s queue. New queue length for ?: ?`, track[0].info.title, message.guild.name, message.guild.name, queue.length)
			return new MessageEmbed()
				.setTitle('Added to queue')
				.setDescription(`**${track[0].info.title}** by ${track[0].info.author}\n\nThere ${(queue.length - 1) > 1 ? `are ${queue.length - 1} tracks` : `is ${queue.length - 1} track`} before it.`)
				.setThumbnail(`https://i.ytimg.com/vi/${track[0].info.identifier}/hqdefault.jpg`)
		}
	}
}
