const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let resume = async (message, args) => {
	const { client } = message;
	const { commands, utils } = client;

	let userCheckFail = await utils.checkUserVoice(message);
	if (userCheckFail) return userCheckFail;

	let botCheckFail = await utils.checkBotVoice(message);
	if (botCheckFail) return botCheckFail;

	const player = client.manager.players.get(message.guild.id);
	const queue = utils.getServerQueue(client, message.guild.id);
	if (player.paused) player.pause(false);
	else return new MessageEmbed().setTitle(`I'm already playing.`);
	return new MessageEmbed().setTitle(`Resumed ${queue[0].info.title}.`);
};
resume.shortDesc = 'Resumes the paused track.';
resume.args = false;
resume.aliases = [];
resume.category = categories.VOICE;

module.exports = resume;