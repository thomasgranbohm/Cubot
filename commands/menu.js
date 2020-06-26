const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let menu = async (message, args) => {
	const { client } = message;
	const { commands, utils } = client;
	try {
		return await utils.lunchEmbed(true);
	} catch (error) {
		throw error;
	}
}
menu.shortDesc = 'Returns the week\'s menu';
menu.args = false;
menu.aliases = ['m'];
menu.category = categories.MISC;
menu.allowedChannels = ['text', 'dm']

module.exports = menu;
