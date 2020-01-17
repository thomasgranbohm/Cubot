const { MessageEmbed } = require('discord.js')

exports.util = {
	async run(message, equalizer) {
		const { client } = message;
		const { commands, utils } = client;

		let userCheckFail = utils.checkUserVoice.run(message);
		if (userCheckFail) return userCheckFail;

		const player = client.player.get(message.guild.id)
		if (!player)
			return "I'm not playing anything."

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
}