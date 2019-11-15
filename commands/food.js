module.exports = {
	name: 'food',
	description: 'Returns the food. Add \`-a\` or \`all\` to get the whole list. Add \`-t\` or \`tomorrow\` to get the food for tomorrow.',
	aliases: ['f', 'lunch', 'l'],
	color: "e9f542",
	execute(message, args) {
		console.log("Sending food.");
		message.channel.send(
			message.client.utils
				.get("readFood")
				.execute(message.client, args)
		)
	},
};