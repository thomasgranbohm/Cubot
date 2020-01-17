const Discord = require('discord.js')
const client = new Discord.Client();

const axios = require('axios')
// const WebServer = require('./webserver/index')
const Lavalink = require('discord.js-lavalink');
const { PlayerManager } = Lavalink;

const config = require('./config.json');
const fs = require('fs');
const chalk = require('chalk');

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
				.setTitle(toSend.toString().substring(toSend.toString().indexOf(':') + 2))
				.setColor('RED')
		message.channel.send(toSend)
	} catch (error) {
		// (await client.dev.createDM())
		// 	.send(
		// 		new Discord.MessageEmbed()
		// 			.setTitle('Ran into some problems chief')
		// 			.setDescription(`Here is the stack trace:\n\`\`\`${error.stack}\`\`\``)
		// 			.setColor('RED')
		// 			.setTimestamp()
		// 	)
		console.error(error)
		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle("Oops, an actual error...")
				.setDescription("Sorry about that. Please try again!")
				.attachFiles([
					{ attachment: `${client.runningDir}/utils/static/error.png`, name: `error.png` }
				])
				.setColor('RED')
				.setThumbnail('attachment://error.png')
		)
	}
})

client.on('ready', async () => {
	console.error = (error) => console.otherLog(chalk.red(`[${error.name}]`), error.stack.substring(error.name.length + 1))
	console.web = (baseString, ...args) => console.otherLog(chalk.green('[Web]'), baseString, ...args)
	console.general = (baseString, ...args) => console.otherLog(chalk.green('[General]'), baseString, ...args)
	console.otherLog = (category, baseString, ...args) => {
		let argIndex = 0;
		console.log(category, args ?
			baseString.split(' ')
				.map(string => {
					if (string.includes('?')) {
						return string.slice(0, string.indexOf('?'))
							+ chalk.magentaBright(args[argIndex++])
							+ string.slice(1 + string.indexOf('?'))
					}
					return string
				}).join(' ') :
			baseString)
	}
	process.on('uncaughtException', (err) => console.error(err))
	process.on('unhandledRejection', (reason) => console.error(reason))

	client.equalizers = {
		earrape: [{ "band": 0, "gain": 1 }, { "band": 1, "gain": 1 }, { "band": 2, "gain": 1 }, { "band": 3, "gain": 1 }, { "band": 4, "gain": 1 }, { "band": 5, "gain": 1 }, { "band": 6, "gain": 1 }, { "band": 7, "gain": 1 }, { "band": 8, "gain": 1 }, { "band": 9, "gain": 1 }, { "band": 10, "gain": 1 }, { "band": 11, "gain": 1 }, { "band": 12, "gain": 1 }, { "band": 13, "gain": 1 }, { "band": 14, "gain": 1 }],
		bassboost: [{ "band": 0, "gain": 0.2 }, { "band": 1, "gain": 0.15 }, { "band": 2, "gain": 0.1 }, { "band": 3, "gain": 0.05 }, { "band": 4, "gain": 0.0 }, { "band": 5, "gain": -0.05 }, { "band": 6, "gain": -0.1 }, { "band": 7, "gain": -0.1 }, { "band": 8, "gain": -0.1 }, { "band": 9, "gain": -0.1 }, { "band": 10, "gain": -0.1 }, { "band": 11, "gain": -0.1 }, { "band": 12, "gain": -0.1 }, { "band": 13, "gain": -0.1 }, { "band": 14, "gain": -0.1 }],
		flat: [{ "band": 0, "gain": 0.0 }, { "band": 1, "gain": 0.0 }, { "band": 2, "gain": 0.0 }, { "band": 3, "gain": 0.0 }, { "band": 4, "gain": 0.0 }, { "band": 5, "gain": 0.0 }, { "band": 6, "gain": 0.0 }, { "band": 7, "gain": 0.0 }, { "band": 8, "gain": 0.0 }, { "band": 9, "gain": 0.0 }, { "band": 10, "gain": 0.0 }, { "band": 11, "gain": 0.0 }, { "band": 12, "gain": 0.0 }, { "band": 13, "gain": 0.0 }, { "band": 14, "gain": 0.0 }]
	}

	client.player = new PlayerManager(client, config.lavalink.nodes, {
		user: client.user.id,
		shards: (client.shard && client.shard.count) || 1
	})

	client.dev = client.users.get('284754083049504770');

	client.runningDir = __dirname;

	client.log = [];
	client.servers = {}
	client.commands = {}, client.utils = {};

	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && (!file.startsWith('command') && !file.startsWith('.'))).map(file => file.replace('.js', ''));
	for (const file of commandFiles) {
		const { command } = require(`./commands/${file}`);
		command.name = file;
		client.commands[file] = command;
	}

	const utilFiles = fs.readdirSync('./utils').filter(file => file.endsWith('.js') && (!file.startsWith('command') && !file.startsWith('.'))).map(file => file.replace('.js', ''));
	for (const file of utilFiles) {
		const { util } = require(`./utils/${file}`);
		util.name = file;
		client.utils[file] = util;
	}

	client.on('voiceStateUpdate', async (oldState, newState) => {
		let player = await client.player.get(oldState.guild.id)
		if (player) {
			let guild = client.guilds.get(oldState.guild.id)
			if (guild.channels.get(player.channel).members.size === 1)
				client.player.leave(oldState.guild.id)
		}
	});

	client.user.setActivity('bass bOwOsted music!', { type: 'LISTENING' })

	console.log(
		` ______     __  __     ______     ______     ______  
/\\  ___\\   /\\ \\/\\ \\   /\\  == \\   /\\  __ \\   /\\__  _\\ 
\\ \\ \\____  \\ \\ \\_\\ \\  \\ \\  __<   \\ \\ \\/\\ \\  \\/_/\\ \\/ 
 \\ \\_____\\  \\ \\_____\\  \\ \\_____\\  \\ \\_____\\    \\ \\_\\ 
  \\/_____/   \\/_____/   \\/_____/   \\/_____/     \\/_/ \n`
	)

	console.general("I'm running!")
})

client.login(config.token);