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

		return utils.changeEqualizer.run(message, client.equalizers.earrape)
	}
}