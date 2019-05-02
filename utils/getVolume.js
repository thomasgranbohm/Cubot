module.exports = {
	name: "getVolume",
	execute(message, oldVolume = undefined) {
		let volume = message.client.playing.get(message.member.voiceChannel.id).volumer.volume
		let emoji = volume <= 0.1 ?
			":mute:" :
			volume <= 0.4 ?
				":speaker:" :
				volume <= 0.7 ?
					":musical_note:" :
					volume <= 1 ?
						":notes:" :
						volume > 1 ?
							":loudspeaker:"
							: ":x:";

		if (oldVolume) {
			message.channel.send(`${emoji} Changed volume from **${oldVolume * 100}%** to **${volume * 100}%**!`)
				.then(sentMessage => sentMessage.delete(15000))
		} else {
			message.channel.send(`${emoji} The current volume is **${volume * 100}%**!`)
				.then(sentMessage => sentMessage.delete(15000))
		}
	}
}