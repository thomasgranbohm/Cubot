module.exports = findCommand = (client, commandName) => {
	let command = client.commands[commandName];

	let commandNameFromAlias = Object.keys(client.commands).find(c =>
		client.commands[c].aliases &&
		client.commands[c].aliases.includes(commandName)
	);

	if (!command && !commandNameFromAlias)
		return undefined;
	else if (!command && commandNameFromAlias)
		command = client.commands[commandNameFromAlias]
	return command;
}