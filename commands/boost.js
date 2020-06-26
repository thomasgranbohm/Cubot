const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let boost = (message, args) => {
	const { client } = message;
	const { commands, utils } = client;

	return utils.changeEqualizer(message, client.equalizers.bassboost);
};
boost.shortDesc = 'Turns bass boosting on or off.';
boost.args = false;
boost.aliases = ['bass', 'eq'];
boost.category = categories.VOICE;
boost.allowedChannels = ['text']

module.exports = boost;