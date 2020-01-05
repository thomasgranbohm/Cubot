const Command = require("./command.js");
module.exports = class Play extends Command {
	constructor() {
		super();

		this.name = '';
		this.usage += `${this.name}`;
		this.description = '';
		this.args = false;
		this.aliases = [];
		this.category = '';
	}

	run = (message, args) => {
		let client = message.client;

	}
}