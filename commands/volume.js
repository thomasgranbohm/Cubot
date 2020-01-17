const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	shortDesc: 'Changes the volume of the playing track.',
	longDesc: 'Returns the current volume if no args included.',
	args: false,
	aliases: ['v', 'vol'],
	category: categories.VOICE,
	run(message, args) {
		const { client } = message;
		const { commands, utils } = client;

		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;
		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		const player = client.player.get(message.guild.id);
		const volume = player.state.volume;

		let toSend = new MessageEmbed()

		if (args) {
			const newVolume = parseInt(args.split(" ")[0])
			if (newVolume > 200 || newVolume < 0)
				return 'The volume cannot to be above 200 or below 0.';

			player.volume(newVolume)

			toSend.setTitle('Changed volume')
				.setDescription(`From ${volume} to ${newVolume}!`)
		} else {
			toSend.setTitle('Current volume')
				.setDescription(`${volume}%`)
		}
		return toSend;
	}
}