const Discord = require('discord.js');
const request = require('request');
const fs = require('fs');

module.exports = {
	name: 'readFood',
	color: "e63462",
	execute(client, args = undefined) {
		let embed = new Discord.RichEmbed()
			.setColor(this.color)
		let food = JSON.parse(fs.readFileSync('./utils/lunch.json'));

		var days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
		var d = new Date();
		var dayName = (d.getDay() != 0 || d.getDay() != 6) ? days[d.getDay()] : undefined;
		if (args != undefined && args[0] == "-f") {
			embed.setAuthor(
				`Vecka ${getWeekNumber(new Date())}`,
				client.icon)
				.setDescription(
					food.map(obj =>
						`${obj.day}:
							${(obj.lunch.length == 0 || obj.lunch.includes("Lovdag") ?
							"Ingen mat idag." :
							("Lunch: " + obj.lunch.substring(
								obj.lunch.indexOf("Alternativ") + 11
							)) +
							"\nAlternativ:" +
							obj.lunch.substring(
								obj.lunch.indexOf(":") + 1,
								obj.lunch.indexOf("Alternativ")
							))
						}`).join("\n\n")
				)
		} else if (dayName != undefined) {
			let todayFood = food.filter(obj => obj.day == dayName)[0];
			embed.setAuthor("Idag blir det:", client.icon)
				.setDescription(
					todayFood.lunch.length == 0 || todayFood.lunch.includes("Lovdag") ?
						"Ingen mat idag." :
						("𝗟𝘂𝗻𝗰𝗵: " + todayFood.lunch.substring(
							todayFood.lunch.indexOf("Alternativ") + 11
						)) +
						"\n𝗔𝗹𝘁𝗲𝗿𝗻𝗮𝘁𝗶𝘃:" +
						todayFood.lunch.substring(
							todayFood.lunch.indexOf(":") + 1,
							todayFood.lunch.indexOf("Alternativ")
						)
				);
		}

		return embed;
	},
};

function getWeekNumber(d) {
	// Copy date so don't modify original
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	// Set to nearest Thursday: current date + 4 - current day number
	// Make Sunday's day number 7
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	// Get first day of year
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	// Calculate full weeks to nearest Thursday
	var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
	// Return array of year and week number
	return weekNo;
}