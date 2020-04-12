const logger = require('../cli/logger.js')

module.exports = queueLoop = async (client, message, queue, player) => {
	logger.log(`Playing %s in %s`, queue[0].info.title, message.guild.name)
	queue[0].startedAt = Date.now()
	player.play(queue[0].track)

	player.once('end', async (data) => {
		if (data.reason === "REPLACED") return;
		if (!player.loop) {
			var endedTrack = queue.shift();
			logger.log(`Ended track %s in %s. New queue length is now: %d`, endedTrack.info.title, message.guild.name, queue.length)
		}
		if (queue.length > 0) {
			client.utils.queueLoop(client, message, queue, player);
		}
	})
	return client.commands.now(message)
}