const Discord = require('discord.js');
const client = (module.exports = new Discord.Client());

const { Manager } = require("@lavacord/discord.js");

const config = require('./config.json');
const logger = require('./cli/logger.js')

// Database
const dbInit = require('./models/init');

const CronJob = require('cron').CronJob;

// Loads tokens and such
require('dotenv').config();

client.on('message', async (message) => {
	let content = message.content.split('');
	if (content.shift() !== config.prefix) return null;
	let channelType = message.channel.type;
	if (channelType == 'text')
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
		else if (command.allowedChannels.includes(channelType) == false) {
			toSend = new Error(`This command cannot be used in this channel.`)
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
		(client.servers = {});

	let { models } = await dbInit();
	client.models = models;

	client.commands = require('./commands/');

	client.utils = require('./utils/');

	client.user.setActivity('you. !help', { type: 'WATCHING' });

	logger.log("I'm running!");
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	let guild = client.guilds.cache.get(oldState.guild.id);
	if (!guild)
		return;

	let voiceChannelID;
	if (oldState.channel) voiceChannelID = oldState.channel.id;
	else if (newState.channel) voiceChannelID = newState.channel.id;
	else return logger.log("NO ID:::::")

	let channel = guild.channels.cache.get(voiceChannelID);
	if (!channel)
		return;

	let isInVoiceChannel = channel.members.get(client.user.id) !== undefined;
	let onlyPersonInVC = (channel.members.size <= 1 && isInVoiceChannel);
	let justLeftVC = !isInVoiceChannel && channel.members.size >= 1 && oldState.member.user == client.user;
	if (onlyPersonInVC || justLeftVC) {
		logger.log("Manager left...")
		client.manager.leave(oldState.guild.id);

		if (client.servers[oldState.guild.id]) {
			logger.log("Deleted server...")
			delete client.servers[oldState.guild.id]
		}
	}
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
