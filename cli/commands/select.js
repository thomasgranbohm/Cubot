let chalk = require('chalk')
let logger = require("../logger.js")

const select = (client, ...args) => {
	if (args.length == 0) throw new Error("Please select a guild.")
	let filtered = client.guilds.filter(guild => guild.name == args[0]);
	let guild = client.guilds.resolve(filtered.size > 0 ? filtered.keys().next().value : undefined)
	if (guild == undefined) throw new Error("That guild doesn't exist.")

	return `${chalk.bold('Selected guild:')}
 - ${chalk.magentaBright('Name:')} ${guild.name}
 - ${chalk.magentaBright('Members:')} ${guild.memberCount}
 - ${chalk.magentaBright('Channels:')} ${guild.channels.size}
 - ${chalk.magentaBright('Roles:')} ${guild.roles.size}
 - ${chalk.magentaBright('Playing:')} ${client.servers[guild.id] ? client.servers[guild.id].queue[0].info.title : 'Not playing.'}
 - ${chalk.magentaBright('Queue Length:')} ${client.servers[guild.id] ? client.servers[guild.id].queue.length : '0'}`
}
select.desc = "Set the selected guild."

module.exports = select;