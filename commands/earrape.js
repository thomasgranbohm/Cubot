const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let earrape = (message, args) => {
	const { client } = message;
	const { commands, utils } = client;

	return utils.changeEqualizer(message, client.equalizers.earrape);
};

earrape.shortDesc = 'You know what you want.';
earrape.args = false;
earrape.aliases = ['ear'];
earrape.category = categories.VOICE;

module.exports = earrape;