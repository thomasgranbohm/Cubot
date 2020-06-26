const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let loop = async (message, args) => {
	const { client } = message;
	const { commands, utils } = client;

	let userCheckFail = await utils.checkUserVoice(message);
	if (userCheckFail) return userCheckFail;
	let botCheckFail = await utils.checkBotVoice(message);
	if (botCheckFail) return botCheckFail;

	const player = client.manager.players.get(message.guild.id)
	player.loop = !player.loop;
	return new MessageEmbed()
		.setTitle(player.loop ? `Playing on repeat :repeat:` : `Playing like a normal person :speaker:`)
}
loop.usage = '';
loop.shortDesc = 'Toggles the loop function';
loop.args = false;
loop.aliases = ['repeat', 'lööp'];
loop.category = categories.VOICE;
loop.allowedChannels = ['text']

module.exports = loop;