const {MessageEmbed} = require('discord.js')

exports.util = {
	async run(message, toSend, category) {
		if (toSend instanceof Promise)
			toSend = await toSend
		if (toSend === null)
			return

		if (toSend instanceof Discord.MessageEmbed) {
			toSend.setColor(category)
			if (!toSend.footer)
				toSend.setFooter(`Requested by ${message.author.username}`, message.author.avatarURL({ size: 1024 }))
		}
		if (toSend instanceof Error)
			toSend = new Discord.MessageEmbed()
				.setTitle(toSend.toString().substring(toSend.toString().indexOf(':') + 2))
				.setColor('RED')

		let sentMessage = await message.channel.send(toSend);

		if (!(sentMessage.embeds.length > 0 && sentMessage.embeds[0].title.startsWith('Lunch on')))
			sentMessage.delete({
				timeout: 15000
			})
		return null;
	}
}