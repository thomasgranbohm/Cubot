const Util = require('./util.js');
module.exports = class getIdealHost extends Util {
	constructor() {
		super();

		this.name = 'getIdealHost';
	}
	run = (client) => {
		const foundNode = client.player.nodes.find(node => node.ready && node.region === "amsterdam");
		if (foundNode) return foundNode.host;
		return client.player.nodes.first().host;
	}
}