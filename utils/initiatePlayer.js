const Util = require('./util.js');
module.exports = class initiatePlayer extends Util {
	constructor() {
		super();

		this.name = 'initiatePlayer';
	}
	run = (client, guildID) => {
		if (!client.servers[guildID]) client.servers[guildID] = { queue: [], boost: false };
	}
}