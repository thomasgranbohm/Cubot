const Util = require('./util.js');
module.exports = class queueLoop extends Util {
	constructor() {
		super();

		this.name = 'queueLoop';
	}
	run = async (client, message, queue, player) => {
		console.general(`Playing ? in ?`, queue[0].info.title, message.guild.name)
		player.play(queue[0].track)
		return client.commands.now.run(message)
	}
}