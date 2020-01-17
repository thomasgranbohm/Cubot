const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

exports.command = {
	usage: `[command]`,
	shortDesc: 'List all commands or info about a specific command.',
	longDesc: 'When supplied with a command, returns the info about a specific command.',
	args: false,
	aliases: ['h'],
	category: categories.UTILS,
	async run(message, args) {
		const client = message.client
		const { commands, utils } = client;
		if (args.length == 0)
			return utils.getHelp.run(this, true)
				.setTitle("List of all commands:")
				.setDescription(
					Object.keys(client.commands)
						.sort((a, b) => a.localeCompare(b))
						.filter(command => command !== this.name)
						.map(name => client.commands[name])
						.map(command => utils.getHelp.run(command))
						.join('\n')
				)

		let commandName = args.split(" ")[0]
		let command = client.utils.findCommand.run(client, commandName);

		if (!command)
			return "That command does not exist.";

		return utils.getHelp.run(command, true)
	}
}