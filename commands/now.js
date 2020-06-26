const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let now = async (message, args) => {
	const { client } = message;
	const { commands, utils } = client;

	// TODO Remove now embed after the song is finished
	// Also works with skip

	let userCheckFail = await utils.checkUserVoice(message);
	if (userCheckFail) return userCheckFail;

	let botCheckFail = await utils.checkBotVoice(message);
	if (botCheckFail) return botCheckFail;

	let queue = utils.getServerQueue(client, message.guild.id).slice()
	return utils.nowEmbed(queue)
}
now.shortDesc = 'Returns the currently playing track.';
now.args = false;
now.aliases = ['np', 'nowPlaying'];
now.category = categories.VOICE;
now.allowedChannels = ['text']

module.exports = now;