const express = require('express')
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();

const logger = require('../logger/');

const lastParam = process.argv.pop();

if (lastParam === "no-logger")
	app.use(morgan('tiny'));

app.use(cors());

const categories = Object.entries(require('../config.json').categories)
	.map(([key, value]) => {
		return {
			// name: key.substr(0, 1).toUpperCase() + key.substr(1).toLowerCase(),
			name: key,
			color: value
		}
	});

const { WEBSERVER_PORT } = process.env;

app.start = () => {
	let bot = require('../bot');

	const api = express.Router();

	app.use('/public', express.static(path.join(__dirname, 'public')))

	app.use(express.static(path.join(__dirname, 'build')));

	app.use('/api', api);

	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
	});

	api.get('/', (req, res) => {
		let info = {
			guilds: bot.guilds.cache.size,
			members: bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
			players: bot.manager.players.size
		};

		res.send(info);
	})

	api.get('/commands', (req, res) => {
		let commands = Object.entries(bot.commands).map(([key, value]) => {
			return {
				...value,
				name: key,
				category: categories.find(cat => cat.color == value.category)
			}
		})
		res.send({
			commands,
			categories
		})
	})

	api.get('/categories', (req, res) => res.send(categories))

	api.get('/guilds', async (req, res) => {
		let guilds = bot.guilds.cache
			.map(async (guild) => {
				let {
					channels,
					id,
					members,
					name,
					ownerID,
				} = guild;
				return {
					icon: guild.iconURL(),
					channels: channels.cache.size,
					id,
					members: members.cache.size,
					name,
					owner: await bot.users.fetch(ownerID),
				};
			})
			.sort((a, b) => a.name >= b.name)
		res.send(await Promise.all(guilds));
	})

	app.listen(WEBSERVER_PORT, () => {
		logger.log(`Listening on ::${WEBSERVER_PORT}`);
	})
}

module.exports = app;
