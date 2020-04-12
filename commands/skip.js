const { categories } = require('../config.json');

let skip = async (message, args) => {
	const { client } = message;
	const { commands, utils } = client;
	let userCheckFail = await utils.checkUserVoice(message);
	if (userCheckFail) return userCheckFail;

	let botCheckFail = await utils.checkBotVoice(message);
	if (botCheckFail) return botCheckFail;

	const player = client.manager.players.get(message.guild.id);
	if (player.loop) player.loop = !player.loop;
	await player.stop();
	let queue = utils.getServerQueue(client, message.guild.id).slice();

	console.general(
		'Skipped track ?. New queue length for ?: ?',
		queue.shift().info.title,
		message.guild.name,
		queue.length,
	);
	if (queue.length > 0) return utils.nowEmbed(queue);
	return null;
};
skip.shortDesc = 'Skips the playing track.';
skip.args = false;
skip.aliases = ['s'];
skip.category = categories.VOICE;

module.exports = skip;
