const { categories } = require('../config.json');
const { MessageEmbed, TextChannel } = require('discord.js');

exports.command = {
	shortDesc: 'Returns the lunch.',
	// TODO Optional Args array
	// optionalArgs: [
	// 	{ 'arg': "desc" }
	// ],

	args: false,
	aliases: ['l', 'food', 'f'],
	category: categories.MISC,
	async run(message, args) {
		const { client } = message;
		const { commands, utils, models } = client;

		if (args.split(" ")[0] == "init") {
			if (!message.channel instanceof TextChannel)
				return new MessageEmbed()
					.setTitle('DM channels are not supported yet.')
			let channel = await models.channels.findOne({ where: { serverID: message.guild.id, channelID: message.channel.id } });
			if (channel) {
				const collector = message.channel.createMessageCollector((m) => m.content.includes('!yes'), { time: 10000 });
				collector.on('collect', async m => {
					if (m.content.startsWith('!yes')) {
						await models.channels.destroy({ where: { serverID: m.guild.id } })
						utils.sendMessage.run(
							m.channel,
							new MessageEmbed().setTitle('Removing this server from the list.'),
							categories.MISC
						)
					}
				})
				return new MessageEmbed()
					.setTitle('This server has already been initialized')
					.setDescription(`I'm currently sending the lunch in ${client.channels.get(message.channel.id)}.\nSend \`!yes\` before 15 seconds passes if you want to remove this server from the list.`);
			}

			await models.channels.create({
				serverID: message.guild.id,
				channelID: message.channel.id,
				name: message.channel.name
			})

			return new MessageEmbed()
				.setTitle('I will now send you the lunch everyday at 10:30!');
		}

		try {
			return await utils.lunchEmbed.run();
		} catch (error) {
			throw error;
		}
	}
}