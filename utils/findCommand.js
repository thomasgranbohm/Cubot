module.exports = findCommand = async (client, commandName) => {
	let command = client.commands[commandName] ||
		client.commands[Object.keys(client.commands).find(c =>
			client.commands[c].aliases &&
			client.commands[c].aliases.includes(commandName)
		)]
	return command
}