const Util = require('./util.js');
const axios = require('axios')
const config = require('../config.json')
module.exports = class getAudio extends Util {
	constructor() {
		super();

		this.name = 'getAudio';
	}
	run = async (query, playlist = false) => {
		const res = await axios.get(`http://${config.lavalink.host}:${config.lavalink.port}/loadtracks?identifier=${encodeURIComponent(query)}`, {
			headers: {
				Authorization: config.lavalink.password
			}
		})
		// TODO playlist support
		return res.data.tracks;
		// if (playlist)
		// 	return res.data.tracks
		// return res.data.tracks[0];
	}
}