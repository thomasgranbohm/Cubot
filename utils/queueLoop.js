const Util = require('./util.js');
module.exports = class queueLoop extends Util {
	constructor() {
		super();

		this.name = 'queueLoop';
	}
	run = async (client, message, queue, player) => {
		console.general(`Playing ? in ?`, queue[0].info.title, message.guild.name)
		player.play(queue[0].track)

		player.once('end', async () => {
			queue = client.servers[message.guild.id].queue;
			if (queue.length > 0) {
				client.utils.queueLoop.run(client, message, queue, player);
			}
		})
		return client.commands.now.run(message)
	}
}