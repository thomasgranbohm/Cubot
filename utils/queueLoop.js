exports.util = {
	async run(client, message, queue, player) {
		console.general(`Playing ? in ?`, queue[0].info.title, message.guild.name)
		queue[0].startedAt = Date.now()
		player.play(queue[0].track)
    
		player.once('end', async (data) => {
			if (data.reason === "REPLACED") return;
			if (!player.loop) {
				var endedTrack = queue.shift();
				console.general(`Ended track ? in ?. New queue length is now: ?`, endedTrack.info.title, message.guild.name, queue.length)
			}
			if (queue.length > 0) {
				client.utils.queueLoop.run(client, message, queue, player);
			}
		})
		return client.commands.now.run(message)
	}
}