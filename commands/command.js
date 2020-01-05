const Discord = require('discord.js')
const { prefix } = require('../config.json')

module.exports = class Command {
	constructor() {
		this.name = "";
		this.usage = prefix;
		this.description = "";
		this.args = false;
		this.aliases = [];
		this.category = null;
	}

	help = (inDepth = false) => {
		if (inDepth)
			return new Discord.MessageEmbed()
				.setTitle(`Detailed view about ${this.name}`)
				.addField('Name', this.name, true)
				.addField('Description', this.description, true)
				.addField('Category', this.category, true)
				.addField('Aliases', this.aliases.join(', '), true)
				.addField('Usage', `\`${this.usage}\``, true)
				.addField('Needs args', this.args ? "Yes, it does." : "No, it doesn't.", true)

		return `**${this.name}**: ${this.description}`
	}
}