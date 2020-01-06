const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'readFood',
	color: "e9f542",
	execute(client, args = undefined) {
		let embed = new Discord.MessageEmbed()
			.setColor(this.color)
		let food = JSON.parse(fs.readFileSync('./utils/lunch.json'));

		if (food.length > 0) {
			var days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
			var d = new Date();
			var dayName = (d.getDay() != 0 || d.getDay() != 6) ? days[d.getDay()] : undefined;
			if (args != undefined) {
				if (args[0] == "-a" || args[0] == 'all') {
					embed.setAuthor(
						`Vecka ${getWeekNumber(new Date())}`,
						client.foodIcon)
						.setDescription(
							food.map(obj =>
								`${obj.day}:
							${(obj.lunch.length == 0 || obj.lunch.includes("Lovdag") ?
									"Ingen mat idag." :
									obj.lunch)
								}`).join("\n\n")
						)
				} else if (args[0] == '-t' || args[0] == 'tomorrow') {
					dayName = days[d.getDay() + 1 % 6]
					let todayFood = food.filter(obj => obj.day == dayName)[0]
					if (todayFood == undefined || todayFood.lunch.length == 0 || todayFood.lunch.includes("Lovdag")) {
						embed.setAuthor("Ingen mat imorgon.", client.foodIcon)
					} else {
						embed.setAuthor("Imorgon blir det:", client.foodIcon)
						embed.setDescription(
							todayFood.lunch.includes("Veg:") ?
								"𝗟𝘂𝗻𝗰𝗵: " + todayFood.lunch.substring(0, todayFood.lunch.indexOf("Veg:")) +
								"𝗔𝗹𝘁𝗲𝗿𝗻𝗮𝘁𝗶𝘃: " + todayFood.lunch.substring(todayFood.lunch.indexOf("Veg:") + 4) :
								"𝗟𝘂𝗻𝗰𝗵: " + todayFood.lunch.substring(0, todayFood.lunch.indexOf("\n") + 1) +
								"𝗔𝗹𝘁𝗲𝗿𝗻𝗮𝘁𝗶𝘃: " + todayFood.lunch.substring(todayFood.lunch.indexOf("\n") + 1)
						)
					}
				}
			} else if (dayName != undefined) {
				let todayFood = food.filter(obj => obj.day == dayName)[0];
				embed.setAuthor("Idag blir det:", client.foodIcon)
					.setDescription(
						todayFood.lunch.length == 0 || todayFood.lunch.includes("Lovdag") ?
							"Ingen mat idag." :
							todayFood.lunch.includes("Veg:") ?
								"𝗟𝘂𝗻𝗰𝗵: " + todayFood.lunch.substring(0, todayFood.lunch.indexOf("Veg:")) +
								"𝗔𝗹𝘁𝗲𝗿𝗻𝗮𝘁𝗶𝘃: " + todayFood.lunch.substring(todayFood.lunch.indexOf("Veg:") + 4) :
								"𝗟𝘂𝗻𝗰𝗵: " + todayFood.lunch.substring(0, todayFood.lunch.indexOf("\n") + 1) +
								"𝗔𝗹𝘁𝗲𝗿𝗻𝗮𝘁𝗶𝘃: " + todayFood.lunch.substring(todayFood.lunch.indexOf("\n") + 1)
					);
			}
		} else {
			embed.setAuthor("Ingen mat finns lagrad.", client.foodIcon)
		}

		return embed;
	},
};

function getWeekNumber(d) {
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
	return weekNo;
}