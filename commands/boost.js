const Command = require("./command.js");
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = class Boost extends Command {
	constructor() {
		super();


		// TODO how much boost? Presets?
		this.name = 'boost';
		this.usage += `${this.name}`;
		this.description = 'Turns bass boosting on or off.';
		this.args = false;
		this.aliases = ['bass', 'eq'];
		this.category = categories.VOICE;
	}

	run = async (message, args) => {
		const { client } = message;
		const { commands, utils } = client;
		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		const player = client.player.get(message.guild.id)
		if (!player)
			return "I'm not playing anything."

		let boosted = client.servers[message.guild.id].boost;
		if (!boosted)
			await player.setEQ([
				{ "band": 0, "gain": 0.2 },
				{ "band": 1, "gain": 0.15 },
				{ "band": 2, "gain": 0.1 },
				{ "band": 3, "gain": 0.05 },
				{ "band": 4, "gain": 0.0 },
				{ "band": 5, "gain": -0.05 },
				{ "band": 6, "gain": -0.1 },
				{ "band": 7, "gain": -0.1 },
				{ "band": 8, "gain": -0.1 },
				{ "band": 9, "gain": -0.1 },
				{ "band": 10, "gain": -0.1 },
				{ "band": 11, "gain": -0.1 },
				{ "band": 12, "gain": -0.1 },
				{ "band": 13, "gain": -0.1 },
				{ "band": 14, "gain": -0.1 }
			]);
		else
			await player.setEQ([
				{ "band": 0, "gain": 0.0 },
				{ "band": 1, "gain": 0.0 },
				{ "band": 2, "gain": 0.0 },
				{ "band": 3, "gain": 0.0 },
				{ "band": 4, "gain": 0.0 },
				{ "band": 5, "gain": 0.0 },
				{ "band": 6, "gain": 0.0 },
				{ "band": 7, "gain": 0.0 },
				{ "band": 8, "gain": 0.0 },
				{ "band": 9, "gain": 0.0 },
				{ "band": 10, "gain": 0.0 },
				{ "band": 11, "gain": 0.0 },
				{ "band": 12, "gain": 0.0 },
				{ "band": 13, "gain": 0.0 },
				{ "band": 14, "gain": 0.0 },
			]);

		client.servers[message.guild.id].boost = !boosted
		return `Changing boosted to: ${!boosted}`;
	}
}