const chalk = require('chalk')
const client = require(`${process.cwd()}/CuBot.js`)

let guilds = () => client.guilds.map(guild => ` - ${chalk.magentaBright.bold(guild.name)}: ${chalk.italic(guild.id)}`).join('\n')

guilds.desc = "Returns this bots guilds."
module.exports = guilds;