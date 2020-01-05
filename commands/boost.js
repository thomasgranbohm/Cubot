const Command = require("./command.js");
module.exports = class Play extends Command {
	constructor() {
		super();


		// TODO how much boost? Presets?
		this.name = 'boost';
		this.usage += `${this.name}`;
		this.description = 'Bass boosts the playing track.';
		this.args = false;
		this.aliases = ['bass', 'eq'];
		this.category = 'voice';
	}

	run = (message, args) => {
		let client = message.client;
		
	}
}