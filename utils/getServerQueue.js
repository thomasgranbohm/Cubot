const Util = require("./util.js");
module.exports = class getServerQueue extends Util {
	constructor() {
		super();

		this.name = 'getServerQueue';
	}

	run = (client, guildID) => {
		return client.servers[guildID].queue;
	}
}