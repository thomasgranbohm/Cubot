const { MessageEmbed } = require('discord.js');
const { promises } = require('fs')

module.exports = lunchEmbed = async (week = false) => {
	let toSend = new MessageEmbed().setTimestamp();
	let lunchFile = JSON.parse(promises.readFile('../static/lunch.json'))
	if (week) {

		toSend
			.setTitle('List of the whole week')
			.setDescription(
				lunchFile.map((day) => `**${day.name}**\n${day.food}`),
			);
	}
	else {
		let date = new Date();
		let currentDay = date.getDay();
		let time = date.getHours();
		let dayNumber = ((currentDay === 0 || currentDay === 6 ? 1 : time > 13 ? currentDay + 1 : currentDay) + 6) % 7;
		let day = days[dayNumber]
		let food = lunchFile[dayNumber];
		toSend
			.setTitle(`Lunch on ${day}`)
			.setDescription(food);
	}

	return toSend;
};
