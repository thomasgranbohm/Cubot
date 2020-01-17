const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	shortDesc: 'Turns bass boosting on or off.',
	args: false,
	aliases: ['bass', 'eq'],
	category: categories.VOICE,

	async run(message, args) {
		const { client } = message;
		const { commands, utils } = client;

		return utils.changeEqualizer.run(message, client.equalizers.bassboost)
	}
}