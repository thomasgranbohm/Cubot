// const axios = require('axios')
// const config = require('./config.json');

// (async (query) => {
// 	try {
// 		const res = await axios.get(`http://${config.lavalink.host}:${config.lavalink.port}/loadtracks?identifier=${encodeURIComponent(query)}`, {
// 			headers: {
// 				Authorization: config.lavalink.password
// 			}
// 		})
// 		console.log(res.data)
// 	} catch (error) {
// 		console.error(error)
// 	}
// })('https://www.youtube.com/playlist?list=PLwzqwBrD4F-w_yUi0aaZRsU3zWlEYron_');

const { openWeatherAPI } = require('./config.json');
const request = require('request-promise');
const { MessageEmbed } = require('discord.js');
(async (city = "stockholm") => {
	try {
		let json = await request(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherAPI}`)
		let deg = JSON.parse(json).wind.deg + 22.5
		console.log(deg)
		console.log(Math.floor(deg / 45));
		switch (Math.floor(deg / 45)) {
			case 0:
				console.log('North')
				break;
			case 1:
				console.log('North East')
				break;
			case 2:
				console.log('East')
				break;
			case 3:
				console.log('South East')
				break;
			case 4:
				console.log('South')
				break;
			case 5:
				console.log('South West')
				break;
			case 6:
				console.log('West')
				break;
			case 7:
				console.log('North West')
				break;
		}
	} catch (error) {
		return error;
	}
})()