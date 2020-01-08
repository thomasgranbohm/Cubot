const Command = require('./command.js');
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = class volume extends Command {
	constructor() {
		super();

		this.name = 'volume';
		this.usage += `${this.name}`;
		this.description = 'Changes the volume of the playing track.';
		this.args = false;
		this.aliases = ['v', 'vol'];
		this.category = categories.VOICE;
	}
	run = (message, args) => {
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