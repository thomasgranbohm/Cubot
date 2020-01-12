const Command = require("./command.js");
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = class Boost extends Command {
	constructor() {
		super();


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

		return utils.changeEqualizer.run(message, client.equalizers.bassboost)
	}
}