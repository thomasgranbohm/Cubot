const Discord = require('discord.js');
const client = new Discord.Client();

const axios = require('axios');
// const WebServer = require('./webserver/index')
const Lavalink = require('discord.js-lavalink');
const { PlayerManager } = Lavalink;

const config = require('./config.json');
const fs = require('fs');
const chalk = require('chalk');

// Database
const dbInit = require('./models/init');

const CronJob = require('cron').CronJob;

client.on('message', async (message) => {
	let content = message.content.split('');
	if (content.shift() !== config.prefix) return null;
	message.delete({ timeout: 3000 });
	content = content.join('').split(' ');
	let args = message.content.slice(config.prefix.length).split(/ +/);
	let commandName = args.shift().toLowerCase();

	let command = await client.utils.findCommand(client, commandName);

	if (!command) return;

	let { author, channel } = message;

	try {
		let toSend;
		if (command.category === config.categories.ADMIN && author.id !== client.dev.id) toSend = new Error("You dont have permission to run that command.")
		else if (command.args && !args.length) toSend = new Error(`You didn't provide any arguments.`);
		else toSend = await command(message, args.join(' '));

		client.utils.sendMessage(channel, toSend, command.category, author);
	} catch (error) {
		await client.utils.sendError(message, error);
	}
});

client.on('ready', async () => {
	console.error = (error) =>
		console.otherLog(
			chalk.red(`[${error.name}]`),
			error.stack.substring(error.name.length + 1)
		);
	console.web = (baseString, ...args) =>
		console.otherLog(chalk.green('[Web]'), baseString, ...args);
	console.general = (baseString, ...args) =>
		console.otherLog(chalk.green('[General]'), baseString, ...args);
	console.otherLog = (category, baseString, ...args) => {
		let argIndex = 0;
		console.log(
			category,
			args
				? baseString
					.split(' ')
					.map((string) => {
						if (string.includes('?')) {
							return (
								string.slice(0, string.indexOf('?')) +
								chalk.magentaBright(args[argIndex++]) +
								string.slice(1 + string.indexOf('?'))
							);
						}
						return string;
					})
					.join(' ')
				: baseString
		);
	};
	process.on('uncaughtException', (err) => console.error(err));
	process.on('unhandledRejection', (reason) => console.error(reason));

	client.equalizers = {
		earrape: [
			{ band: 0, gain: 1 },
			{ band: 1, gain: 1 },
			{ band: 2, gain: 1 },
			{ band: 3, gain: 1 },
			{ band: 4, gain: 1 },
			{ band: 5, gain: 1 },
			{ band: 6, gain: 1 },
			{ band: 7, gain: 1 },
			{ band: 8, gain: 1 },
			{ band: 9, gain: 1 },
			{ band: 10, gain: 1 },
			{ band: 11, gain: 1 },
			{ band: 12, gain: 1 },
			{ band: 13, gain: 1 },
			{ band: 14, gain: 1 }
		],
		bassboost: [
			{ band: 0, gain: 0.2 },
			{ band: 1, gain: 0.15 },
			{ band: 2, gain: 0.1 },
			{ band: 3, gain: 0.05 },
			{ band: 4, gain: 0.0 },
			{ band: 5, gain: -0.05 },
			{ band: 6, gain: -0.1 },
			{ band: 7, gain: -0.1 },
			{ band: 8, gain: -0.1 },
			{ band: 9, gain: -0.1 },
			{ band: 10, gain: -0.1 },
			{ band: 11, gain: -0.1 },
			{ band: 12, gain: -0.1 },
			{ band: 13, gain: -0.1 },
			{ band: 14, gain: -0.1 }
		],
		flat: [
			{ band: 0, gain: 0.0 },
			{ band: 1, gain: 0.0 },
			{ band: 2, gain: 0.0 },
			{ band: 3, gain: 0.0 },
			{ band: 4, gain: 0.0 },
			{ band: 5, gain: 0.0 },
			{ band: 6, gain: 0.0 },
			{ band: 7, gain: 0.0 },
			{ band: 8, gain: 0.0 },
			{ band: 9, gain: 0.0 },
			{ band: 10, gain: 0.0 },
			{ band: 11, gain: 0.0 },
			{ band: 12, gain: 0.0 },
			{ band: 13, gain: 0.0 },
			{ band: 14, gain: 0.0 }
		]
	};

	client.player = new PlayerManager(client, config.lavalink.nodes, {
		user: client.user.id,
		shards: (client.shard && client.shard.count) || 1
	});

	client.dev = client.users.get('284754083049504770');

	client.runningDir = __dirname;

	(client.models = {}),
		(client.servers = {}),
		(client.commands = {}),
		(client.utils = {});

	let { models, database } = await dbInit();
	client.models = models;

	const commandFiles = fs
		.readdirSync('./commands')
		.filter(
			(file) =>
				file.endsWith('.js') &&
				!file.startsWith('command') &&
				!file.startsWith('.')
		)
		.map((file) => file.replace('.js', ''));
	for (const file of commandFiles) {
		let command = require(`./commands/${file}`);
		client.commands[command.name] = command;
	}

	const utilFiles = fs
		.readdirSync('./utils')
		.filter(
			(file) =>
				file.endsWith('.js') &&
				!file.startsWith('command') &&
				!file.startsWith('.')
		)
		.map((file) => file.replace('.js', ''));
	for (const file of utilFiles) {
		let util = require(`./utils/${file}`);
		client.utils[util.name] = util;
	}

	client.on('voiceStateUpdate', async (oldState, newState) => {
		let player = await client.player.get(oldState.guild.id);
		if (player) {
			let guild = client.guilds.get(oldState.guild.id);
			if (guild.channels.get(player.channel).members.size === 1)
				client.player.leave(oldState.guild.id);
		}
	});

	new CronJob('0 30 10 * * 1-5', async () => {
		let channels = await client.models.channels.findAll();
		let lunch = await client.utils.lunchEmbed();
		channels.forEach((dbChannel) => {
			let channel = client.channels.get(dbChannel.channelID);
			client.utils.sendMessage(channel, lunch, config.categories.MISC);
		});
	}).start();

	client.user.setActivity('bass boosted music!', { type: 'LISTENING' });

	console.log(` ______     __  __     ______     ______     ______  
/\\  ___\\   /\\ \\/\\ \\   /\\  == \\   /\\  __ \\   /\\__  _\\ 
\\ \\ \\____  \\ \\ \\_\\ \\  \\ \\  __<   \\ \\ \\/\\ \\  \\/_/\\ \\/ 
 \\ \\_____\\  \\ \\_____\\  \\ \\_____\\  \\ \\_____\\    \\ \\_\\ 
  \\/_____/   \\/_____/   \\/_____/   \\/_____/     \\/_/ \n`);

	console.general("I'm running!");
});

client.login(config.token);
