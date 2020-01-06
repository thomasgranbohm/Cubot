const Util = require("./util.js");
module.exports = class findCommand extends Util {
	constructor() {
		super();

		this.name = 'findCommand';
	}

	run = (client, commandName) => {
		return client.commands[commandName] ||
			client.commands[Object.keys(client.commands).find(c =>
				client.commands[c].aliases &&
				client.commands[c].aliases.includes(commandName)
			)]
	}
}