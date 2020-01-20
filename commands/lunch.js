const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	shortDesc: 'Returns the lunch.',
	// TODO Optional Args array
	// optionalArgs: [
	// 	{ 'arg': "desc" }
	// ],

	// TODO create task with question to create command.
	args: false,
	aliases: ['l', 'food', 'f'],
	category: categories.MISC,
	async run(message, args) {
		const { client } = message;
		const { commands, utils } = client;
		try {
			return await utils.foodEmbed.run();
		} catch (error) {
			throw error;
		}
	}
}