const Discord = require('discord.js')

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	color: 'b5ef8a',
	execute(message, args) {
		const { prefix } = require('../config.json');

		const { commands } = message.client;

		if (!args.length) {
			let embed = new Discord.MessageEmbed()
				.setAuthor("List of all commands:", message.client.settingIcon)
				.setColor(this.color)
				.setDescription(
					"If you want a more detailed view, use `§help <command>`.\n\n" +
					commands.map(command => `**\`${command.name}\`**:\t  \t${command.description}`).join('\n')
				)
				.setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)

			return message.channel.send(embed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		let data = [];

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** \`${command.aliases.join('\`, \`')}\``);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		command.cooldown != undefined ? data.push(`**Cooldown:** ${command.cooldown} second(s)`) : null;

		let embed = new Discord.MessageEmbed()
			.setAuthor(`Detailed view about ${name}:`, message.client.settingIcon)
			.setColor(this.color)
			.setDescription(
				data.join('\n')
			)
			.setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)

		message.channel.send(embed);
	},
};