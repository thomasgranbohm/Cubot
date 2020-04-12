const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let volume = async (message, args) => {
	const { client } = message;
	const { commands, utils } = client;

	let userCheckFail = await utils.checkUserVoice(message);
	if (userCheckFail) return userCheckFail;
	let botCheckFail = await utils.checkBotVoice(message);
	if (botCheckFail) return botCheckFail;

	const player = client.manager.players.get(message.guild.id);
	const volume = player.state.volume;

	let toSend = new MessageEmbed();

	if (args.length > 0) {
		const newVolume = parseInt(args[0]);
		if (newVolume > 200 || newVolume < 0)
			return 'The volume cannot to be above 200 or below 0.';

		player.volume(newVolume);

		toSend
			.setTitle('Changed volume')
			.setDescription(`From ${volume} to ${newVolume}!`);
	} else {
		toSend.setTitle('Current volume').setDescription(`${volume}%`);
	}
	return toSend;
};
volume.shortDesc = 'Changes the volume of the playing track.';
volume.longDesc = 'Returns the current volume if no args included.';
volume.args = false;
volume.aliases = ['v', 'vol'];
volume.category = categories.VOICE;
volume.usage = `<volume>`

module.exports = volume;
