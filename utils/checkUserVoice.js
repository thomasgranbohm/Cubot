module.exports = checkUserVoice = async (message) => {
	let client = message.client;
	if (!message.member.voice.channelID) {
		return new Error("You are not in a voice channel.");
	}
	// TODO shouldnt this be in checkBotVoice?
	if (client.player.get(message.guild.id) && message.member.voice.channelID !== client.player.get(message.guild.id).channel)
		return new Error("I'm already in another voice channel.");

	return null;
}