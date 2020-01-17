const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	shortDesc: 'Resumes the paused track.',
	args: false,
	aliases: [],
	category: categories.VOICE,
	run(message, args) {
		const { client } = message;
		const { commands, utils } = client;

		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		const player = client.player.get(message.guild.id)
		const queue = utils.getServerQueue.run(client, message.guild.id)
		if (player.paused)
			player.pause(false)
		else return new MessageEmbed()
			.setTitle(`I'm already playing.`)
		return new MessageEmbed()
			.setTitle(`Resumed ${queue[0].info.title}.`)
	}
}