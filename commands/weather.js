const { categories, openWeatherAPI } = require('../config.json')
const { MessageEmbed } = require('discord.js')
const axios = require('axios');

exports.command = {
	usage: `<city>`,
	shortDesc: 'Returns the weather.',
	args: false,
	aliases: ['w'],
	category: categories.MISC,
	async run(message, args) {
		const { client } = message;
		const { commands, utils } = client;
		try {
			let city = args.length > 0 ? args : "Stockholm";
			let json = (await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherAPI}`)).data;
			switch (Math.floor((json.wind.deg + 22.5) / 45)) {
				case 0:
					json.wind.deg = 'North';
					break;
				case 1:
					json.wind.deg = 'North East';
					break;
				case 2:
					json.wind.deg = 'East';
					break;
				case 3:
					json.wind.deg = 'South East';
					break;
				case 4:
					json.wind.deg = 'South';
					break;
				case 5:
					json.wind.deg = 'South West';
					break;
				case 6:
					json.wind.deg = 'West';
					break;
				case 7:
					json.wind.deg = 'North West';
					break;
			}
			return new MessageEmbed()
				.setTitle(`Weather in ${json.name}`)
				// TODO emojis for weather
				.addField('Weather', json.weather[0].main, true)
				.addField('Wind', `${json.wind.speed} m/s, from the ${json.wind.deg}`, true)
				.addField('Country', `:flag_${json.sys.country.toLowerCase()}:`, true)
				.addField('Temperature', `${Math.round(json.main.temp - 273.15)} °C`, true)
				.addField('Feels like', `${Math.round(json.main.feels_like - 273.15)} °C`, true)
				.addField('Humidity', `${json.main.humidity}%`, true);
		} catch (error) {
			if (error.name === 'StatusCodeError' && error.message.startsWith('404'))
				return new Error('That city isn\'t in the database.')
			throw error;
		}
	}
}