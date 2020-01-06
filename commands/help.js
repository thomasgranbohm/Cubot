const Command = require("./command.js");
const { categories } = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = class Help extends Command {
	constructor() {
		super();

		this.name = 'help';
		this.usage += `${this.name} [command]`
		this.description = 'List all commands or info about a specific command.'
		this.args = false;
		this.aliases = ['h'];
		this.category = categories.UTILS;
	}

	run = (message, args) => {
		const client = message.client
		if (args.length == 0)
			return this.help(true)
				.setTitle("List of all commands:")
				.setDescription(Object.keys(client.commands)
					.sort((a, b) => a.localeCompare(b))
					.filter(command => command !== this.name)
					.map(name => client.commands[name])
					.map(command => command.help()).join('\n'))

		let commandName = args[0]
		let command = client.utils.findCommand.run(client, commandName);

		if (!command)
			return "That command does not exist."

		return command.help(true)
	}
}