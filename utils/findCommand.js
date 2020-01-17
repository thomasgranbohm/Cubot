exports.util = {
	run(client, commandName) {
		return client.commands[commandName] ||
			client.commands[Object.keys(client.commands).find(c =>
				client.commands[c].aliases &&
				client.commands[c].aliases.includes(commandName)
			)]
	}
}