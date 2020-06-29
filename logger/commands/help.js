const logger = require('../');
const chalk = require('chalk')

let toString = command => ` - ${chalk.italic(command.name)}: ${command.desc}`;

const help = (client, ...args) => {
	const { commands } = logger;
	if (args && args.length) {
		let command = Object.values(commands).filter(
			c => c.name == args.join(" ")
		)[0];
		if (!command) throw new TypeError("Command doesn't exist");
		return `Help for:\n` + toString(command);
	}
	return [chalk.bold("All commands:")]
		.concat(Object.values(commands).map(toString))
		.join("\n");
};
help.desc = "Lists all commands";

module.exports = help;

