const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	shortDesc: 'Returns the currently playing track.',
	args: false,
	aliases: ['np', 'nowPlaying'],
	category: categories.VOICE,
	async run(message, args) {
		const { client } = message;
		const { commands, utils } = client;

		// TODO Remove now embed after the song is finished
		// Also works with skip

		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		let queue = await utils.getServerQueue.run(client, message.guild.id).slice()
		return utils.nowEmbed.run(queue)
	}
}