const { categories } = require('../config.json');

let help = function (message, args) {
	const client = message.client;
	const { commands, utils } = client;
	if (args.length == 0)
		return utils
			.getHelp(help, true)
			.setTitle('List of all commands:')
			.setDescription(
				Object.keys(client.commands)
					.sort((a, b) => a.localeCompare(b))
					.filter((command) => command !== this.name)
					.map((name) => client.commands[name])
					.map((command) => utils.getHelp(command))
					.join('\n'),
			);

	let commandName = args[0];
	let command = client.utils.findCommand(client, commandName);

	if (!command) return new Error('That command does not exist.');

	return utils.getHelp(command, true);
};
help.usage = `[command]`;
help.shortDesc = 'List all commands or info about a specific command.';
help.longDesc =
	'When supplied with a command, returns the info about a specific command.';
help.args = false;
help.aliases = ['h'];
help.category = categories.UTILS;
help.allowedChannels = ['text', 'dm']

module.exports = help;
