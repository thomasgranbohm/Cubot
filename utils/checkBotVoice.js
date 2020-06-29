const logger = require('../logger/')

module.exports = checkBotVoice = async (message) => {
	const { client } = message;

	if (!client.manager.players.get(message.guild.id))
		return new Error("I'm not in a voice channel.");

	let queue = client.utils.getServerQueue(client, message.guild.id)
	if (!queue || queue.length == 0)
		return new Error("I'm not playing anything.")

	return null;
}