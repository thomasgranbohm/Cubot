const { MessageEmbed } = require('discord.js')

module.exports = changeEqualizer = async (message, equalizer) => {
	const { client } = message;
	const { commands, utils } = client;

	let userCheckFail = await utils.checkUserVoice(message);
	if (userCheckFail) return userCheckFail;
	let botCheckFail = await utils.checkBotVoice(message);
	if (botCheckFail) return botCheckFail;

	const player = client.player.get(message.guild.id)
	if (!player)
		return new Error("I'm not playing anything.");

	let currentEqualizer = client.servers[message.guild.id].equalizer;
	if (currentEqualizer !== equalizer) {
		await player
			.setEQ(equalizer);
		client.servers[message.guild.id].equalizer = equalizer
	}
	else {
		await player
			.setEQ(client.equalizers.flat);
		client.servers[message.guild.id].equalizer = client.equalizers.flat
	}
	return new MessageEmbed()
		.setTitle(`Changed equalizer to ${Object.keys(client.equalizers).find(eq => client.equalizers[eq] == client.servers[message.guild.id].equalizer)}`)
		.setDescription('Please hold on...')
}