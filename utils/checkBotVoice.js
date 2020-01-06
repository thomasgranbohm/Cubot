const Util = require('./util.js');
module.exports = class checkBotVoice extends Util {
	constructor() {
		super();

		this.name = 'checkBotVoice';
	}
	run = (message) => {
		const { client } = message;
		if (!client.player.get(message.guild.id))
			return new Error("I'm not in a voice channel.");

		let queue = client.utils.getServerQueue.run(client, message.guild.id)
		if (!queue || queue.length == 0)
			return new Error("I'm not playing anything.")
		return null;
	}
}