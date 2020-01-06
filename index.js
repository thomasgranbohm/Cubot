const Discord = require('discord.js');
const client = new Discord.Client();

const axios = require('axios')
const Lavalink = require('discord.js-lavalink');
const { PlayerManager } = Lavalink;

const config = require('./config.json');
const fs = require('fs');
const chalk = require('chalk');

client.servers = {}
client.commands = {}, client.utils = {};

// TODO different colors for different categories
// TODO Also create identifiers so that the obj VOICE can be directly attached to 

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && (!file.startsWith('command') && !file.startsWith('.')));
for (const file of commandFiles) {
	const c = require(`./commands/${file}`);
	const command = new c();
	client.commands[command.name] = command;
}

// TODO utils
const utilFiles = fs.readdirSync('./utils').filter(file => file.endsWith('.js') && (!file.startsWith('command') && !file.startsWith('.')));
for (const file of utilFiles) {
	const c = require(`./utils/${file}`);
	const command = new c();
	client.utils[command.name] = command;
}

client.on('message', async (message) => {
	let content = message.content.split("");
	if (content.shift() !== config.prefix) return null;
	content = content.join("").split(" ")
	let args = message.content.slice(config.prefix.length).split(/ +/);
	let commandName = args.shift().toLowerCase();

	let command = client.utils.findCommand.run(client, commandName);

	if (!command) return;

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	try {
		let toSend = await command.run(message, args.join(" "));

		if (toSend instanceof Promise)
			toSend = await toSend
		if (toSend === null)
			return

		if (toSend instanceof Discord.MessageEmbed) {
			toSend.setColor(command.category)
			if (!toSend.footer)
				toSend.setFooter(`Requested by ${message.author.username}`, message.author.avatarURL({ size: 1024 }))
		}
		if (toSend instanceof Error)
			toSend = new Discord.MessageEmbed()
				.setTitle(toSend.toString().substring("Error: ".length))
				.setColor('RED');
		message.channel.send(toSend)
	} catch (error) {
		console.error(error)
		message.reply('there was an error trying to execute that command!');
	}
})

client.on('ready', () => {
	console.error = (error) => console.log(chalk.redBright(`[${error.name}]`) + error.stack.substring(error.name.length + 1))
	console.general = (baseString, ...args) => {
		let argIndex = 0;
		baseString = new String(baseString)
		console.log(chalk.greenBright('[General] ') + (args ?
			baseString.split(' ')
				.map(string => {
					if (string.includes('?')) {
						return string.slice(0, string.indexOf('?'))
							+ chalk.magentaBright(args[argIndex++])
							+ string.slice(1 + string.indexOf('?'))
					}
					return string
				}).join(' ') :
			baseString))
	}
	process.on('uncaughtException', (err) => console.error(err))
	process.on('unhandledRejection', (reason) => console.error(reason))

	client.player = new PlayerManager(client, config.lavalink.nodes, {
		user: client.user.id,
		shards: (client.shard && client.shard.count) || 1
	})

	console.general("I'm running!")
})

client.login(config.token);