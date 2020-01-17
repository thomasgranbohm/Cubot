const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	shortDesc: 'Skips the playing track.',
	args: false,
	aliases: ['s'],
	category: categories.VOICE,
	async run(message, args) {
		const { client } = message;
		const { commands, utils } = client;
		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		await client.player.get(message.guild.id).stop()
		let queue = await utils.getServerQueue.run(client, message.guild.id).slice();

		console.general('Skipped track ?. New queue length for ?: ?', queue.shift().info.title, message.guild.name, queue.length);
		if (queue.length > 0)
			return utils.nowEmbed.run(queue);
		return null;
	}
}