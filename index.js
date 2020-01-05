const config = require('./config.json');
const fs = require('fs');
const Discord = require('discord.js');
const axios = require('axios')
const Lavalink = require('discord.js-lavalink');
const { PlayerManager } = Lavalink;
const client = new Discord.Client();

client.servers = {}
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && (!file.startsWith('command') && !file.startsWith('.')));
for (const file of commandFiles) {
	const c = require(`./commands/${file}`);
	const command = new c();
	client.commands.set(command.name, command);
}

// TODO utils
client.utils = new Discord.Collection();
const utilFiles = fs.readdirSync('./utils').filter(file => file.endsWith('.js') && (!file.startsWith('command') && !file.startsWith('.')));
for (const file of utilFiles) {
	const c = require(`./utils/${file}`);
	const command = new c();
	client.utils.set(command.name, command);
}

client.on('message', (message) => {
	let content = message.content.split("");
	if (content.shift() !== config.prefix) return null;
	content = content.join("").split(" ")
	let args = message.content.slice(config.prefix.length).split(/ +/);
	let commandName = args.shift().toLowerCase();

	let command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	try {
		command.run(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
})

client.boost = async (message, args) => {
	const player = client.player.get(message.guild.id)
	if (!player)
		message.channel.send("I'm not playing anything.")

	let boost = client.servers[message.guild.id].boost;
	if (!boosted)
		await player.setEQ([{ "band": 0, "gain": -0.075 }, { "band": 1, "gain": .125 }, { "band": 2, "gain": .125 }, { "band": 3, "gain": .1 }, { "band": 4, "gain": .1 }, { "band": 5, "gain": .05 }, { "band": 6, "gain": 0.075 }, { "band": 7, "gain": .0 }, { "band": 8, "gain": .0 }, { "band": 9, "gain": .0 }, { "band": 10, "gain": .0 }, { "band": 11, "gain": .0 }, { "band": 12, "gain": .125 }, { "band": 13, "gain": .15 }, { "band": 14, "gain": .05 }]);
	else
		await player.setEQ([{ "band": 0, "gain": 0.0 }, { "band": 1, "gain": 0.0 }, { "band": 2, "gain": 0.0 }, { "band": 3, "gain": 0.0 }, { "band": 4, "gain": 0.0 }, { "band": 5, "gain": 0.0 }, { "band": 6, "gain": 0.0 }, { "band": 7, "gain": 0.0 }, { "band": 8, "gain": 0.0 }, { "band": 9, "gain": 0.0 }, { "band": 10, "gain": 0.0 }, { "band": 11, "gain": 0.0 }, { "band": 12, "gain": 0.0 }, { "band": 13, "gain": 0.0 }, { "band": 14, "gain": 0.0 }]);

	message.channel.send(`Changing boosted to: ${!boosted}`)
	client.servers[message.guild.id].boost = !boost
}

client.play = async (message, args) => {
	if (!message.member.voice.channelID)
		message.channel.send("You are not in a voice channel.")

	if (client.player.get(message.guild.id) && message.member.voice.channelID !== guild.player.get(message.guild.id))
		message.channel.send("I'm already in another voice channel.")

	if (!args)
		message.channel.send("You didn't send me anything to play.")

	client.initiatePlayer(message.guild.id);

	let queue = client.getServerQueue(message.guild.id);
	let track = await client.getAudio(args.startsWith('http') ? args : `ytsearch:${args}`)

	if (!track[0]) return message.channels.send('No results found.');
	queue.push(track[0]);

	const player = await client.player.join({
		guild: message.guild.id,
		channel: message.member.voice.channelID,
		host: client.getIdealHost(client)
	})

	client.queueLoop(message, queue, player)
}

client.initiatePlayer = (guildID) => {
	if (!client.servers[guildID]) client.servers[guildID] = { queue: [], boost: false };
}

client.queueLoop = (message, queue, player) => {
	player.play(queue[0].track)

	player.once('end', async () => {
		queue.shift();
		if (queue.length > 0) {
			client.queueLoop(message, queue, player);
		} else {
			delete client.servers[message.guild.id]
		}
	})
}

client.getIdealHost = (client) => {
	// Hederligt stulet
	const foundNode = client.player.nodes.find(node => node.ready && node.region === "amsterdam");
	if (foundNode) return foundNode.host;
	return client.player.nodes.first().host;
}

client.getAudio = async (query) => {
	const res = await axios.get(`http://${config.lavalink.host}:${config.lavalink.port}/loadtracks?identifier=${encodeURIComponent(query)}`, {
		headers: {
			Authorization: config.lavalink.password
		}
	})
	return res.data.tracks;
}

client.getServerQueue = (guildID) => {
	return client.servers[guildID].queue;
}

client.on('ready', () => {
	client.player = new PlayerManager(client, config.lavalink.nodes, {
		user: client.user.id,
		shards: (client.shard && client.shard.count) || 1
	})
	console.log("I'm running!")
})

client.login(config.token);