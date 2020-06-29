let chalk = require('chalk')
let logger = require("../")

const members = (client, ...args) => {
	if (args.length == 0) throw new Error("Please select a guild.")
	let filtered = client.guilds.cache.filter(guild => guild.name == args[0]);
	let guild = client.guilds.resolve(args[0])
	if (guild == undefined) throw new Error("That guild doesn't exist.")
	let toSend = chalk.bold('Members:\n');
	let { members } = guild;
	members.cache.each((a) => toSend += ` - ${a.user.tag}\n`)
	return toSend;
}
members.desc = "Set the selected guild."

module.exports = members;