const axios = require('axios');
const { MessageEmbed } = require('discord.js');
module.exports = lunchEmbed = async (week = false) => {
	let lunchEmbed = new MessageEmbed().setTimestamp();
	if (week)
		lunchEmbed
			.setTitle('List of the whole week')
			.setDescription(
				(
					await axios.get('https://dev.yommail.tk/express/lunch?full')
				).data.map((day) => `**${day.name}**\n${day.food}`),
			);
	else {
		let lunch = (await axios.get('https://dev.yommail.tk/express/lunch'))
			.data;
		lunchEmbed
			.setTitle(`Lunch on ${lunch.name}`)
			.setDescription(lunch.food);
	}

	return lunchEmbed;
};
