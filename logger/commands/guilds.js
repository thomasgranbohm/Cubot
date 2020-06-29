const chalk = require('chalk')
const client = require(`../../bot.js`)

let guilds = () => client.guilds.cache.sort((a, b) => (a.id >= b.id)).map(guild => ` - ${chalk.greenBright.bold(guild.name)}: ${chalk.italic(guild.id)}`).join('\n')

guilds.desc = "Returns this bots guilds."
module.exports = guilds;