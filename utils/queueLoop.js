exports.util = {
	async run(client, message, queue, player) {
		console.general(`Playing ? in ?`, queue[0].info.title, message.guild.name)
		queue[0].startedAt = Date.now()
		player.play(queue[0].track)
		return client.commands.now.run(message)
	}
}