const axios = require('axios');
const { MessageEmbed } = require('discord.js');
exports.util = {
	async run(week = false) {
		try {
			if (week)
				return new MessageEmbed()
					.setTitle('List of the whole week')
					.setDescription(
						(await axios.get('https://dev.yommail.tk/express/lunch?full')).data
							.map(day => `**${day.name}**\n${day.food}`)
					)

			let lunch = (await axios.get('https://dev.yommail.tk/express/lunch')).data;
			return new MessageEmbed()
				.setTitle(`Lunch on ${lunch.name}`)
				.setDescription(lunch.food)
		} catch (error) {
			throw error;
		}
	}
}