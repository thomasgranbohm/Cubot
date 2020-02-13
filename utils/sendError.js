const { MessageEmbed } = require('discord.js')

module.exports = sendError = async (message, error) => {
	let { client } = message;
	if (process.env.NODE_ENV === 'production')
		(await client.dev.createDM())
			.send(
				new MessageEmbed()
					.setTitle('Ran into some problems chief')
					.setDescription(`Here is the stack trace:\n\`\`\`${error.stack}\`\`\``)
					.setColor('RED')
					.setTimestamp()
			)
	console.error(error)
	let sentMessage = await message.channel.send(
		new MessageEmbed()
			.setTitle("Oops, an actual error...")
			.setDescription("Sorry about that. Please try again!")
			.attachFiles([
				{ attachment: `${client.runningDir}/static/error.png`, name: `error.png` }
			])
			.setColor('RED')
			.setThumbnail('attachment://error.png')
	);

	sentMessage.delete({
		timeout: 10000
	})
}