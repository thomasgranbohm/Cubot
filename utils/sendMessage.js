const { MessageEmbed } = require('discord.js')
const { categories } = require('../config.json')

module.exports = sendMessage = async (channel, toSend, category, author = null) => {
	if (toSend instanceof Promise)
		toSend = await toSend
	if (toSend == null)
		return

	if (toSend instanceof MessageEmbed) {
		toSend.setColor(category)
		if (!toSend.footer && !toSend.timestamp && category !== categories.ADMIN && author)
			toSend.setFooter(`Requested by ${author.username}`, author.avatarURL({ size: 1024 }))
	}
	if (toSend instanceof Error)
		toSend = new MessageEmbed()
			.setTitle(toSend.toString().substring(toSend.toString().indexOf(':') + 2))
			.setColor('RED')

	let sentMessage = await channel.send(toSend);

	if (author && channel.type !== 'dm')
		sentMessage.delete({
			timeout: 15000
		})
}