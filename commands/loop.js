const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	usage: '',
	shortDesc: 'Toggles the loop function',
	args: false,
	aliases: ['repeat'],
	category: categories.MISC,
	async run(message, args) {
		const { client } = message;
		const { commands, utils } = client;

		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;
		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		const player = client.player.get(message.guild.id)
		player.loop = !player.loop;
		return new MessageEmbed()
			.setTitle(player.loop ? `Playing on repeat :repeat:` : `Playing like a normal person :speaker:`)
	}
}