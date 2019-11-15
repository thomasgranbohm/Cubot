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
client.musicIcon = "https://media0.giphy.com/media/8FM8uY0KjydEohrjrh/giphy.gif?cid=790b76115cd926ab4b647a2f4943548e&rid=giphy.gif"
client.foodIcon = "https://cdn.pixabay.com/photo/2018/04/14/07/48/doughnut-3318465_960_720.png"
client.settingIcon = 'https://dev.yommail.tk/static/cog.png'

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

let getMessages = (array, beforeMessage) => {
	let te17b = client.guilds.get("356719938565832704")
	let nicknames = te17b.members.array().map((m) => {
		return { nickname: m.nickname, username: m.user.username }
	})
	console.log(nicknames.find((obj) => {
		return obj.nickname == "Gustav"
	}))
	let citatkanalen = te17b.channels.get("356720321820229632")
	let options = { limit: 100 };
	beforeMessage ? options["before"] = beforeMessage : undefined;
	citatkanalen.fetchMessages(options)
		.then(messages => {
			let mArray = messages.array().map(m => {
				let nickname = nicknames.find((obj) => obj.username == m.author.username)
				return { author: nicknames.find((obj) => obj.username == m.author.username)[0].nickname || m.author.username, content: m.content, createdAt: m.createdAt.toString().substring(0, 24), id: m.id }
			});
			array = array.concat(mArray)
			if (mArray.length < 100) {
				let author = [];
				te17b.members.array().forEach((m) => m.author)
				console.log(author)

				// fs.writeFile('./citat.md', array.map(m => "# " + m.content + "  \n## " + m.author + " at " + m.createdAt + "  \n").join("  \n"), (err) => err ? console.error(err) : undefined);;
			} else {
				return getMessages(array, mArray[mArray.length - 1].id);
			}
		})
}


client.once('ready', () => {
	let job = schedule.scheduleJob("00 30 10 * * 1-6", () => {
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
			name: `Superstore | ${prefix}help`,
			type: 'WATCHING',
			url: 'https://www.imdb.com/title/tt4477976/'
		},
		status: 'online'
	})

	console.log(`Ready at ${new Date().getTime()}!`);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	client.voice.connections.forEach((value, key) => {
		if (value.channel.members.size == 1) {
			client.commands.get("leave").execute(undefined, undefined, key, client);
		}
	})
});

client.on('message', message => {
	if (message.author.id == 536286702365310999 && message.author.bot) {
		if (message.embeds.length > 0 && message.embeds[0].author.name !== 'Idag blir det:') {
			return message.delete({ timeout: 15000 });
		}
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	message.delete({ timeout: 5000 });

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

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
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
