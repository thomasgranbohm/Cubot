const Command = require('./command.js');
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js');

module.exports = class earrape extends Command {
	constructor() {
		super();

		this.name = 'earrape';
		this.usage += `${this.name}`;
		this.description = 'You know what you want.';
		this.args = false;
		this.aliases = ['ear'];
		this.category = categories.VOICE;
	}
	run = async (message, args) => {
		const { client } = message;
		const { commands, utils } = client;
		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		const player = client.player.get(message.guild.id)

		let boosted = client.servers[message.guild.id].boost;
		if (!boosted) {
			await player
				.volume(300)
				.setEQ([{ "band": 0, "gain": 0.8 }, { "band": 1, "gain": 0.8 }, { "band": 2, "gain": 0.8 }, { "band": 3, "gain": 0.8 }, { "band": 4, "gain": 0.8 }, { "band": 5, "gain": 0.8 }, { "band": 6, "gain": 0.8 }, { "band": 7, "gain": 0.8 }, { "band": 8, "gain": -0.2 }, { "band": 9, "gain": -0.2 }, { "band": 10, "gain": -0.2 }, { "band": 11, "gain": -0.2 }, { "band": 12, "gain": -0.2 }, { "band": 13, "gain": -0.2 }, { "band": 14, "gain": -0.2 }]);
		}
		else
			await player
				.volume(100)
				.setEQ([{ "band": 0, "gain": 0.0 }, { "band": 1, "gain": 0.0 }, { "band": 2, "gain": 0.0 }, { "band": 3, "gain": 0.0 }, { "band": 4, "gain": 0.0 }, { "band": 5, "gain": 0.0 }, { "band": 6, "gain": 0.0 }, { "band": 7, "gain": 0.0 }, { "band": 8, "gain": 0.0 }, { "band": 9, "gain": 0.0 }, { "band": 10, "gain": 0.0 }, { "band": 11, "gain": 0.0 }, { "band": 12, "gain": 0.0 }, { "band": 13, "gain": 0.0 }, { "band": 14, "gain": 0.0 }]);

		client.servers[message.guild.id].boost = !boosted
		return `Changing boosted to: ${!boosted}`;
	}
}