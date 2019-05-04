module.exports = {
	name: 'food',
	description: 'Returns the food. Use \`-f\` to get the whole list.',
	aliases: ['f', 'lunch', 'l'],
	color: "e63462",
	execute(message, args) {
		message.channel.send(
			message.client.utils
				.get("readFood")
				.execute(message.client, args)
		)
	},
};