const Util = require('./util.js');
const axios = require('axios')
const config = require('../config.json')
module.exports = class getAudio extends Util {
	constructor() {
		super();

		this.name = 'getAudio';
	}
	run = async (query) => {
		const res = await axios.get(`http://${config.lavalink.host}:${config.lavalink.port}/loadtracks?identifier=${encodeURIComponent(query)}`, {
			headers: {
				Authorization: config.lavalink.password
			}
		})
		return res.data.tracks;
	}
}