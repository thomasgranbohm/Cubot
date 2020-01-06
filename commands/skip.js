const Command = require("./command.js");
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = class Skip extends Command {
	constructor() {
		super();

		this.name = 'skip';
		this.usage += `${this.name}`;
		this.description = 'Skips the playing track.';
		this.args = false;
		this.aliases = ['s'];
		this.category = categories.VOICE;
	}

	run = async (message, args) => {
		const { client } = message;
		const { commands, utils } = client;
		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		await client.player.get(message.guild.id).stop();
		let queue = utils.getServerQueue.run(client, message.guild.id).slice();
		console.general(`Skipped track ?. New queue length for ?: ?`, queue.shift().info.title, message.guild.name, queue.length);
		if (queue > 0)
			return commands.now.run(message);
		return null;
	}
}