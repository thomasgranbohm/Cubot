const express = require('express')
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(morgan('tiny'))
app.use(cors());

const logger = require('../logger/');

const { categories } = require('../config.json');

const { WEBSERVER_PORT } = process.env;

app.start = () => {
	let bot = require('../bot');
	let { commands, utils, guilds } = bot;

	const api = express.Router();

	app.use(express.static(path.join(__dirname, 'build')));

	app.use('/api', api);

	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
	});

	api.get('/', (req, res) => {
		res.send("Hello, world!");
	})

	api.get('/commands', (req, res) => {
		res.send(
			Object.entries(commands).map(([key, value]) => {
				return { ...value, name: key }
			})
		)
	})

	api.get('/utils', (req, res) => {
		res.send(Object.entries(utils).map(([key, value]) => key))
	})

	api.get('/categories', (req, res) => res.send(categories))

	api.get('/guilds', (req, res) => {
		res.send(
			guilds.cache
				.map(guild => {
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
						owner: members.cache.find(m => m.id == ownerID),
					};
				})
				.sort((a, b) => a.name >= b.name)
		)
	})

	app.listen(WEBSERVER_PORT, () => {
		logger.log(`Listening on ::${WEBSERVER_PORT}`);
	})
}


module.exports = app;