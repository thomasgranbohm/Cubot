const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	shortDesc: 'Returns the week\'s menu',
	args: false,
	aliases: ['m'],
	category: categories.MISC,
	async run(message, args) {
		const { client } = message;
		const { commands, utils } = client;
		try {
			return await utils.lunchEmbed.run(true);
		} catch (error) {
			throw error;
		}
	}
}