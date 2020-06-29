let chalk = require('chalk')
let logger = require("../")

const select = (client, ...args) => {
	if (args.length == 0) throw new Error("Please select a guild.")
	let filtered = client.guilds.cache.filter(guild => guild.name == args[0]);
	let guild = client.guilds.resolve(args[0])
	if (guild == undefined) throw new Error("That guild doesn't exist.")

	return `${chalk.bold('Selected guild:')}
 - ${chalk.greenBright('Name:')} ${guild.name}
 - ${chalk.greenBright('Members:')} ${guild.memberCount}
 - ${chalk.greenBright('Channels:')} ${guild.channels.size}
 - ${chalk.greenBright('Roles:')} ${guild.roles.size}
 - ${chalk.greenBright('Playing:')} ${client.servers[guild.id] ? client.servers[guild.id].queue[0].info.title : 'Not playing.'}
 - ${chalk.greenBright('Queue Length:')} ${client.servers[guild.id] ? client.servers[guild.id].queue.length : '0'}`
}
select.desc = "Set the selected guild."

module.exports = select;