const Command = require('./command.js');
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js');

module.exports = class now extends Command {
	constructor() {
		super();

		this.name = 'now';
		this.usage += `${this.name}`;
		this.description = 'Returns the currently playing track.';
		this.args = false;
		this.aliases = ['np', 'nowPlaying'];
		this.category = categories.VOICE;
	}
	run = async (message, args) => {
		const { client } = message;
		const { commands, utils } = client;

		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		let botCheckFail = utils.checkBotVoice.run(message);
		if (botCheckFail) return botCheckFail;

		let queue = await utils.getServerQueue.run(client, message.guild.id).slice()
		return utils.nowEmbed.run(queue)
	}
}