const Discord = require('discord.js')
const { prefix, categories } = require('../config.json')

exports.util = {
	run(command, extended = false) {
		if (extended)
			return new Discord.MessageEmbed()
				.setTitle(`Detailed view about ${command.name}`)
				.addField('**Name**', command.name, true)
				.addField('**Description**', command.longDesc ? `${command.shortDesc}\n${command.longDesc}` : command.shortDesc, true)
				.addField('**Category**', Object.keys(categories).find(key => categories[key] === command.category), true)
				.addField('**Aliases**', command.aliases.join(', '), true)
				.addField('**Usage**', `\`${prefix}${command.name}${command.usage ? ` ${command.usage}` : ''}\``, true)
				.addField('**Needs args**', command.args ? "Yes, it does." : "No, it doesn't.", true)

		return `**${command.name}** - ${command.shortDesc}`;
	}
}