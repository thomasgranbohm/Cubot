const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

const pause = async (message, args) => {
	const { client } = message;
	const { commands, utils } = client;

	let userCheckFail = await utils.checkUserVoice(message);
	if (userCheckFail) return userCheckFail;

	let botCheckFail = await utils.checkBotVoice(message);
	if (botCheckFail) return botCheckFail;

	const player = client.manager.players.get(message.guild.id)
	const queue = utils.getServerQueue(client, message.guild.id)
	if (!player.paused)
		player.pause(true)
	else return new MessageEmbed()
		.setTitle(`I'm already paused.`)
	return new MessageEmbed()
		.setTitle(`Paused ${queue[0].info.title}.`)
}
pause.shortDesc = 'Pauses the playing track.';
pause.args = false;
pause.aliases = ['stop'];
pause.category = categories.VOICE;

module.exports = pause;