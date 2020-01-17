const config = require('../config.json')
const { categories } = require('../config.json')
Discord = require('discord.js')

module.exports = class Command {

	// TODO rework command classes
	// TODO Shortdesc for help
	// desc for longer desc
	constructor() {
		this.name = "";
		this.usage = config.prefix;
		this.shortDesc = "";
		this.args = false;
		this.aliases = [];
		this.category = null;
	}

	help = (inDepth = false) => {
		if (inDepth)
			return new Discord.MessageEmbed()
				.setTitle(`Detailed view about ${this.name}`)
				.addField('**Name**', this.name, true)
				.addField('**shortDesc**', this.shortDesc, true)
				.addField('**Category**', Object.keys(categories).find(key => categories[key] === this.category), true)
				.addField('**Aliases**', this.aliases.join(', '), true)
				.addField('**Usage**', `\`${this.usage}\``, true)
				.addField('**Needs args**', this.args ? "Yes, it does." : "No, it doesn't.", true)

		return `**${this.name}** - ${this.shortDesc}`
	}
}