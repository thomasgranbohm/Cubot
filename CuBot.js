const Discord = require('discord.js');
const client = (module.exports = new Discord.Client());

const Lavalink = require('discord.js-lavalink');
const { Manager } = require("@lavacord/discord.js");

const config = require('./config.json');
const { promises } = require('fs');
const logger = require('./cli/logger.js')

// Database
const dbInit = require('./models/init');

const CronJob = require('cron').CronJob;

// Loads tokens and such
require('dotenv').config();

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
		if (command.category === config.categories.ADMIN && author.id !== client.dev.id)
			toSend = new Error('You dont have permission to run that command.');
		else if (command.args && !args.length) {
			toSend = new Error(`You didn't provide any arguments.`);
		}
		else toSend = await command(message, args);
		client.utils.sendMessage(channel, toSend, command.category, author);
	} catch (error) {
		await client.utils.sendError(message, error);
	}
});

client.on('ready', async () => {
	logger.print(`   ___     ___      _   
  / __|  _| _ ) ___| |_ 
 | (_| || | _ \\/ _ \\  _|
  \\___\\_,_|___/\\___/\\__|
`);

	// Setup webserver
	//	require('./webserver/server')

	process.on('uncaughtException', (err) => logger.error(err));
	process.on('unhandledRejection', (reason) => logger.error(reason));

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
			{ band: 14, gain: 1 },
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
			{ band: 14, gain: -0.1 },
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
			{ band: 14, gain: 0.0 },
		],
	};

	client.manager = new Manager(client, config.lavalink.nodes, {
		user: client.user.id,
		shards: (client.shard && client.shard.count) || 1,
	});

	await client.manager.connect();
	client.manager.on("error", (error, node) => {
		console.error(error, node)
	});

	client.dev = await client.users.fetch('284754083049504770');

	client.runningDir = __dirname;

	(client.models = {}),
		(client.servers = {}),
		(client.commands = {}),
		(client.utils = {});

	let { models, database } = await dbInit();
	client.models = models;

	(await promises
		.readdir('./commands'))
		.filter(
			(file) =>
				file.endsWith('.js') &&
				!file.startsWith('command') &&
				!file.startsWith('.'),
		)
		.map((file) => file.replace('.js', ''))
		.forEach((file) => {
			let command = require(`./commands/${file}`);
			client.commands[command.name] = command;
		});

	(await promises
		.readdir('./utils'))
		.filter(
			(file) =>
				file.endsWith('.js') &&
				!file.startsWith('command') &&
				!file.startsWith('.'),
		)
		.map((file) => file.replace('.js', ''))
		.forEach((file) => {
			let util = require(`./utils/${file}`);
			client.utils[util.name] = util;
		});

	client.on('voiceStateUpdate', async (oldState, newState) => {
		let player = await client.manager.players.get(oldState.guild);
		if (player) {
			let guild = client.guilds.get(oldState.guild.id);
			if (guild.channels.get(player.channel).members.size === 1)
				client.manager.leave(oldState.guild.id);
		}
	});

	new CronJob('0 30 10 * * 1-5', async () => {
		if (process.env.QUARANTINE) return;
		let channels = await client.models.channels.findAll();
		let lunch = await client.utils.lunchEmbed();
		channels.forEach((dbChannel) => {
			let channel = client.channels.get(dbChannel.channelID);
			client.utils.sendMessage(channel, lunch, config.categories.MISC);
		});
	}).start();

	client.user.setActivity('you. !help', { type: 'WATCHING' });

	logger.log("I'm running!");
});

client.on('guildCreate', async (guild) => {
	let welcomeEmbed = new Discord.MessageEmbed();
	let logs = await guild.fetchAuditLogs();
	let addingEntry = logs.entries.first();
	let { executor } = addingEntry;
	let { commands, utils } = client;
	let { categories, prefix } = config;
	welcomeEmbed.setTimestamp()
		.setTitle(`Thanks for inviting me, ${executor.username} :relaxed:`)
		.setDescription(
			`Here is a little something to help you get started.

My prefix is \`${prefix}\`, and use it like this \`${prefix}[command]\`

**These are my most essential commands:**
 - ${utils.getHelp(commands.boost)}
 - ${utils.getHelp(commands.invite)}
 - ${utils.getHelp(commands.now)}
 - ${utils.getHelp(commands.play)}
 - ${utils.getHelp(commands.skip)}
 - ${utils.getHelp(commands.volume)}
 - ${utils.getHelp(commands.weather)}

**Oh yea, I have equalizers, but only three at the moment.**
 - Flat
 - Boost
 - Earrape

To get the full list of commands, just run \`${prefix}${commands.help.name}\`.`
		)
		.setColor(categories.MISC)
		.setFooter(`Created by ${client.dev.username}`, client.dev.avatarURL())
	guild.systemChannel.send(welcomeEmbed);
})

client.login(process.env.DISCORD_TOKEN);
