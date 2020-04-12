module.exports = checkUserVoice = async (message) => {
	let client = message.client;
	if (!message.member.voice.channelID) {
		return new Error("You are not in a voice channel.");
	}
	// TODO shouldnt this be in checkBotVoice?
	// if (message.guild.me.voice) console.log(message.guild.me.voice, message.guild.me.voice.channelID, message.member.voice.channelID)
	if (message.guild.me.voice && message.guild.me.voice.channelID && message.member.voice.channelID !== message.guild.me.voice.channelID)
		return new Error("I'm already in another voice channel.");

	return null;
}