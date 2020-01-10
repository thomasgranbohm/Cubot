const Util = require('./util.js');
module.exports = class queueLoop extends Util {
	constructor() {
		super();

		this.name = 'queueLoop';
	}
	run = async (client, message, queue, player) => {
		console.general(`Playing ? in ?`, queue[0].info.title, message.guild.name)
		player.play(queue[0].track)

		player.once('end', async (data) => {
			if (data.reason === "REPLACED") return;
			queue = client.servers[message.guild.id].queue;
			console.general(`Ended track ? in ?. New queue length is now: ?`, queue.shift().info.title, message.guild.name, queue.length)
			if (queue.length > 0) {
				client.commands.now.run(message)
				client.utils.queueLoop.run(client, message, queue, player);
			}
		})
		return client.commands.now.run(message)
	}
}