const fs = require('fs');
const Discord = require('discord.js');
const schedule = require('node-schedule');
const {
	token,
	prefix
} = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.utils = new Discord.Collection();
client.queue = new Discord.Collection();
client.playing = new Discord.Collection();
client.connectionTimeout = new Discord.Collection()
client.icon = "https://i.imgur.com/QHHu3vn.gif"

let colorString = "246eb9-e63462-ee7674-b5ef8a-78fecf"

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && !file.startsWith('.'));
const utilFiles = fs.readdirSync('./utils').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
for (const util of utilFiles) {
	const command = require(`./utils/${util}`);
	client.utils.set(command.name, command)
}

const cooldowns = new Discord.Collection();

const textChannelsToSend = []

client.once('ready', () => {
	let job = schedule.scheduleJob("00 00 11 * * 1-6", () => {
		require('./config.json').initializedTextChannels.forEach(obj => {
			let embed = client.utils.get("readFood")
				.execute(client)
			client.channels
				.get(obj.textChannelID)
				.send(embed)
		})
	})
	client.user.setPresence({
		game: {
			name: `Game of Thrones | ${prefix}help`,
			type: 'WATCHING',
			url: 'https://www.imdb.com/title/tt0944947/?ref_=nv_sr_1?ref_=nv_sr_1'
		},
		status: 'online'
	})
	console.log('Ready!');
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	client.voiceConnections.forEach((value, key) => {
		if (value.channel.members.size == 1) {
			client.commands.get("leave").execute(undefined, undefined, key, client);
		}
	})
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return message.delete(5000);

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 0) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
		message.delete(1000);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);