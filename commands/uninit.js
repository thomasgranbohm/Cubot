const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'uninit',
	description: 'Choose a Text Channel to initialize.',
	color: "e63462",
	execute(message, args) {
		fs.readFile('./config.json', (err, data) => {
			if (err) return console.error(err);
			let json = JSON.parse(data)
			let serverObj = {
				serverID: message.channel.guild.id,
				textChannelID: message.channel.id
			}
			if (json.initializedTextChannels.filter(obj => {
				return obj.serverID == serverObj.serverID && obj.textChannelID != serverObj.textChannelID
			}).length != 0) {
				json.initializedTextChannels.splice(
					json.initializedTextChannels.indexOf(serverObj), 1
				);
				message.reply("I've remove your text channel from the list!")
					.then(sentMessage => sentMessage.delete(10000));
			} else {
				return message.reply("this channel isn't initialized. You can initialize it by using \`init\`!")
					.then(sentMessage => sentMessage.delete(10000));
			}
			fs.writeFile('./config.json', JSON.stringify(json, null, 4), (err) => {
				if (err) return console.error(err);
			});
		})
	},
};