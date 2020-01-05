const Command = require("./command.js");
const { MessageEmbed } = require('discord.js')
module.exports = class Help extends Command {
	constructor() {
		super();

		this.name = 'help';
		this.usage += `${this.name} [command]`
		this.description = 'List all commands or info about a specific command.'
		this.args = false;
		this.aliases = ['h'];
		this.category = 'utils'
	}

	run = (message, args) => {
		const client = message.client
		if (args.length == 0)
			return message.channel.send(this.help(true)
				.setTitle("List of all commands:")
				.setDescription(client.commands
					.sort((a, b) => String(a.name).localeCompare(b.name))
					.filter(command => command.name !== "help")
					.map(command => command.help()).join('\n'))
			)

		let commandName = args[0]
		let command = client.commands.get(commandName) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command)
			return message.channel.send("That command does not exist.")

		message.channel.send(command.help(true))
	}
}